/**
 * js/model/components/ishiharatest.js
 * Camada Model: Armazena a base de dados do teste e gere o estado dos inputs e fases.
 */

const quizDataFase1 = [
    { id: 1, img: "../imagens/teste_daltonismo/placa_1.png", correct: "12" },
    { id: 2, img: "../imagens/teste_daltonismo/placa_2.png", correct: "2" },
    { id: 3, img: "../imagens/teste_daltonismo/placa_3.png", correct: "42" },
    { id: 4, img: "../imagens/teste_daltonismo/placa_4.png", correct: "6" },
    { id: 5, img: "../imagens/teste_daltonismo/placa_5.png", correct: "29" },
    { id: 6, img: "../imagens/teste_daltonismo/placa_6.png", correct: "74" },
    { id: 7, img: "../imagens/teste_daltonismo/placa_7.png", correct: "45" },
    { id: 8, img: "../imagens/teste_daltonismo/placa_8.png", correct: "3" },
    { id: 9, img: "../imagens/teste_daltonismo/placa_9.png", correct: "16" },
    { id: 10, img: "../imagens/teste_daltonismo/placa_10.png", correct: "97" }
];

// Novas placas de classificação adicionadas para a Fase 2
const quizDataFase2 = [
    { id: 11, img: "../imagens/teste_daltonismo/placa_26.png", correct: "26", protan: "6", deutan: "2" },
    { id: 12, img: "../imagens/teste_daltonismo/placa_35.png", correct: "35", protan: "5", deutan: "3" },
    { id: 13, img: "../imagens/teste_daltonismo/placa_42.png", correct: "42", protan: "2", deutan: "4" },
    { id: 14, img: "../imagens/teste_daltonismo/placa_96.png", correct: "96", protan: "6", deutan: "9" }
];

class QuizModel {
    constructor() {
        this.activeQuizSet = [...quizDataFase1];
        this.fase2Active = false;
        this.currentIndex = 0;
        this.userAnswers = [];
        
        this.selectedLeft = "";
        this.selectedRight = "";
        
        // Métricas retidas da Fase 1 para o relatório final
        this.fase1Hits = 0;
        this.fase1Percentage = 100;
    }

    getCurrentPlate() {
        return this.activeQuizSet[this.currentIndex];
    }

    getTotalPlates() {
        return this.activeQuizSet.length;
    }

    getCurrentIndex() {
        return this.currentIndex;
    }

    getQuizData() {
        return this.activeQuizSet;
    }

    getAnswers() {
        return this.userAnswers;
    }

    setDigit(side, value) {
        if (side === 'left') this.selectedLeft = value;
        if (side === 'right') this.selectedRight = value;
    }

    clearDigit(side) {
        if (side === 'left') this.selectedLeft = "";
        if (side === 'right') this.selectedRight = "";
    }

    hasSelection() {
        const plate = this.getCurrentPlate();
        if (!plate) return false;
        
        if (plate.correct.length === 1) {
            return this.selectedLeft !== "";
        }
        return this.selectedLeft !== "" || this.selectedRight !== "";
    }

    buildFinalAnswer() {
        const plate = this.getCurrentPlate();
        if (plate && plate.correct.length === 1) {
            return this.selectedLeft === "" ? "Nenhum" : this.selectedLeft;
        }
        if (this.selectedLeft === "" && this.selectedRight === "") return "Nenhum";
        return `${this.selectedLeft}${this.selectedRight}`;
    }

    saveCurrentAnswerAndAdvance() {
        const finalAns = this.buildFinalAnswer();
        this.userAnswers.push(finalAns);
        
        this.selectedLeft = "";
        this.selectedRight = "";

        // Se chegámos ao fim da Fase 1, avaliamos se precisa de ir para a Fase 2
        if (!this.fase2Active && this.currentIndex === quizDataFase1.length - 1) {
            const f1Metrics = this.calculateFase1Metrics();
            this.fase1Hits = f1Metrics.hits;
            this.fase1Percentage = f1Metrics.percentage;

            // Se a taxa de acerto for inferior a 75%, injeta a Fase 2 no fluxo
            if (this.fase1Percentage < 75) {
                this.activeQuizSet = [...quizDataFase1, ...quizDataFase2];
                this.fase2Active = true;
                this.currentIndex++;
                return "PROSSEGUIR_FASE_2";
            }
        }

        if (this.currentIndex < this.activeQuizSet.length - 1) {
            this.currentIndex++;
            return "AVANCAR";
        }
        return "FIM"; 
    }

    calculateFase1Metrics() {
        let hits = 0;
        quizDataFase1.forEach((plate, index) => {
            const userAns = (this.userAnswers[index] || "").toString().trim();
            if (userAns === plate.correct.toString().trim()) hits++;
        });
        return { hits, percentage: (hits / quizDataFase1.length) * 100 };
    }

    calculateResults() {
        if (!this.fase2Active) {
            let label = 'Indícios de dificuldade na perceção de cores';
            let color = '#ef4444';

            if (this.fase1Percentage === 100) {
                label = 'Visão de cores normal (Tricromata)';
                color = '#10b981';
            } else if (this.fase1Percentage >= 75) {
                label = 'Possível dificuldade ligeira na perceção de cores';
                color = '#f59e0b';
            }

            return {
                hits: this.fase1Hits,
                total: quizDataFase1.length,
                percentage: this.fase1Percentage,
                diagnosis: label,
                color: color
            };
        }

        // Análise Avançada da Fase 2 (Placas de Classificação)
        let protanVotes = 0;
        let deutanVotes = 0;
        let fase2PlatesCount = quizDataFase2.length;

        quizDataFase2.forEach((plate) => {
            // As respostas da fase 2 estão indexadas logo a seguir à fase 1
            const globalIndex = quizDataFase1.length + (plate.id - 11);
            const userAns = (this.userAnswers[globalIndex] || "").toString().trim();

            if (userAns === plate.protan) {
                protanVotes++;
            } else if (userAns === plate.deutan) {
                deutanVotes++;
            }
        });

        let diagnosisLabel = "Daltonismo não especificado";
        let finalColor = "#ef4444";

        if (protanVotes > deutanVotes) {
            diagnosisLabel = "Forte indício de Protanopia (Deficiência no Vermelho)";
        } else if (deutanVotes > protanVotes) {
            diagnosisLabel = "Forte indício de Deuteranopia (Deficiência no Verde)";
        } else {
            diagnosisLabel = "Indícios de Daltonismo Misto (Protanopia e Deuteranopia)";
        }

        return {
            hits: this.fase1Hits, 
            total: quizDataFase1.length,
            percentage: this.fase1Percentage,
            diagnosis: diagnosisLabel,
            color: finalColor
        };
    }
    
    /**
     * Identifica o utilizador autenticado atualmente (via sessão guardada em
     * localStorage) para que o histórico do teste seja guardado no servidor
     * (bd.json), associado à conta, e não apenas no browser local.
     */
    async getAuthenticatedUser() {
        const API_URL = 'http://localhost:3000';
        const sessionId = localStorage.getItem('croma_session_id');
        if (!sessionId) return null;

        try {
            const sessionResponse = await fetch(`${API_URL}/sessions/${encodeURIComponent(sessionId)}`);
            if (!sessionResponse.ok) return null;

            const session = await sessionResponse.json();
            if (!session?.userId) return null;
            if (session.expiresAt && new Date(session.expiresAt) < new Date()) return null;

            const userResponse = await fetch(`${API_URL}/users/${encodeURIComponent(session.userId)}`);
            if (!userResponse.ok) return null;

            return await userResponse.json();
        } catch (error) {
            console.warn('Não foi possível identificar o utilizador autenticado:', error);
            return null;
        }
    }

    /**
     * Guarda o resultado do teste no histórico do utilizador (bd.json),
     * via API REST do json-server. Se não houver utilizador autenticado
     * (ex. convidado a testar sem conta), usa localStorage como reserva
     * para não perder o resultado durante a sessão atual.
     */
    async saveTestToHistory(metrics) {
        const API_URL = 'http://localhost:3000';

        const newEntry = {
            date: new Date().toLocaleString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            score: `${metrics.percentage.toFixed(0)}% (${metrics.hits}/${metrics.total})`,
            diagnosis: metrics.diagnosis
        };

        const user = await this.getAuthenticatedUser();

        if (!user) {
            // Sem conta autenticada: guarda apenas localmente nesta sessão de navegador.
            const currentHistory = JSON.parse(localStorage.getItem('croma_test_history')) || [];
            currentHistory.unshift(newEntry);
            localStorage.setItem('croma_test_history', JSON.stringify(currentHistory));
            return newEntry;
        }

        try {
            const currentHistory = Array.isArray(user.ishiharaHistory) ? user.ishiharaHistory : [];
            const updatedHistory = [newEntry, ...currentHistory];

            const response = await fetch(`${API_URL}/users/${encodeURIComponent(user.id)}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ishiharaHistory: updatedHistory,
                    lastIshiharaResult: newEntry,
                    ishiharaCompleted: true
                })
            });

            if (!response.ok) {
                throw new Error('Falha ao atualizar o histórico no servidor');
            }
        } catch (error) {
            console.error('Erro ao guardar histórico do teste no servidor:', error);
            // Mesmo em caso de falha de rede, guarda localmente para não perder o resultado.
            const currentHistory = JSON.parse(localStorage.getItem('croma_test_history')) || [];
            currentHistory.unshift(newEntry);
            localStorage.setItem('croma_test_history', JSON.stringify(currentHistory));
        }

        return newEntry;
    }

    /**
     * Obtém o histórico de testes do utilizador autenticado (bd.json).
     * Sem conta autenticada, devolve o histórico local da sessão atual.
     */
    async getHistoryLog() {
        const user = await this.getAuthenticatedUser();

        if (!user) {
            return JSON.parse(localStorage.getItem('croma_test_history')) || [];
        }

        return Array.isArray(user.ishiharaHistory) ? user.ishiharaHistory : [];
    }

    /**
     * Guarda o tipo de daltonismo diagnosticado no perfil do utilizador
     * autenticado (bd.json), para que a aplicação possa adaptar o esquema
     * de cores em todas as páginas a partir deste resultado.
     */
    async saveColorBlindnessType(metrics) {
        const API_URL = 'http://localhost:3000';
        const user = await this.getAuthenticatedUser();
        if (!user) return null;

        const normalizedType = window.CromaColorAdapter
            ? window.CromaColorAdapter.normalizeDiagnosisType(metrics.diagnosis)
            : null;

        if (!normalizedType) return null;

        try {
            const response = await fetch(`${API_URL}/users/${encodeURIComponent(user.id)}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ colorBlindnessType: normalizedType })
            });

            if (!response.ok) {
                throw new Error('Falha ao atualizar o tipo de daltonismo no servidor');
            }
        } catch (error) {
            console.error('Erro ao guardar o tipo de daltonismo:', error);
        }

        return normalizedType;
    }
}

window.quizModel = new QuizModel();