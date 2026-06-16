/**
 * js/model/components/ishiharatest.js
 * Camada Model: Armazena a base de dados do teste e gere o estado dos inputs.
 */

const quizData = [
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

class QuizModel {
    constructor() {
        this.quizData = quizData;
        this.currentIndex = 0;
        this.userAnswers = [];
        
        // Estado dos inputs dos teclados do ecrã atual
        this.selectedLeft = "";
        this.selectedRight = "";
    }

    getCurrentPlate() {
        return this.quizData[this.currentIndex];
    }

    getTotalPlates() {
        return this.quizData.length;
    }

    getCurrentIndex() {
        return this.currentIndex;
    }

    getQuizData() {
        return this.quizData;
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

    // Verifica se a seleção atual preenche os requisitos mínimos da placa
    hasSelection() {
        const plate = this.getCurrentPlate();
        if (!plate) return false;
        
        // Se a placa só tem 1 algarismo, basta o esquerdo estar preenchido
        if (plate.correct.length === 1) {
            return this.selectedLeft !== "";
        }
        // Se tem 2 algarismos, obriga a que pelo menos um tenha sido selecionado
        return this.selectedLeft !== "" || this.selectedRight !== "";
    }

    // Combina os dois números para formar a resposta final da placa
    buildFinalAnswer() {
        const plate = this.getCurrentPlate();
        
        // Se a placa só exige 1 algarismo, devolve apenas o esquerdo
        if (plate && plate.correct.length === 1) {
            return this.selectedLeft === "" ? "Nenhum" : this.selectedLeft;
        }

        if (this.selectedLeft === "" && this.selectedRight === "") return "Nenhum";
        return `${this.selectedLeft}${this.selectedRight}`;
    }

    saveCurrentAnswerAndAdvance() {
        const finalAns = this.buildFinalAnswer();
        this.userAnswers.push(finalAns);
        
        // Reseta as seleções temporárias para a próxima placa
        this.selectedLeft = "";
        this.selectedRight = "";

        if (this.currentIndex < this.quizData.length - 1) {
            this.currentIndex++;
            return true;
        }
        return false; // Fim do quiz
    }

    calculateResults() {
        let hits = 0;
        this.quizData.forEach((plate, index) => {
            const userAns = (this.userAnswers[index] || "").toString().trim();
            const correctAns = plate.correct.toString().trim();
            
            if (userAns === correctAns) {
                hits++;
            }
        });
        const percentage = (hits / this.quizData.length) * 100;
        return { hits, total: this.quizData.length, percentage };
    }
    
    saveTestToHistory(metrics) {
        const currentHistory = JSON.parse(localStorage.getItem('croma_test_history')) || [];
        
        const newEntry = {
            date: new Date().toLocaleString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit' }),
            score: `${metrics.percentage.toFixed(0)}% (${metrics.hits}/${metrics.total})`,
            diagnosis: metrics.percentage === 100 ? "Visão Normal (Tricromata)" : "Indícios de Daltonismo"
        };
        
        currentHistory.unshift(newEntry);
        localStorage.setItem('croma_test_history', JSON.stringify(currentHistory));
    }

    getHistoryLog() {
        return JSON.parse(localStorage.getItem('croma_test_history')) || [];
    }
}

window.quizModel = new QuizModel();