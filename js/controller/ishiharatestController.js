/**
 * js/controller/ishiharatestController.js
 * Camada Controller: Escuta a ação dos teclados e faz a gestão dos passos.
 */

class QuizController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('🚀 Sistema de duplo teclado numérico ativado com sucesso.');
            
            // Não chamamos o refreshUI imediatamente para não desenhar o quiz na introdução
            
            // Configuração dos botões ovais Sim/Não/Talvez na Intro
            document.querySelectorAll('#screen-intro .opt-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const row = e.target.parentElement;
                    row.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    
                    // Condição para mostrar/esconder a pergunta do Tipo
                    if (row.parentElement.id === 'main-daltonismo-question') {
                        const isSim = e.target.getAttribute('data-value') === 'sim';
                        this.view.toggleTypeQuestionBlock(isSim);
                    }
                });
            });

            // Clique no botão Iniciar
            const startBtn = document.getElementById('start-quiz-btn');
            if (startBtn) {
                startBtn.addEventListener('click', () => {
                    this.view.changeScreen('screen-quiz');
                    this.refreshUI(); // Desenha a primeira placa apenas aqui!
                });
            }

            // Clique no link de Ver Resultados Anteriores
            const historyLink = document.getElementById('view-history-btn');
            if (historyLink) {
                historyLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    const log = this.model.getHistoryLog();
                    this.view.renderHistoryEntries(log);
                    this.view.changeScreen('screen-history');
                });
            }
        });
    }

    refreshUI() {
        const plate = this.model.getCurrentPlate();
        const currentIndex = this.model.getCurrentIndex();
        const totalPlates = this.model.getTotalPlates();

        this.view.renderPlate(plate, currentIndex, totalPlates, this.model, (side, value) => {
            // Callback executado ao clicar num número do teclado
            this.model.setDigit(side, value);
            this.refreshUI(); // Atualiza a View para pintar o botão ativo e validar o botão de avançar
        });
    }

    handleClear(side) {
        this.model.clearDigit(side);
        this.refreshUI();
    }

    handleNextClick() {
        const hasMore = this.model.saveCurrentAnswerAndAdvance();
        
        if (hasMore) {
            this.refreshUI();
        } else {
            const quizData = this.model.getQuizData();
            const userAnswers = this.model.getAnswers();
            const metrics = this.model.calculateResults();
            
            // NOVO: Grava no histórico local assim que o teste termina
            this.model.saveTestToHistory(metrics);
            
            this.view.renderFinalResults(quizData, userAnswers, metrics);
        }
    }
}

// Inicializa a orquestração global
window.quizController = new QuizController(window.quizModel, window.quizView);
window.quizController.init();