/**
 * Game Level Logic - Gerencia a lógica relacionada a níveis tipo jogo
 */
class GameLevelLogic {
    constructor(quizModel) {
        this.quizModel = quizModel;
        this.currentGame = null;
        this.timer = null;
        this.timeLeft = 0;
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

        this.currentGame = game;
        
        // Iniciar timer se o jogo tiver limite de tempo
        if (game.timeLimit) {
            this.startTimer(game.timeLimit);
        }

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
                    ${items.map(item => `<div class="draggable-item" draggable="true">${item}</div>`).join('')}
                </div>
                <div class="drop-zones">
                    ${game.correctOrder.map((item, index) => `
                        <div class="drop-zone" data-position="${index}" data-answer="${item}">
                            Posição ${index + 1}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        this.setupDragDropEvents();
    }

    // Configurar eventos de drag & drop
    setupDragDropEvents() {
        const draggables = document.querySelectorAll('.draggable-item');
        const dropZones = document.querySelectorAll('.drop-zone');

        draggables.forEach(draggable => {
            draggable.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text', e.target.textContent);
            });
        });

        dropZones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
            });

            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                const item = e.dataTransfer.getData('text');
                zone.textContent = item;
                zone.classList.add('filled');
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
                    ${items.map(item => `
                        <div class="sortable-item" data-state="${item.state}">${item.name}</div>
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
        `;

        this.setupSortingEvents();
    }

    // Configurar eventos de sorting
    setupSortingEvents() {
        const items = document.querySelectorAll('.sortable-item');
        const bins = document.querySelectorAll('.sort-bin');
        let sortedCount = 0;

        items.forEach(item => {
            item.draggable = true;
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text', e.target.dataset.state);
            });
        });

        bins.forEach(bin => {
            bin.addEventListener('dragover', (e) => {
                e.preventDefault();
            });

            bin.addEventListener('drop', (e) => {
                e.preventDefault();
                const itemState = e.dataTransfer.getData('text');
                const binType = bin.dataset.type;

                if (itemState === binType) {
                    sortedCount++;
                    bin.classList.add('correct');
                    
                    if (sortedCount === 4) {
                        this.endGame(true);
                    }
                } else {
                    bin.classList.add('incorrect');
                    setTimeout(() => bin.classList.remove('incorrect'), 1000);
                }
            });
        });
    }

    // Inicializar jogo de memória
    initMemoryGame(game, gameArea) {
        const colors = ['Vermelho', 'Azul', 'Verde', 'Amarelo', 'Roxo', 'Laranja'];
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

        this.setupMemoryEvents();
    }

    // Configurar eventos de memória
    setupMemoryEvents() {
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

                        if (matchedPairs === 6) {
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
        this.stopTimer();
        const score = success ? 100 : 0;
        const stars = success ? 3 : 0;

        return {
            success,
            score,
            stars
        };
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
    }

    // Verificar se há jogo ativo
    hasActiveGame() {
        return this.currentGame !== null;
    }
}

export default GameLevelLogic;
