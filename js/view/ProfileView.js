/**
 * ProfileView - Gerencia a renderização da página de Perfil
 */
class ProfileView {
    constructor() {
        this.container = null;
        this.avatars = [
            'dog.png',
            'dog (1).png',
            'bear.png',
            'chicken.png',
            'rabbit.png',
            'giraffe.png',
            'gorilla.png',
            'lion.png',
            'duck.png',
            'penguin.png',
            'fox.png',
            'bear.png'
        ];
        this.currentAvatarIndex = 0;
    }

    // Inicializar a view
    init(container) {
        this.container = container;
    }

    // Renderizar informações do utilizador
    renderUserInfo(user) {
        const userName = document.getElementById('user-name');
        const userEmail = document.getElementById('user-email');
        const userAvatar = document.getElementById('user-avatar');

        if (userName) userName.textContent = user.name;
        if (userEmail) userEmail.textContent = user.email;
        if (userAvatar) {
            userAvatar.src = `../imagens/${user.avatar}`;
            this.currentAvatarIndex = this.avatars.indexOf(user.avatar);
            if (this.currentAvatarIndex === -1) this.currentAvatarIndex = 0;
        }
    }

    // Renderizar estatísticas do utilizador
    renderUserStats(user, progress) {
        const totalXP = document.getElementById('total-xp');
        const currentStreak = document.getElementById('current-streak');
        const progressText = document.getElementById('progress-text');

        if (totalXP) totalXP.textContent = `${user.xp} XP`;
        if (currentStreak) currentStreak.textContent = `${user.streak} dias`;
        if (progressText) {
            const totalLevels = Object.values(progress.worlds)
                .reduce((sum, world) => sum + Object.keys(world.levels || {}).length, 0);
            const completedLevels = progress.completedLevels.length;
            const percentage = Math.round((completedLevels / totalLevels) * 100);
            progressText.textContent = `${percentage}%`;
        }
    }

    // Renderizar atividade recente
    renderRecentActivity(progress) {
        const recentContainer = document.getElementById('recent-worlds-container');
        if (!recentContainer) return;

        const recentActivity = progress.recentActivity.slice(0, 3);

        if (recentActivity.length === 0) {
            recentContainer.innerHTML = `
                <p class="no-activity">Ainda não há atividade recente. Começa a treinar!</p>
            `;
            return;
        }

        const worldEmojis = {
            transito: '🚦',
            roupas: '👚',
            cozinha: '🍽️',
            desporto: '⚽'
        };

        const worldNames = {
            transito: 'Trânsito',
            roupas: 'Roupas & Estilo',
            cozinha: 'Comida & Alimentação',
            desporto: 'Desporto'
        };

        recentContainer.innerHTML = recentActivity.map(activity => `
            <div class="recent-item-card">
                <div class="item-icon-bg">${worldEmojis[activity.worldId] || '🎮'}</div>
                <div class="item-info">
                    <h4>${worldNames[activity.worldId] || activity.worldId}</h4>
                    <p>Nível ${activity.levelId} - ${activity.xp || 0} XP</p>
                </div>
                <button class="btn-action-replay" data-replay-world="${activity.worldId}" data-replay-level="${activity.levelId}">↻</button>
            </div>
        `).join('');
    }

    // Renderizar testes completados
    renderCompletedTests(progress) {
        const testsContainer = document.getElementById('completed-tests-container');
        if (!testsContainer) return;

        const completedLevels = progress.completedLevels;

        if (completedLevels.length === 0) {
            testsContainer.innerHTML = `
                <p class="no-tests">Ainda não completaste nenhum teste.</p>
            `;
            return;
        }

        const worldEmojis = {
            transito: '🚦',
            roupas: '👚',
            cozinha: '🍽️',
            desporto: '⚽'
        };

        const worldNames = {
            transito: 'Trânsito',
            roupas: 'Roupas & Estilo',
            cozinha: 'Comida & Alimentação',
            desporto: 'Desporto'
        };

        // Agrupar por mundo
        const worldStats = {};
        completedLevels.forEach(levelKey => {
            const [worldId, levelId] = levelKey.split('-');
            if (!worldStats[worldId]) {
                worldStats[worldId] = {
                    name: worldNames[worldId],
                    emoji: worldEmojis[worldId],
                    maxLevel: 0,
                    totalStars: 0
                };
            }
            worldStats[worldId].maxLevel = Math.max(worldStats[worldId].maxLevel, parseInt(levelId));
            
            const levelProgress = progress.worlds[worldId]?.levels[levelId];
            if (levelProgress) {
                worldStats[worldId].totalStars += levelProgress.stars;
            }
        });

        testsContainer.innerHTML = Object.values(worldStats).map(world => `
            <div class="test-item-card">
                <div class="test-header-info">
                    <h4>${world.name}</h4>
                    <span class="test-card-icon">${world.emoji}</span>
                </div>
                <p class="test-level">Nível ${world.maxLevel}</p>
                <div class="test-footer-row">
                    <div class="test-stars">${'⭐'.repeat(Math.min(world.totalStars, 3))}${'☆'.repeat(3 - Math.min(world.totalStars, 3))}</div>
                    <button class="btn-test-replay" data-replay-world-name="${world.name}">↻</button>
                </div>
            </div>
        `).join('');
    }

    // Renderizar galeria de troféus
    renderTrophies(user, progress) {
        const trophiesContainer = document.getElementById('trophies-container');
        if (!trophiesContainer) return;

        const trophies = this.calculateTrophies(user, progress);

        trophiesContainer.innerHTML = trophies.map(trophy => `
            <div class="trophy-card ${trophy.unlocked ? 'unlocked' : 'locked'}">
                <div class="trophy-icon">${trophy.icon}</div>
                <h4>${trophy.name}</h4>
                <p>${trophy.description}</p>
                ${!trophy.unlocked ? `<span class="trophy-progress">${trophy.progress}</span>` : '<span class="trophy-unlocked">✓ Desbloqueado</span>'}
            </div>
        `).join('');
    }

    // Calcular troféus desbloqueados
    calculateTrophies(user, progress) {
        const trophies = [
            {
                id: 'first_quiz',
                name: 'Primeiro Passo',
                description: 'Completa o teu primeiro quiz',
                icon: '🎯',
                unlocked: progress.completedLevels.length > 0,
                progress: progress.completedLevels.length > 0 ? '' : '0/1 quizzes'
            },
            {
                id: 'streak_3',
                name: 'Consistência',
                description: 'Mantém um streak de 3 dias',
                icon: '🔥',
                unlocked: user.streak >= 3,
                progress: user.streak >= 3 ? '' : `${user.streak}/3 dias`
            },
            {
                id: 'streak_7',
                name: 'Dedicado',
                description: 'Mantém um streak de 7 dias',
                icon: '💪',
                unlocked: user.streak >= 7,
                progress: user.streak >= 7 ? '' : `${user.streak}/7 dias`
            },
            {
                id: 'world_complete',
                name: 'Mundo Conquistado',
                description: 'Completa um mundo inteiro',
                icon: '🌍',
                unlocked: Object.values(progress.worlds).some(w => w.completed),
                progress: Object.values(progress.worlds).some(w => w.completed) ? '' : '0/1 mundos'
            },
            {
                id: 'all_stars',
                name: 'Perfeccionista',
                description: 'Consegue 3 estrelas em todos os níveis de um mundo',
                icon: '⭐',
                unlocked: Object.values(progress.worlds).some(w => {
                    if (!w.levels) return false;
                    return Object.values(w.levels).every(l => l.stars === 3);
                }),
                progress: 'Em progresso'
            },
            {
                id: 'xp_500',
                name: 'Aprendiz',
                description: 'Alcança 500 XP',
                icon: '📚',
                unlocked: user.xp >= 500,
                progress: user.xp >= 500 ? '' : `${user.xp}/500 XP`
            },
            {
                id: 'xp_1000',
                name: 'Estudante',
                description: 'Alcança 1000 XP',
                icon: '🎓',
                unlocked: user.xp >= 1000,
                progress: user.xp >= 1000 ? '' : `${user.xp}/1000 XP`
            },
            {
                id: 'xp_5000',
                name: 'Mestre',
                description: 'Alcança 5000 XP',
                icon: '👑',
                unlocked: user.xp >= 5000,
                progress: user.xp >= 5000 ? '' : `${user.xp}/5000 XP`
            }
        ];

        return trophies;
    }

    // Configurar navegação de avatar
    setupAvatarNavigation() {
        const prevBtn = document.getElementById('prev-avatar');
        const nextBtn = document.getElementById('next-avatar');
        const avatarImg = document.getElementById('user-avatar');

        if (prevBtn && nextBtn && avatarImg) {
            prevBtn.addEventListener('click', () => {
                this.currentAvatarIndex = (this.currentAvatarIndex - 1 + this.avatars.length) % this.avatars.length;
                avatarImg.src = `../imagens/${this.avatars[this.currentAvatarIndex]}`;
            });

            nextBtn.addEventListener('click', () => {
                this.currentAvatarIndex = (this.currentAvatarIndex + 1) % this.avatars.length;
                avatarImg.src = `../imagens/${this.avatars[this.currentAvatarIndex]}`;
            });
        }
    }

    // Configurar modal de edição
    setupEditModal(user) {
        const openModalBtn = document.getElementById('open-modal-btn');
        const closeModalBtn = document.getElementById('close-modal-btn');
        const modal = document.getElementById('edit-profile-modal');
        const form = document.getElementById('form-edit-profile');

        if (!modal) return;

        if (openModalBtn) {
            openModalBtn.addEventListener('click', () => {
                modal.classList.add('active');
            });
        }

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('input-name').value;
                const email = document.getElementById('input-email').value;
                const birthDate = document.getElementById('input-birth').value;
                const password = document.getElementById('input-password').value;

                // Atualizar utilizador (será feito pelo controller)
                window.dispatchEvent(new CustomEvent('updateUserProfile', {
                    detail: { name, email, birthDate, password }
                }));

                modal.classList.remove('active');
            });
        }

        // Preencher formulário com dados actuais
        if (document.getElementById('input-name')) {
            document.getElementById('input-name').value = user.name;
        }
        if (document.getElementById('input-email')) {
            document.getElementById('input-email').value = user.email;
        }
        if (document.getElementById('input-birth') && user.birthDate) {
            document.getElementById('input-birth').value = user.birthDate;
        }
    }

    // Atualizar a página de perfil completa
    renderProfile(user, progress) {
        this.renderUserInfo(user);
        this.renderUserStats(user, progress);
        this.renderRecentActivity(progress);
        this.renderCompletedTests(progress);
        this.setupAvatarNavigation();
        this.setupEditModal(user);
    }
}

export default ProfileView;
