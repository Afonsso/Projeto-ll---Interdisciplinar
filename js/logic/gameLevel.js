/**
 * Game Level Logic - Gerencia a lógica relacionada a níveis tipo jogo
 */
class GameLevelLogic {
    constructor(quizModel) {
        this.quizModel = quizModel;
        this.currentGame = null;
        this.timer = null;
        this.timeLeft = 0;
        this.onGameComplete = null;
        this.gameFinished = false;
        this.draggedItemId = null;
    }

    // Obter jogo de um mundo e nível específico
    getGame(worldId, gameId) {
        return this.quizModel.getGame(worldId, gameId);
    }

    // Iniciar um jogo
    startGame(worldId, gameId) {
        const game = this.getGame(worldId, gameId);
        if (!game) {
            console.error('Jogo não encontrado:', worldId, gameId);
            return null;
        }

        this.stopTimer();
        this.gameFinished = false;
        this.currentGame = game;

        return game;
    }

    // Iniciar timer
    startTimer(seconds) {
        this.timeLeft = seconds;
        const timerElement = document.getElementById('game-timer');
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            if (timerElement) {
                timerElement.textContent = this.timeLeft;
            }

            if (this.timeLeft <= 0) {
                this.endGame(false);
            }
        }, 1000);
    }

    // Parar timer
    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    // Obter tempo restante
    getTimeLeft() {
        return this.timeLeft;
    }

    // Inicializar lógica específica do jogo
    initGameLogic(game, gameArea) {
        if (!gameArea) return;

        switch (game.gameType) {
            case 'drag_drop':
                this.initDragDropGame(game, gameArea);
                break;
            case 'matching':
                this.initMatchingGame(game, gameArea);
                break;
            case 'sorting':
                this.initSortingGame(game, gameArea);
                break;
            case 'memory':
                this.initMemoryGame(game, gameArea);
                break;
            case 'speed':
            case 'reaction':
                this.initSpeedGame(game, gameArea);
                break;
            default:
                gameArea.innerHTML = '<p>Jogo não implementado ainda.</p>';
        }
    }

    // Inicializar jogo de drag & drop
    initDragDropGame(game, gameArea) {
        const items = [...game.items].sort(() => Math.random() - 0.5);
        
        gameArea.innerHTML = `
            <div class="drag-drop-container">
                <div class="items-pool">
                    ${items.map((item, index) => `<div class="draggable-item" draggable="true" data-item-id="drag-${index}" data-item-value="${item}">${item}</div>`).join('')}
                </div>
                <div class="drop-zones">
                    ${game.correctOrder.map((item, index) => `
                        <div class="drop-zone" data-position="${index}" data-answer="${item}">
                            Posição ${index + 1}
                        </div>
                    `).join('')}
                </div>
            </div>
            <button class="game-submit-btn" type="button" id="game-submit-btn">Validar</button>
        `;

        this.setupDragDropEvents();

        const submitBtn = document.getElementById('game-submit-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                const zones = [...document.querySelectorAll('.drop-zone')];
                const isCorrect = zones.every((zone) => {
                    const currentValue = zone.dataset.current || '';
                    return currentValue === zone.dataset.answer;
                });
                this.endGame(isCorrect);
            });
        }
    }

    // Configurar eventos de drag & drop
    setupDragDropEvents() {
        const draggables = document.querySelectorAll('.draggable-item');
        const dropZones = document.querySelectorAll('.drop-zone');
        const pool = document.querySelector('.items-pool');

        const clearItemFromCurrentZone = (itemEl) => {
            const parentZone = itemEl.closest('.drop-zone');
            if (!parentZone) {
                return;
            }

            delete parentZone.dataset.current;
            if (!parentZone.querySelector('.draggable-item')) {
                parentZone.classList.remove('filled');
            }
        };

        const placeItemInZone = (itemEl, zone) => {
            if (!itemEl || !zone) {
                return;
            }

            clearItemFromCurrentZone(itemEl);

            const existingItem = zone.querySelector('.draggable-item');
            if (existingItem && pool) {
                clearItemFromCurrentZone(existingItem);
                pool.appendChild(existingItem);
            }

            zone.appendChild(itemEl);
            zone.dataset.current = itemEl.dataset.itemValue || '';
            zone.classList.add('filled');
        };

        draggables.forEach(draggable => {
            draggable.addEventListener('dragstart', (e) => {
                this.draggedItemId = e.target.dataset.itemId;
                e.dataTransfer.setData('text/plain', e.target.dataset.itemId);
            });
        });

        if (pool) {
            pool.addEventListener('dragover', (e) => {
                e.preventDefault();
            });

            pool.addEventListener('drop', (e) => {
                e.preventDefault();
                const itemId = e.dataTransfer.getData('text/plain') || this.draggedItemId;
                const itemEl = document.querySelector(`.draggable-item[data-item-id="${itemId}"]`);
                if (itemEl) {
                    clearItemFromCurrentZone(itemEl);
                    pool.appendChild(itemEl);
                }
            });
        }

        dropZones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
            });

            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                const itemId = e.dataTransfer.getData('text/plain') || this.draggedItemId;
                const itemEl = document.querySelector(`.draggable-item[data-item-id="${itemId}"]`);
                if (!itemEl) {
                    return;
                }

                placeItemInZone(itemEl, zone);
            });

            // Fallback para dispositivos/gestos em que drag-and-drop falha
            zone.addEventListener('click', () => {
                const selected = document.querySelector('.draggable-item.selected-drag-item');
                if (!selected) {
                    return;
                }

                selected.classList.remove('selected-drag-item');
                placeItemInZone(selected, zone);
            });
        });

        draggables.forEach((draggable) => {
            draggable.addEventListener('click', () => {
                draggables.forEach((item) => item.classList.remove('selected-drag-item'));
                draggable.classList.add('selected-drag-item');
            });
        });
    }

    // Inicializar jogo de matching
    initMatchingGame(game, gameArea) {
        const allPairs = [];
        game.pairs.forEach(pair => {
            allPairs.push({ color: pair.color1, pairId: pair.color1 });
            allPairs.push({ color: pair.color2, pairId: pair.color1 });
        });

        const shuffled = allPairs.sort(() => Math.random() - 0.5);

        gameArea.innerHTML = `
            <div class="matching-container">
                <div class="matching-grid">
                    ${shuffled.map((item, index) => `
                        <div class="matching-card" data-index="${index}" data-pair="${item.pairId}">
                            ${item.color}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        this.setupMatchingEvents();
    }

    // Configurar eventos de matching
    setupMatchingEvents() {
        const cards = document.querySelectorAll('.matching-card');
        let firstCard = null;
        let matchedPairs = 0;

        cards.forEach(card => {
            card.addEventListener('click', () => {
                if (card.classList.contains('matched') || card === firstCard) return;

                card.classList.add('flipped');

                if (!firstCard) {
                    firstCard = card;
                } else {
                    const firstPair = firstCard.dataset.pair;
                    const secondPair = card.dataset.pair;

                    if (firstPair === secondPair) {
                        firstCard.classList.add('matched');
                        card.classList.add('matched');
                        matchedPairs++;

                        if (matchedPairs === 3) {
                            this.endGame(true);
                        }
                    } else {
                        setTimeout(() => {
                            firstCard.classList.remove('flipped');
                            card.classList.remove('flipped');
                        }, 1000);
                    }

                    firstCard = null;
                }
            });
        });
    }

    // Inicializar jogo de sorting
    initSortingGame(game, gameArea) {
        const items = [...game.items].sort(() => Math.random() - 0.5);

        gameArea.innerHTML = `
            <div class="sorting-container">
                <div class="items-to-sort">
                    ${items.map((item, index) => `
                        <div class="sortable-item" draggable="true" data-item-id="sort-${index}" data-state="${item.state}">${item.name}</div>
                    `).join('')}
                </div>
                <div class="sort-bins">
                    <div class="sort-bin" data-type="verde">
                        <h3>Verde</h3>
                    </div>
                    <div class="sort-bin" data-type="madura">
                        <h3>Madura</h3>
                    </div>
                </div>
            </div>
            <button class="game-submit-btn" type="button" id="sorting-submit-btn">Validar</button>
        `;

        this.setupSortingEvents();

        const submitBtn = document.getElementById('sorting-submit-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                const allItems = [...document.querySelectorAll('.sortable-item')];
                const allPlacedInBins = allItems.every((item) => item.closest('.sort-bin'));
                const isCorrect = allPlacedInBins && allItems.every((item) => {
                    const bin = item.closest('.sort-bin');
                    return bin && item.dataset.state === bin.dataset.type;
                });

                this.endGame(isCorrect);
            });
        }
    }

    // Configurar eventos de sorting
    setupSortingEvents() {
        const items = document.querySelectorAll('.sortable-item');
        const bins = document.querySelectorAll('.sort-bin');
        const pool = document.querySelector('.items-to-sort');

        items.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('item-id', e.target.dataset.itemId);
            });
        });

        if (pool) {
            pool.addEventListener('dragover', (e) => {
                e.preventDefault();
            });

            pool.addEventListener('drop', (e) => {
                e.preventDefault();
                const itemId = e.dataTransfer.getData('item-id');
                const itemEl = document.querySelector(`.sortable-item[data-item-id="${itemId}"]`);
                if (itemEl) {
                    pool.appendChild(itemEl);
                }
            });
        }

        bins.forEach(bin => {
            bin.addEventListener('dragover', (e) => {
                e.preventDefault();
            });

            bin.addEventListener('drop', (e) => {
                e.preventDefault();
                const itemId = e.dataTransfer.getData('item-id');
                const itemEl = document.querySelector(`.sortable-item[data-item-id="${itemId}"]`);
                if (!itemEl) {
                    return;
                }

                bin.appendChild(itemEl);
            });
        });
    }

    // Inicializar jogo de memória
    initMemoryGame(game, gameArea) {
        const pairCount = Number(game.pairs) || 6;
        const sourceColors = ['Vermelho', 'Azul', 'Verde', 'Amarelo', 'Roxo', 'Laranja', 'Ciano', 'Rosa'];
        const colors = sourceColors.slice(0, Math.min(pairCount, sourceColors.length));
        const cards = [...colors, ...colors].sort(() => Math.random() - 0.5);

        gameArea.innerHTML = `
            <div class="memory-container">
                <div class="memory-grid">
                    ${cards.map((color, index) => `
                        <div class="memory-card" data-index="${index}" data-color="${color}">
                            <div class="card-front">?</div>
                            <div class="card-back">${color}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        this.setupMemoryEvents(colors.length);
    }

    // Configurar eventos de memória
    setupMemoryEvents(targetPairs) {
        const cards = document.querySelectorAll('.memory-card');
        let firstCard = null;
        let matchedPairs = 0;

        cards.forEach(card => {
            card.addEventListener('click', () => {
                if (card.classList.contains('flipped') || card.classList.contains('matched') || firstCard === card) return;

                card.classList.add('flipped');

                if (!firstCard) {
                    firstCard = card;
                } else {
                    const firstColor = firstCard.dataset.color;
                    const secondColor = card.dataset.color;

                    if (firstColor === secondColor) {
                        firstCard.classList.add('matched');
                        card.classList.add('matched');
                        matchedPairs++;

                        if (matchedPairs === targetPairs) {
                            this.endGame(true);
                        }
                    } else {
                        setTimeout(() => {
                            firstCard.classList.remove('flipped');
                            card.classList.remove('flipped');
                        }, 1000);
                    }

                    firstCard = null;
                }
            });
        });
    }

    // Inicializar jogo de velocidade
    initSpeedGame(game, gameArea) {
        gameArea.innerHTML = `
            <div class="speed-container">
                <div class="score-display">Tempo: <span id="game-timer">${this.timeLeft}</span>s</div>
                <div class="color-display" id="color-display">
                    <div class="color-box" id="current-color"></div>
                </div>
                <div class="color-options" id="color-options">
                    <button class="color-btn" data-color="Vermelho">Vermelho</button>
                    <button class="color-btn" data-color="Azul">Azul</button>
                    <button class="color-btn" data-color="Verde">Verde</button>
                    <button class="color-btn" data-color="Amarelo">Amarelo</button>
                </div>
                <div class="score-display">Pontuação: <span id="current-score">0</span></div>
            </div>
        `;

        this.setupSpeedGame();
    }

    // Configurar jogo de velocidade
    setupSpeedGame() {
        const colors = ['Vermelho', 'Azul', 'Verde', 'Amarelo'];
        const colorDisplay = document.getElementById('current-color');
        const colorBtns = document.querySelectorAll('.color-btn');
        const scoreDisplay = document.getElementById('current-score');
        let score = 0;
        let currentColor = '';

        const showNextColor = () => {
            currentColor = colors[Math.floor(Math.random() * colors.length)];
            colorDisplay.style.backgroundColor = this.getColorCode(currentColor);
            colorDisplay.textContent = currentColor;
        };

        colorBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const selectedColor = btn.dataset.color;
                if (selectedColor === currentColor) {
                    score += 10;
                    scoreDisplay.textContent = score;
                    if (score >= 50) {
                        this.endGame(true);
                        return;
                    }
                    showNextColor();
                }
            });
        });

        showNextColor();
    }

    // Obter código de cor
    getColorCode(colorName) {
        const colorCodes = {
            'Vermelho': '#FF0000',
            'Azul': '#0000FF',
            'Verde': '#00FF00',
            'Amarelo': '#FFFF00'
        };
        return colorCodes[colorName] || '#000000';
    }

    // Finalizar jogo
    endGame(success) {
        if (this.gameFinished) {
            return null;
        }

        this.gameFinished = true;
        this.stopTimer();
        const score = success ? 100 : 0;
        const stars = success ? 3 : 0;

        const result = {
            success,
            score,
            stars
        };

        if (typeof this.onGameComplete === 'function') {
            this.onGameComplete(result);
        }

        return result;
    }

    // Obter jogo atual
    getCurrentGame() {
        return this.currentGame;
    }

    // Resetar jogo
    resetGame() {
        this.stopTimer();
        this.currentGame = null;
        this.timeLeft = 0;
        this.gameFinished = false;
    }

    // Verificar se há jogo ativo
    hasActiveGame() {
        return this.currentGame !== null;
    }

    renderGameModal(worldId, gameId, options = {}) {
        const game = this.startGame(worldId, gameId);
        if (!game) {
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

        titleEl.textContent = game.title || `Nivel ${gameId} - Jogo`;
        descriptionEl.textContent = game.description || 'Completa este desafio para ganhar estrelas e XP.';
        starsEl.textContent = game.timeLimit ? `Tempo: ${game.timeLimit}s` : '';

        contentEl.innerHTML = '<div id="game-play-area" class="game-modal-content"></div>';

        const freshButton = buttonEl.cloneNode(true);
        freshButton.id = 'modal-btn';
        freshButton.type = 'button';
        freshButton.textContent = 'Fechar';
        freshButton.disabled = false;
        buttonEl.parentNode.replaceChild(freshButton, buttonEl);
        freshButton.addEventListener('click', () => {
            this.resetGame();
            const overlay = document.getElementById('modal-overlay');
            if (overlay) {
                overlay.classList.remove('active');
            }
        });

        this.onGameComplete = async (result) => {
            if (!result) {
                return;
            }

            descriptionEl.textContent = result.success
                ? 'Desafio concluido com sucesso!'
                : 'Desafio terminado. Podes tentar novamente.';
            starsEl.textContent = '⭐'.repeat(result.stars) + '☆'.repeat(3 - result.stars);

            if (typeof options.onComplete === 'function') {
                await options.onComplete({
                    worldId,
                    levelId: gameId,
                    correctAnswers: result.success ? 1 : 0,
                    totalQuestions: 1,
                    stars: result.stars,
                    score: result.score
                });
            }
        };

        this.initGameLogic(game, document.getElementById('game-play-area'));

        if (game.timeLimit) {
            this.startTimer(game.timeLimit);
        }
    }
}

export default GameLevelLogic;
