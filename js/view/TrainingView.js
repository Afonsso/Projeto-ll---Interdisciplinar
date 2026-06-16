/**
 * TrainingView - Gerencia a renderização da página de Treino/Quizzes
 */
class TrainingView {
    constructor() {
        this.container = null;
    }

    // Inicializar a view
    init(container) {
        this.container = container;
    }

    // Renderizar a lista de mundos
    renderWorlds(worldsData, progressData) {
        const worldsContainer = document.getElementById('worlds-container');
        if (!worldsContainer) return;

        const worldsOrder = ['transito', 'roupas', 'cozinha', 'desporto', 'reflexo'];
        
        let worldsHTML = '<div class="worlds-grid">';

        worldsOrder.forEach(worldId => {
            const world = worldsData[worldId];
            const progress = progressData.getWorldProgress(worldId);
            
            if (!world) return;

            const isUnlocked = progress?.unlocked || false;
            const isCompleted = progress?.completed || false;
            const worldStars = this.calculateWorldStars(progress);
            const maxStars = 15; // 5 níveis x 3 estrelas

            worldsHTML += `
                <div class="world-card ${isUnlocked ? '' : 'locked'} ${isCompleted ? 'completed' : ''}" data-world="${worldId}">
                    <div class="world-header">
                        <div class="world-emoji">${world.emoji}</div>
                        <div class="world-info">
                            <h3>${world.name}</h3>
                            ${!isUnlocked ? '<span class="lock-icon">🔒</span>' : ''}
                            ${isCompleted ? '<span class="completed-badge">✓</span>' : ''}
                        </div>
                    </div>
                    
                    <div class="world-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${(worldStars / maxStars) * 100}%"></div>
                        </div>
                        <div class="stars-display">
                            ${'⭐'.repeat(worldStars)}${'☆'.repeat(maxStars - worldStars)}
                        </div>
                    </div>

                    <div class="world-levels">
                        ${this.renderLevelIndicators(progress)}
                    </div>

                    ${isUnlocked ? `
                        <button class="btn-world" onclick="window.location.href='quiz-${worldId}.html'">
                            ${isCompleted ? 'Repetir' : 'Começar'}
                        </button>
                    ` : `
                        <button class="btn-world disabled" disabled>
                            Bloqueado
                        </button>
                    `}
                </div>
            `;
        });

        worldsHTML += '</div>';
        worldsContainer.innerHTML = worldsHTML;
    }

    // Calcular estrelas de um mundo
    calculateWorldStars(progress) {
        if (!progress || !progress.levels) return 0;
        return Object.values(progress.levels).reduce((sum, level) => sum + level.stars, 0);
    }

    // Renderizar indicadores de níveis
    renderLevelIndicators(progress) {
        if (!progress || !progress.levels) return '';

        let indicators = '<div class="level-indicators">';
        
        for (let i = 1; i <= 5; i++) {
            const level = progress.levels[i];
            const isCompleted = level?.completed || false;
            const stars = level?.stars || 0;
            
            indicators += `
                <div class="level-indicator ${isCompleted ? 'completed' : ''}" title="Nível ${i} - ${stars} estrelas">
                    ${i}
                </div>
            `;
        }
        
        indicators += '</div>';
        return indicators;
    }

    // Renderizar página de um mundo específico
    renderWorldPage(worldData, progress) {
        const worldContainer = document.getElementById('world-page');
        if (!worldContainer) return;

        const worldProgress = progress.getWorldProgress(worldData.id);
        const isBossUnlocked = this.checkBossUnlock(worldProgress);

        let pageHTML = `
            <div class="world-header">
                <div class="world-title">
                    <span class="world-emoji">${worldData.emoji}</span>
                    <h1>${worldData.name}</h1>
                </div>
                <div class="world-stats">
                    <div class="stat">
                        <span class="stat-label">Estrelas:</span>
                        <span class="stat-value">${this.calculateWorldStars(worldProgress)}/15</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Progresso:</span>
                        <span class="stat-value">${this.calculateWorldProgress(worldProgress)}%</span>
                    </div>
                </div>
            </div>

            <div class="world-content">
                <div class="quizzes-section">
                    <h2>Quizzes</h2>
                    <div class="levels-grid">
        `;

        // Renderizar quizzes (níveis 1-3)
        worldData.quizzes.forEach((quiz, index) => {
            const levelId = index + 1;
            const levelProgress = worldProgress?.levels[levelId];
            const isCompleted = levelProgress?.completed || false;
            const stars = levelProgress?.stars || 0;

            pageHTML += `
                <div class="level-card quiz-card ${isCompleted ? 'completed' : ''}">
                    <div class="level-header">
                        <span class="level-number">${levelId}</span>
                        <span class="level-type">Quiz</span>
                    </div>
                    <p class="level-question">${quiz.question}</p>
                    <div class="level-footer">
                        <div class="stars">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
                        <button class="btn-level" onclick="startQuiz('${worldData.id}', ${quiz.id})">
                            ${isCompleted ? 'Repetir' : 'Começar'}
                        </button>
                    </div>
                </div>
            `;
        });

        pageHTML += `
                    </div>
                </div>

                <div class="games-section">
                    <h2>Jogos</h2>
                    <div class="levels-grid">
        `;

        // Renderizar jogos (níveis 4-5)
        worldData.games.forEach((game, index) => {
            const levelId = index + 4;
            const levelProgress = worldProgress?.levels[levelId];
            const isCompleted = levelProgress?.completed || false;
            const stars = levelProgress?.stars || 0;

            pageHTML += `
                <div class="level-card game-card ${isCompleted ? 'completed' : ''}">
                    <div class="level-header">
                        <span class="level-number">${levelId}</span>
                        <span class="level-type">Jogo</span>
                    </div>
                    <h3 class="game-title">${game.title}</h3>
                    <p class="game-description">${game.description}</p>
                    <div class="level-footer">
                        <div class="stars">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
                        <button class="btn-level" onclick="startGame('${worldData.id}', ${game.id})">
                            ${isCompleted ? 'Repetir' : 'Começar'}
                        </button>
                    </div>
                </div>
            `;
        });

        pageHTML += `
                    </div>
                </div>

                <div class="boss-section">
                    <h2>Boss do Mundo</h2>
                    <div class="boss-card ${isBossUnlocked ? 'unlocked' : 'locked'}">
                        <div class="boss-header">
                            <span class="boss-icon">👑</span>
                            <h3>${worldData.boss.title}</h3>
                            ${!isBossUnlocked ? '<span class="lock-icon">🔒</span>' : ''}
                        </div>
                        <p>${worldData.boss.description}</p>
                        ${isBossUnlocked ? `
                            <button class="btn-boss" onclick="startBoss('${worldData.id}')">
                                Desafiar Boss
                            </button>
                        ` : `
                            <p class="boss-locked-message">Complete todos os níveis para desbloquear</p>
                        `}
                    </div>
                </div>
            </div>

            <button class="btn-back" onclick="window.location.href='training.html'">
                ← Voltar aos Mundos
            </button>
        `;

        worldContainer.innerHTML = pageHTML;
    }

    // Verificar se o boss está desbloqueado
    checkBossUnlock(progress) {
        if (!progress || !progress.levels) return false;
        return Object.values(progress.levels).every(level => level.completed);
    }

    // Calcular progresso do mundo em percentagem
    calculateWorldProgress(progress) {
        if (!progress || !progress.levels) return 0;
        
        const totalLevels = Object.keys(progress.levels).length;
        const completedLevels = Object.values(progress.levels).filter(level => level.completed).length;
        
        return Math.round((completedLevels / totalLevels) * 100);
    }

    // Renderizar página de quiz
    renderQuizPage(quizData) {
        const quizContainer = document.getElementById('quiz-container');
        if (!quizContainer) return;

        let quizHTML = `
            <div class="quiz-header">
                <h2>Quiz</h2>
                <div class="quiz-progress">
                    <span id="current-question">1</span> / <span id="total-questions">1</span>
                </div>
            </div>

            <div class="quiz-content">
                <div class="question-card">
                    <p class="question-text">${quizData.question}</p>
                    ${quizData.image ? `<img src="${quizData.image}" alt="Imagem da pergunta" class="question-image">` : ''}
                </div>

                <div class="options-grid">
        `;

        quizData.options.forEach((option, index) => {
            quizHTML += `
                <button class="option-btn" data-index="${index}" onclick="selectOption(${index})">
                    <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                    <span class="option-text">${option}</span>
                </button>
            `;
        });

        quizHTML += `
                </div>
            </div>

            <div class="quiz-footer">
                <button class="btn-submit" id="submit-answer" onclick="submitAnswer()" disabled>
                    Confirmar Resposta
                </button>
            </div>
        `;

        quizContainer.innerHTML = quizHTML;
    }

    // Renderizar página de jogo
    renderGamePage(gameData) {
        const gameContainer = document.getElementById('game-container');
        if (!gameContainer) return;

        let gameHTML = `
            <div class="game-header">
                <h2>${gameData.title}</h2>
                <p class="game-description">${gameData.description}</p>
                ${gameData.timeLimit ? `<div class="timer">⏱️ <span id="game-timer">${gameData.timeLimit}</span>s</div>` : ''}
            </div>

            <div class="game-content" id="game-play-area">
                <!-- Conteúdo específico do jogo será renderizado aqui -->
            </div>

            <div class="game-footer">
                <button class="btn-back-game" onclick="window.location.href='training.html'">
                    ← Sair
                </button>
            </div>
        `;

        gameContainer.innerHTML = gameHTML;
    }

    // Renderizar resultado do quiz/jogo
    renderResult(score, stars, correctAnswers, totalQuestions) {
        const resultContainer = document.getElementById('result-container');
        if (!resultContainer) return;

        resultContainer.innerHTML = `
            <div class="result-card">
                <div class="result-header">
                    <div class="result-icon">${stars === 3 ? '🏆' : stars === 2 ? '🥈' : stars === 1 ? '🥉' : '😅'}</div>
                    <h2>${stars === 3 ? 'Excelente!' : stars === 2 ? 'Muito Bem!' : stars === 1 ? 'Bom!' : 'Tenta Novamente!'}</h2>
                </div>

                <div class="result-stats">
                    <div class="stat">
                        <span class="stat-label">Pontuação:</span>
                        <span class="stat-value">${score}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Estrelas:</span>
                        <span class="stat-value">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Respostas Correctas:</span>
                        <span class="stat-value">${correctAnswers}/${totalQuestions}</span>
                    </div>
                </div>

                <div class="result-actions">
                    <button class="btn-retry" onclick="retryLevel()">
                        ↻ Repetir
                    </button>
                    <button class="btn-continue" onclick="continueToNext()">
                        Continuar →
                    </button>
                </div>
            </div>
        `;
    }
}

export default TrainingView;
