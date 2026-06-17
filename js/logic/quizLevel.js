/**
 * Quiz Level Logic - Gerencia a lógica relacionada a níveis tipo quiz
 */
class QuizLevelLogic {
    constructor(quizModel) {
        this.quizModel = quizModel;
        this.currentQuiz = null;
        this.selectedAnswer = null;
    }

    // Obter quiz de um mundo e nível específico
    getQuiz(worldId, quizId) {
        return this.quizModel.getQuiz(worldId, quizId);
    }

    // Iniciar um quiz
    startQuiz(worldId, quizId) {
        const quiz = this.getQuiz(worldId, quizId);
        if (!quiz) {
            console.error('Quiz não encontrado:', worldId, quizId);
            return null;
        }

        this.currentQuiz = quiz;
        this.selectedAnswer = null;
        return quiz;
    }

    // Selecionar opção no quiz
    selectOption(optionIndex) {
        this.selectedAnswer = optionIndex;
        return this.selectedAnswer;
    }

    // Submeter resposta do quiz
    submitAnswer() {
        if (this.selectedAnswer === null || !this.currentQuiz) {
            return null;
        }

        const isCorrect = this.selectedAnswer === this.currentQuiz.correct;
        const score = isCorrect ? 100 : 0;
        const stars = isCorrect ? 3 : 0;

        return {
            isCorrect,
            score,
            stars,
            selectedAnswer: this.selectedAnswer,
            correctAnswer: this.currentQuiz.correct
        };
    }

    // Obter quiz atual
    getCurrentQuiz() {
        return this.currentQuiz;
    }

    // Obter resposta selecionada
    getSelectedAnswer() {
        return this.selectedAnswer;
    }

    // Resetar quiz
    resetQuiz() {
        this.currentQuiz = null;
        this.selectedAnswer = null;
    }

    // Verificar se há quiz ativo
    hasActiveQuiz() {
        return this.currentQuiz !== null;
    }

    // Obter número de perguntas do quiz
    getQuestionCount() {
        if (!this.currentQuiz || !this.currentQuiz.questions) {
            return 0;
        }
        return this.currentQuiz.questions.length;
    }

    // Obter pergunta específica
    getQuestion(index) {
        if (!this.currentQuiz || !this.currentQuiz.questions) {
            return null;
        }
        return this.currentQuiz.questions[index];
    }

    // Obter todas as perguntas
    getAllQuestions() {
        if (!this.currentQuiz || !this.currentQuiz.questions) {
            return [];
        }
        return this.currentQuiz.questions;
    }

    // Verificar resposta
    checkAnswer(answer) {
        if (!this.currentQuiz) {
            return false;
        }
        return answer === this.currentQuiz.correct;
    }

    // Obter opções do quiz
    getOptions() {
        if (!this.currentQuiz || !this.currentQuiz.options) {
            return [];
        }
        return this.currentQuiz.options;
    }

    // Obter pergunta atual
    getCurrentQuestion() {
        if (!this.currentQuiz) {
            return null;
        }
        return this.currentQuiz.question;
    }
}

export default QuizLevelLogic;
