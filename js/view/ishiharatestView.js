/**
 * js/view/ishiharatestView.js
 * Camada View: Manipulação visual das duas grelhas numéricas independentes.
 */

class QuizView {
    renderPlate(plate, currentIndex, totalPlates, model, onNumberSelect) {
        // Atualiza a imagem central e as metas de progresso
        const imgEl = document.getElementById('current-plate-img');
        const progressEl = document.getElementById('plate-progress');
        const nextButton = document.getElementById('next-plate-btn');

        if (imgEl && plate) imgEl.src = plate.img;
        if (progressEl) progressEl.textContent = `Placa ${currentIndex + 1} de ${totalPlates}`;
        
        if (nextButton) {
            nextButton.textContent = currentIndex === totalPlates - 1 ? 'Ver resultado' : 'Próxima página';
            nextButton.disabled = !model.hasSelection();
        }

        // CONTROLAR EXIBIÇÃO DOS TECLADOS CONFORME ALGARISMOS DA RESPOSTA CORRETA
        const rightKeypadSection = document.getElementById('keypad-section-right');
        
        if (plate && plate.correct.length === 1) {
            // Se for apenas 1 algarismo, esconde o segundo teclado completamente
            if (rightKeypadSection) rightKeypadSection.style.display = 'none';
            model.selectedRight = ""; // Proteção de dados no modelo
        } else {
            // Caso contrário, mostra normalmente
            if (rightKeypadSection) rightKeypadSection.style.display = 'flex';
        }

        // Desenha os dois teclados numéricos
        this.buildKeypadGrid('keypad-left', 'left', model.selectedLeft, onNumberSelect);
        this.buildKeypadGrid('keypad-right', 'right', model.selectedRight, onNumberSelect);
    }

    buildKeypadGrid(containerId, side, currentSelectedValue, onNumberSelect) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';

        // Cria dinamicamente botões ovais de 0 a 9 conforme o layout
        for (let i = 0; i <= 9; i++) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'key-btn';
            btn.textContent = i;

            // Se for o dígito ativo selecionado, aplica o estilo escuro (.active)
            if (currentSelectedValue === i.toString()) {
                btn.classList.add('active');
            }

            btn.onclick = () => onNumberSelect(side, i.toString());
            container.appendChild(btn);
        }
    }

    renderFinalResults(quizData, userAnswers, metrics) {
        const quizScreen = document.getElementById('screen-quiz');
        const resultScreen = document.getElementById('screen-result');
        const tbody = document.getElementById('results-table-body');
        const scoreEl = document.getElementById('final-score');
        const diagLabel = document.getElementById('diagnosis-label');

        if (quizScreen) quizScreen.classList.remove('active');
        if (resultScreen) resultScreen.classList.add('active');

        if (tbody) {
            tbody.innerHTML = '';
            quizData.forEach((plate, index) => {
                const userAns = userAnswers[index] || "Nenhum";
                const isCorrect = userAns.toString().trim() === plate.correct.toString().trim();

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>Placa ${plate.id}</td>
                    <td style="color: ${isCorrect ? '#10b981' : '#ef4444'}; font-weight: 700;">${userAns}</td>
                    <td>${plate.correct}</td>
                `;
                tbody.appendChild(row);
            });
        }

        if (scoreEl) {
            scoreEl.textContent = `Resultado do teste: ${metrics.percentage.toFixed(0)}% (${metrics.hits}/${metrics.total})`;
        }

        if (diagLabel) {
            if (metrics.percentage === 100) {
                diagLabel.textContent = 'Visão de cores normal (Tricromata)';
                diagLabel.style.color = '#10b981';
            } else if (metrics.percentage >= 70) {
                diagLabel.textContent = 'Possível dificuldade ligeira na perceção de cores';
                diagLabel.style.color = '#f59e0b';
            } else {
                diagLabel.textContent = 'Indícios de dificuldade na perceção de cores';
                diagLabel.style.color = '#ef4444';
            }
        }
    }
    
    changeScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const target = document.getElementById(screenId);
        if (target) target.classList.add('active');
    }

    toggleTypeQuestionBlock(show) {
        const typeGroup = document.getElementById('type-question-group');
        if (typeGroup) {
            typeGroup.style.display = show ? 'block' : 'none';
        }
    }

    renderHistoryEntries(historyData) {
        const tbody = document.getElementById('history-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        if (historyData.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding:20px; color:#777;">Nenhum teste registado anteriormente.</td></tr>`;
        } else {
            historyData.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${item.date}</td>
                    <td style="font-weight:bold;">${item.score}</td>
                    <td style="color: ${item.diagnosis.includes('Normal') ? '#10b981' : '#ef4444'}; font-weight:600;">${item.diagnosis}</td>
                `;
                tbody.appendChild(tr);
            });
        }
    }
}

window.quizView = new QuizView();