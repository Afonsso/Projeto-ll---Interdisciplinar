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

    renderQuizModal(worldId, quizId, options = {}) {
        const quiz = this.startQuiz(worldId, quizId);
        if (!quiz) {
            return;
        }

        const titleEl = document.getElementById('modal-titulo');
        const descriptionEl = document.getElementById('modal-descricao');
        const starsEl = document.getElementById('modal-stars');
        const buttonEl = document.getElementById('modal-btn');
        const contentEl = document.getElementById('modal-dynamic-content');

        if (!titleEl || !descriptionEl || !starsEl || !buttonEl || !contentEl) {
            return;
        }

        const questions = Array.isArray(quiz.questions) && quiz.questions.length > 0
            ? quiz.questions.slice(0, 5)
            : [{
                question: quiz.question,
                options: quiz.options,
                correct: Number(quiz.correct) || 0
            }];

        let currentQuestionIndex = 0;
        let correctAnswers = 0;
        let actionButton = buttonEl;

        const replaceActionButton = (label, disabled, onClick) => {
            const freshButton = actionButton.cloneNode(true);
            freshButton.id = 'modal-btn';
            freshButton.type = 'button';
            freshButton.disabled = disabled;
            freshButton.textContent = label;

            actionButton.parentNode.replaceChild(freshButton, actionButton);
            actionButton = freshButton;

            if (typeof onClick === 'function') {
                actionButton.addEventListener('click', onClick);
            }
        };

        const calculateStars = (hits, total) => {
            const percentage = total > 0 ? (hits / total) * 100 : 0;
            if (percentage >= 90) return 3;
            if (percentage >= 40) return 2;
            if (percentage > 0) return 1;
            return 0;
        };

        const closeModal = () => {
            const overlay = document.getElementById('modal-overlay');
            if (overlay) {
                overlay.classList.remove('active');
            }
        };

        const renderCurrentQuestion = () => {
            const currentQuestion = questions[currentQuestionIndex];
            this.selectedAnswer = null;

            titleEl.textContent = quiz.titulo || `Nivel ${quizId} - Quiz`;
            descriptionEl.textContent = `Pergunta ${currentQuestionIndex + 1} de ${questions.length}`;
            starsEl.textContent = '';

            contentEl.innerHTML = `
                <div class="quiz-modal-content">
                    <p class="quiz-question">${currentQuestion.question}</p>
                    <div class="quiz-options">
                        ${currentQuestion.options.map((option, index) => `
                            <button class="quiz-option-btn" type="button" data-option-index="${index}">
                                <span class="quiz-option-letter">${String.fromCharCode(65 + index)}</span>
                                <span class="quiz-option-text">${option}</span>
                                <span class="quiz-option-icon" aria-hidden="true"></span>
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;

            const optionButtons = contentEl.querySelectorAll('.quiz-option-btn');
            optionButtons.forEach((optionButton) => {
                optionButton.addEventListener('click', () => {
                    const optionIndex = Number(optionButton.dataset.optionIndex);
                    this.selectOption(optionIndex);

                    optionButtons.forEach((button) => button.classList.remove('selected'));
                    optionButton.classList.add('selected');
                    actionButton.disabled = false;
                });
            });

            replaceActionButton('Confirmar', true, () => {
                if (this.selectedAnswer === null) {
                    return;
                }

                const isCorrect = this.selectedAnswer === currentQuestion.correct;
                if (isCorrect) {
                    correctAnswers += 1;
                }

                optionButtons.forEach((button, index) => {
                    button.disabled = true;
                    const icon = button.querySelector('.quiz-option-icon');
                    if (index === currentQuestion.correct) {
                        button.classList.add('correct');
                        if (icon) icon.textContent = '✓';
                    } else if (index === this.selectedAnswer && !isCorrect) {
                        button.classList.add('incorrect');
                        if (icon) icon.textContent = '✗';
                    }
                });

                const isLastQuestion = currentQuestionIndex >= questions.length - 1;
                replaceActionButton(isLastQuestion ? 'Concluir' : 'Proxima', false, async () => {
                    if (!isLastQuestion) {
                        currentQuestionIndex += 1;
                        renderCurrentQuestion();
                        return;
                    }

                    const totalQuestions = questions.length;
                    const stars = calculateStars(correctAnswers, totalQuestions);

                    titleEl.textContent = quiz.titulo || `Nivel ${quizId} - Quiz`;
                    descriptionEl.textContent = `Resultado final: ${correctAnswers}/${totalQuestions}`;
                    starsEl.textContent = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
                    contentEl.innerHTML = `
                        <div class="quiz-modal-content">
                            <p class="quiz-question">Completaste este nivel com ${correctAnswers} respostas certas em ${totalQuestions}.</p>
                        </div>
                    `;

                    replaceActionButton('Fechar', false, async () => {
                        if (typeof options.onComplete === 'function') {
                            await options.onComplete({
                                worldId,
                                levelId: quizId,
                                correctAnswers,
                                totalQuestions,
                                stars,
                                score: correctAnswers
                            });
                        }

                        this.resetQuiz();
                        closeModal();
                    });
                });
            });
        };

        renderCurrentQuestion();
    }
}

export default QuizLevelLogic;
