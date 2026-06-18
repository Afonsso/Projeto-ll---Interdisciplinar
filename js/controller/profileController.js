
class ProfileController {
    constructor(userModel, progressModel, profileView) {
        this.userModel = userModel;
        this.progressModel = progressModel;
        this.profileView = profileView;
    }

    // Inicializar o controller
    init() {
        this.profileView.init(document.body);
        this.loadProfileData();
        this.setupEventListeners();
    }

    // Carregar dados do perfil
    loadProfileData() {
        const user = this.userModel.getUser();
        const progress = this.progressModel.getProgress();

        this.profileView.renderProfile(user, progress);
    }

    // Configurar event listeners
    setupEventListeners() {
        // Atualizar perfil
        window.addEventListener('updateUserProfile', (e) => {
            this.handleProfileUpdate(e.detail);
        });

        const avatarTrigger = document.getElementById('avatar-toggle-trigger');
        const prevAvatarBtn = document.getElementById('prev-avatar');
        const nextAvatarBtn = document.getElementById('next-avatar');

        if (avatarTrigger && prevAvatarBtn && nextAvatarBtn) {
            avatarTrigger.addEventListener('click', () => {
                prevAvatarBtn.classList.toggle('visible');
                nextAvatarBtn.classList.toggle('visible');
            });
        }

        const onAvatarChange = () => {
            this.persistCurrentAvatar();
        };

        if (prevAvatarBtn) {
            prevAvatarBtn.addEventListener('click', onAvatarChange);
        }

        if (nextAvatarBtn) {
            nextAvatarBtn.addEventListener('click', onAvatarChange);
        }

        // Navegação para troféus
        const trophyCard = document.querySelector('.trophy-clickable-card');
        if (trophyCard) {
            trophyCard.addEventListener('click', () => {
                window.location.href = 'trophies.html';
            });
        }

        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }

        document.addEventListener('click', (event) => {
            const replayLevelButton = event.target.closest('[data-replay-world][data-replay-level]');
            if (replayLevelButton) {
                this.replayLevel(
                    replayLevelButton.dataset.replayWorld,
                    replayLevelButton.dataset.replayLevel
                );
                return;
            }

            const replayWorldButton = event.target.closest('[data-replay-world-name]');
            if (replayWorldButton) {
                this.replayWorld(replayWorldButton.dataset.replayWorldName);
            }
        });
    }

    // Lidar com atualização do perfil
    async handleProfileUpdate(data) {
        const { name, email, birthDate, password } = data;

        const updateData = {
            name,
            email,
            birthDate
        };

        const avatarFileName = this.getCurrentAvatarFileName();
        if (avatarFileName) {
            updateData.avatar = avatarFileName;
        }

        if (password) {
            updateData.password = password;
        }

        await this.userModel.updateUser(updateData);

        // Recarregar dados
        this.loadProfileData();

        // Mostrar mensagem de sucesso
        this.showSuccessMessage('Perfil atualizado com sucesso!');
    }

    getCurrentAvatarFileName() {
        const avatarImg = document.getElementById('user-avatar');
        if (!avatarImg?.src) {
            return null;
        }

        return avatarImg.src.split('/').pop() || null;
    }

    async persistCurrentAvatar() {
        const avatarFileName = this.getCurrentAvatarFileName();
        if (!avatarFileName) {
            return;
        }

        const currentUser = this.userModel.getUser();
        if (currentUser?.avatar === avatarFileName) {
            return;
        }

        await this.userModel.updateUser({ avatar: avatarFileName });
    }

    async handleLogout() {
        try {
            await this.userModel.logout();
            window.location.href = '../index.html';
        } catch (error) {
            console.error('Logout error:', error);
            this.showSuccessMessage('Nao foi possivel terminar sessao.');
        }
    }

    // Repetir nível
    replayLevel(worldId, levelId) {
        const worldMap = {
            transito: 'transito',
            roupas: 'roupa',
            cozinha: 'comida',
            desporto: 'desporto'
        };

        const slug = worldMap[worldId] || worldId;
        window.location.href = `mundos/${slug}.html#nivel-${levelId}`;
    }

    // Repetir mundo
    replayWorld(worldName) {
        const worldMap = {
            'Trânsito': 'transito',
            'Roupas & Estilo': 'roupa',
            'Comida & Alimentação': 'comida',
            'Desporto': 'desporto',
        };

        const worldId = worldMap[worldName];
        if (worldId) {
            window.location.href = `mundos/${worldId}.html`;
        }
    }

    // Resetar progresso
    resetProgress() {
        if (confirm('Tem a certeza que deseja resetar todo o progresso? Esta ação não pode ser desfeita.')) {
            this.progressModel.resetProgress();
            this.userModel.resetUser();
            this.loadProfileData();
            this.showSuccessMessage('Progresso resetado com sucesso!');
        }
    }

    // Mostrar mensagem de sucesso
    showSuccessMessage(message) {
        const toast = document.createElement('div');
        toast.className = 'toast success';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Obter estatísticas detalhadas
    getDetailedStats() {
        const user = this.userModel.getUser();
        const progress = this.progressModel.getProgress();

        return {
            user,
            progress,
            weakWorlds: this.progressModel.getWeakWorlds(),
            incompleteLevels: this.progressModel.getIncompleteLevels()
        };
    }
}

export default ProfileController;
