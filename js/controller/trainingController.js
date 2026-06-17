import WorldLogic from '../logic/world.js';
import LevelLogic from '../logic/level.js';
import QuizLevelLogic from '../logic/quizLevel.js';
import GameLevelLogic from '../logic/gameLevel.js';

class TrainingController {
    constructor(quizModel, progressModel, userModel, trainingView) {
        this.quizModel = quizModel;
        this.progressModel = progressModel;
        this.userModel = userModel;
        this.trainingView = trainingView;
        this.currentWorld = null;
        
        // Inicializar lógicas separadas
        this.worldLogic = new WorldLogic(quizModel, progressModel);
        this.levelLogic = new LevelLogic(progressModel, userModel);
        this.quizLevelLogic = new QuizLevelLogic(quizModel);
        this.gameLevelLogic = new GameLevelLogic(quizModel);
    }

    // Inicializar o controller
    init() {
        this.trainingView.init(document.body);
        this.loadTrainingData();
    }

    // Carregar dados da página de treino
    loadTrainingData() {
        const worldsData = this.worldLogic.getAllWorlds();
        const progressData = this.progressModel.getProgress();

        this.trainingView.renderWorlds(worldsData, progressData);
    }

    // Carregar página de um mundo específico
    loadWorldPage(worldId) {
        const worldData = this.worldLogic.getWorldData(worldId);
        const progress = this.progressModel.getProgress();

        if (!worldData) {
            console.error('Mundo não encontrado:', worldId);
            return;
        }

        this.currentWorld = worldData;
        this.trainingView.renderWorldPage(worldData, progress);
    }

    // Iniciar um quiz
    startQuiz(worldId, quizId) {
        const quiz = this.quizLevelLogic.startQuiz(worldId, quizId);
        if (!quiz) {
            console.error('Quiz não encontrado:', worldId, quizId);
            return;
        }

        this.trainingView.renderQuizPage(quiz);
    }

    // Selecionar opção no quiz
    selectOption(optionIndex) {
        this.quizLevelLogic.selectOption(optionIndex);
        
        // Atualizar visual das opções
        const optionBtns = document.querySelectorAll('.option-btn');
        optionBtns.forEach((btn, index) => {
            if (index === optionIndex) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });

        // Habilitar botão de submit
        const submitBtn = document.getElementById('submit-answer');
        if (submitBtn) {
            submitBtn.disabled = false;
        }
    }

    // Submeter resposta do quiz
    async submitAnswer() {
        const result = this.quizLevelLogic.submitAnswer();
        if (!result) return;

        const worldId = this.currentWorld?.id || this.detectWorldIdFromURL();
        const quizId = this.quizLevelLogic.getCurrentQuiz().id;
        
        await this.levelLogic.completeLevel(worldId, quizId, result.stars, result.score);

        // Mostrar resultado
        this.trainingView.renderResult(result.score, result.stars, result.isCorrect ? 1 : 0, 1);
    }

    // Iniciar um jogo
    startGame(worldId, gameId) {
        const game = this.gameLevelLogic.startGame(worldId, gameId);
        if (!game) {
            console.error('Jogo não encontrado:', worldId, gameId);
            return;
        }

        this.trainingView.renderGamePage(game);

        // Inicializar lógica específica do jogo
        const gameArea = document.getElementById('game-play-area');
        this.gameLevelLogic.initGameLogic(game, gameArea);
    }

    // Finalizar jogo
    async endGame(success) {
        const result = this.gameLevelLogic.endGame(success);

        const worldId = this.currentWorld?.id || this.detectWorldIdFromURL();
        const gameId = this.gameLevelLogic.getCurrentGame().id || 4;

        await this.levelLogic.completeLevel(worldId, gameId, result.stars, result.score);

        // Mostrar resultado
        this.trainingView.renderResult(result.score, result.stars, result.success ? 1 : 0, 1);
    }

    // Iniciar boss
    startBoss(worldId) {
        const boss = this.worldLogic.getBoss(worldId);
        if (!boss) {
            console.error('Boss não encontrado:', worldId);
            return;
        }

        // Gerar perguntas do boss baseadas nas dificuldades
        const bossQuestions = this.worldLogic.generateBossQuestions(worldId, []);
        boss.questions = bossQuestions;

        this.quizLevelLogic.startQuiz(worldId, boss.id);
        this.trainingView.renderQuizPage(boss);
    }

    // Repetir nível
    retryLevel() {
        if (this.quizLevelLogic.hasActiveQuiz()) {
            const quiz = this.quizLevelLogic.getCurrentQuiz();
            this.startQuiz(this.currentWorld?.id, quiz.id);
        } else if (this.gameLevelLogic.hasActiveGame()) {
            const game = this.gameLevelLogic.getCurrentGame();
            this.startGame(this.currentWorld?.id, game.id);
        }
    }

    // Continuar para o próximo nível
    continueToNext() {
        window.location.href = 'training.html';
    }

    // Detectar worldId da URL
    detectWorldIdFromURL() {
        const path = window.location.pathname;
        const match = path.match(/quiz-([a-z]+)\.html/);
        return match ? match[1] : 'transito';
    }
}

export default TrainingController;
