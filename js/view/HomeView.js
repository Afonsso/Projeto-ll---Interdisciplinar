/**
 * HomeView - Gerencia a renderização da página inicial (Dashboard)
 */
class HomeView {
    constructor() {
        this.container = null;
    }

    // Inicializar a view
    init(container) {
        this.container = container;
    }

    // Renderizar sugestões de treino baseadas no progresso
    renderTrainingSuggestions(progressData) {
        const suggestionsContainer = document.getElementById('training-suggestions');
        if (!suggestionsContainer) return;

        const incompleteLevels = progressData.getIncompleteLevels();
        const weakWorlds = progressData.getWeakWorlds();
        const belowMaxStars = progressData.getLevelsBelowMaxStars();

        let suggestionsHTML = '<h3>Sugestões de Treino</h3><div class="suggestions-grid">';

        // Prioridade 1: Níveis não completados
        if (incompleteLevels.length > 0) {
            const firstIncomplete = incompleteLevels[0];
            suggestionsHTML += `
                <div class="suggestion-card priority-high">
                    <div class="suggestion-icon">${firstIncomplete.world.emoji}</div>
                    <div class="suggestion-info">
                        <h4>${firstIncomplete.world.name}</h4>
                        <p>Nível ${firstIncomplete.levelId} - ${firstIncomplete.level.type === 'quiz' ? 'Quiz' : 'Jogo'}</p>
                        <span class="badge">Continuar</span>
                    </div>
                </div>
            `;
        }

        // Prioridade 2: Mundos com menor pontuação
        if (weakWorlds.length > 0) {
            const weakWorld = weakWorlds[0];
            suggestionsHTML += `
                <div class="suggestion-card priority-medium">
                    <div class="suggestion-icon">${weakWorld.world.emoji}</div>
                    <div class="suggestion-info">
                        <h4>${weakWorld.world.name}</h4>
                        <p>Reforço necessário (${Math.round(weakWorld.percentage)}% completo)</p>
                        <span class="badge">Reforçar</span>
                    </div>
                </div>
            `;
        }

        // Prioridade 3: Níveis com menos de 3 estrelas
        if (belowMaxStars.length > 0) {
            const belowMax = belowMaxStars[0];
            suggestionsHTML += `
                <div class="suggestion-card priority-low">
                    <div class="suggestion-icon">${belowMax.world.emoji}</div>
                    <div class="suggestion-info">
                        <h4>${belowMax.world.name}</h4>
                        <p>Nível ${belowMax.levelId} - ${belowMax.level.stars}/3 estrelas</p>
                        <span class="badge">Melhorar</span>
                    </div>
                </div>
            `;
        }

        suggestionsHTML += '</div>';
        suggestionsContainer.innerHTML = suggestionsHTML;
    }

    // Renderizar botão do teste Ishihara
    renderIshiharaButton(ishiharaCompleted) {
        const ishiharaContainer = document.getElementById('ishihara-section');
        if (!ishiharaContainer) return;

        if (ishiharaCompleted) {
            ishiharaContainer.innerHTML = `
                <div class="ishihara-card completed">
                    <h3>Teste Ishihara</h3>
                    <p>✓ Teste realizado</p>
                    <button class="btn-secondary" onclick="window.location.href='html/info_daltonismo.html'">
                        Repetir Teste
                    </button>
                </div>
            `;
        } else {
            ishiharaContainer.innerHTML = `
                <div class="ishihara-card">
                    <h3>Teste Ishihara</h3>
                    <p>Descubra o seu tipo de daltonismo</p>
                    <button class="btn-primary" onclick="window.location.href='html/info_daltonismo.html'">
                        Realizar Teste
                    </button>
                </div>
            `;
        }
    }

    // Renderizar estatísticas rápidas
    renderQuickStats(user, progress) {
        const statsContainer = document.getElementById('quick-stats');
        if (!statsContainer) return;

        statsContainer.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">⭐</div>
                    <div class="stat-value">${progress.totalStars}</div>
                    <div class="stat-label">Estrelas</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">🔥</div>
                    <div class="stat-value">${user.streak}</div>
                    <div class="stat-label">Dias Seguidos</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">🏆</div>
                    <div class="stat-value">${user.xp}</div>
                    <div class="stat-label">XP Total</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">📊</div>
                    <div class="stat-value">${progress.completedLevels.length}</div>
                    <div class="stat-label">Níveis Completos</div>
                </div>
            </div>
        `;
    }

    // Renderizar mensagem de boas-vindas
    renderWelcomeMessage(userName) {
        const welcomeContainer = document.getElementById('welcome-message');
        if (!welcomeContainer) return;

        const hour = new Date().getHours();
        let greeting = 'Bom dia';
        if (hour >= 12 && hour < 18) greeting = 'Boa tarde';
        if (hour >= 18) greeting = 'Boa noite';

        welcomeContainer.innerHTML = `
            <h2>${greeting}, ${userName}!</h2>
            <p>Pronto para continuar o teu treino?</p>
        `;
    }

    // Atualizar a página inicial completa
    renderHome(user, progress) {
        this.renderWelcomeMessage(user.name);
        this.renderQuickStats(user, progress);
        this.renderTrainingSuggestions(progress);
        this.renderIshiharaButton(user.ishiharaCompleted);
    }
}

export default HomeView;
