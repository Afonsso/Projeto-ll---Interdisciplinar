/**
 * js/controller/ishiharatestController.js
 * Camada Controller: Escuta a ação dos teclados e faz a gestão das transições e fases.
 */

class QuizController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('🚀 Controlador CromaApp ativado com suporte a testes adaptativos de Fase 2.');
            
            // Configuração dos botões ovais Sim/Não/Talvez na Intro
            document.querySelectorAll('#screen-intro .opt-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const row = e.target.parentElement;
                    row.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    
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
                    this.refreshUI(); 
                });
            }

            // Clique no botão de Ver Histórico
            const historyLink = document.getElementById('view-history-btn');
            if (historyLink) {
                historyLink.addEventListener('click', async (e) => {
                    e.preventDefault();
                    const log = await this.model.getHistoryLog();
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
            this.model.setDigit(side, value);
            this.refreshUI(); 
        });
    }

    // Acessível pelo atributo onclick="quizController.handleClear(...)" do HTML
    handleClear(side) {
        this.model.clearDigit(side);
        this.refreshUI();
    }

    // Acessível pelo atributo onclick="quizController.handleNextClick()" do HTML
    async handleNextClick() {
        const status = this.model.saveCurrentAnswerAndAdvance();
        
        if (status === "AVANCAR" || status === "PROSSEGUIR_FASE_2") {
            this.refreshUI();
        } else if (status === "FIM") {
            const quizData = this.model.getQuizData();
            const userAnswers = this.model.getAnswers();
            const metrics = this.model.calculateResults();

            // Guarda o resultado no histórico do utilizador (bd.json) e no
            // seu perfil, e adapta de imediato o esquema de cores de TODA a
            // aplicação ao tipo de daltonismo diagnosticado.
            await this.model.saveTestToHistory(metrics);
            await this.model.saveColorBlindnessType(metrics);

            if (window.CromaColorAdapter) {
                window.CromaColorAdapter.applyFromDiagnosis(metrics);
            }

            this.view.renderFinalResults(quizData, userAnswers, metrics);
        }
    }
}

// Inicializa e expõe na janela global para os cliques inline do HTML funcionarem
window.quizController = new QuizController(window.quizModel, window.quizView);
window.quizController.init();