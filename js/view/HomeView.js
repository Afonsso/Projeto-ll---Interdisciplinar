class HomeView {
    constructor() {
        this.container = null;
        this.eye = null;
    }

    init(container) {
        this.container = container;
    }

    renderEyeProgress(user, progress) {
        const container = document.getElementById("eye-progress");
        if (!container) return;

        const totalLevels = progress.totalLevels || 12;
        const completedLevels = progress.completedLevels
            ? progress.completedLevels.length
            : 0;

        const xp = user.xp || 0;
        const maxXp = totalLevels * 100;

        const percentage = maxXp > 0
            ? Math.min(100, Math.round((xp / maxXp) * 100))
            : 0;

        container.innerHTML = `
            <div class="eye-progress-3d-card">
                <div class="eye-progress-head">
                    <h2>Progresso</h2>
                    <span>${percentage}%</span>
                </div>

                <canvas id="eye-canvas"></canvas>

                <div class="progress-bar-wrapper">
                    <div class="progress-fill" style="width:${percentage}%"></div>
                </div>
            </div>
        `;

        const canvas = document.getElementById("eye-canvas");

        if (canvas && !this.eye) {
            import("../model/components/eyeprogress.js")
                .then(module => {
                    this.eye = module.createEyeProgress(canvas, {
                        modelUrl: "../imagens/eye.glb",
                        mode: "animation",
                        idleClips: ["IrisLookAction"],
                        idleTimeScale: 0.3
                    });

                    this.eye.setProgress(xp, maxXp);
                })
                .catch(error => {
                    console.error("Erro ao carregar olho 3D:", error);
                });

            return;
        }

        if (this.eye) {
            this.eye.setProgress(xp, maxXp);
        }
    }

    renderTrainingSuggestions(progressData) {
        const container = document.getElementById("training-suggestions");
        if (!container) return;

        const suggestions = this.getSuggestionItems(progressData);

        if (suggestions.length === 0) {
            container.innerHTML = "";
            return;
        }

        container.innerHTML = `
            <section class="smart-training-card">
                <h2>Treine e melhore as suas dificuldades</h2>

                <div class="smart-training-list">
                    ${suggestions.map(item => `
                        <a href="training.html" class="smart-training-item">
                            <div class="smart-training-icon">${item.icon}</div>

                            <div class="smart-training-text">
                                <h3>${item.title}</h3>
                                <p>${item.description}</p>
                            </div>

                            <div class="smart-training-action">↻</div>
                        </a>
                    `).join("")}
                </div>
            </section>
        `;
    }

    getSuggestionItems(progressData) {
        const worlds = progressData.worlds || {};

        const worldDescriptions = {
            transito: "Sinais, Semáforos, Cores de carros...",
            roupas: "Combinações, Camisolas, Sapatos...",
            cozinha: "Frutas, Pratos, Bebidas...",
            desporto: "Equipamentos, Cores, Equipas..."
        };

        const worldIcons = {
            transito: "🚘",
            roupas: "👕",
            cozinha: "🍎",
            desporto: "⚽"
        };

        const weakWorlds = [];

        for (const worldId in worlds) {
            const world = worlds[worldId];

            if (!world.unlocked) continue;

            const levels = Object.values(world.levels || {});
            const stars = levels.reduce((sum, level) => sum + (level.stars || 0), 0);
            const maxStars = levels.length * 3;

            const percentage = maxStars > 0 ? (stars / maxStars) * 100 : 0;

            weakWorlds.push({
                worldId,
                title: world.name,
                icon: worldIcons[worldId] || world.emoji || "🎯",
                description: worldDescriptions[worldId] || "Treino personalizado...",
                percentage
            });
        }

        return weakWorlds
            .sort((a, b) => a.percentage - b.percentage)
            .slice(0, 3);
    }

    renderIshiharaButton(ishiharaCompleted) {
        const container = document.getElementById("ishihara-section");
        if (!container) return;

        container.innerHTML = ishiharaCompleted
            ? `
                <div class="ishihara-card completed">
                    <h3>Teste Ishihara</h3>
                    <p>✓ Teste realizado</p>
                    <button class="btn-secondary" onclick="window.location.href='info_daltonismo.html'">
                        Repetir Teste
                    </button>
                </div>
            `
            : `
                <div class="ishihara-card">
                    <h3>Teste Ishihara</h3>
                    <p><p>Descubra o seu tipo de daltonismo e receba recomendações personalizadas.</p></p>
                    <button class="btn-primary" onclick="window.location.href='teste_daltonismo.html'">
                        Realizar Teste
                    </button>
                </div>
            `;
    }

    renderChatbotSection(userName) {
        const container = document.getElementById("chatbot-section");
        if (!container) return;

        const displayName = userName || 'utilizador';

        container.innerHTML = `
            <div class="chatbot-home-card">
                <div class="chatbot-home-card-inner">
                    <div class="chatbot-home-card-text">
                        <span class="chatbot-home-eyebrow">Olá, ${displayName}!</span>
                        <h2 class="chatbot-home-title">Chat Bot</h2>
                        <p class="chatbot-home-sub">Ajuda para o seu cotidiano e mais...</p>
                    </div>
                    <div class="chatbot-home-avatar" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="2" y="7" width="20" height="13" rx="3" stroke="currentColor" stroke-width="1.8"/>
                            <circle cx="8.5" cy="13.5" r="2" fill="currentColor"/>
                            <circle cx="15.5" cy="13.5" r="2" fill="currentColor"/>
                            <rect x="6" y="17" width="12" height="1.5" rx="0.75" fill="currentColor"/>
                            <path d="M9 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                        </svg>
                    </div>
                </div>
                <a href="ChatBot.html" class="chatbot-home-cta">
                    <span>Como posso ajudar?</span>
                    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                        <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </a>
            </div>
        `;
    }

    renderQuickStats(user, progress) {
        const container = document.getElementById("quick-stats");
        if (!container) return;

        container.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">⭐</div>
                    <div class="stat-value">${progress.totalStars || 0}</div>
                    <div class="stat-label">Estrelas</div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">🔥</div>
                    <div class="stat-value">${user.streak || 0}</div>
                    <div class="stat-label">Dias Seguidos</div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">🏆</div>
                    <div class="stat-value">${user.xp || 0}</div>
                    <div class="stat-label">XP Total</div>
                </div>
            </div>
        `;
    }

    renderWelcomeMessage(userName) {
    const container = document.getElementById("welcome-message");
    if (!container) return;

    const hour = new Date().getHours();

    let greeting = "Bom dia";
    if (hour >= 12 && hour < 18) greeting = "Boa tarde";
    if (hour >= 18) greeting = "Boa noite";

    container.innerHTML = `
        <section class="home-hero">
            <div>
                <span class="home-eyebrow">Dashboard Croma</span>
                <h1>${greeting}, ${userName}!</h1>
            </div>
        </section>
    `;
}

    isAdminUser(user) {
        return String(user?.email || '').trim().toLowerCase() === 'demo@croma.app';
    }

    renderAdminHomeOnlyWelcome() {
        const sectionsToClear = [
            'quick-stats',
            'eye-progress',
            'training-suggestions',
            'ishihara-section',
            'chatbot-section'
        ];

        sectionsToClear.forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
                element.innerHTML = '';
            }
        });

        const sectionsToHide = document.querySelectorAll('.servicos, .feedbacks');
        sectionsToHide.forEach((section) => {
            section.style.display = 'none';
        });
    }

    renderHome(user, progress) {
        this.renderWelcomeMessage(user.name);

        if (this.isAdminUser(user)) {
            this.renderAdminHomeOnlyWelcome();
            return;
        }

        const statsContainer = document.getElementById("quick-stats");
        if (statsContainer) statsContainer.innerHTML = "";

        this.renderEyeProgress(user, progress);
        this.renderChatbotSection(user.name);
        this.renderTrainingSuggestions(progress);
        this.renderIshiharaButton(user.ishiharaCompleted);
    }
}

export default HomeView;