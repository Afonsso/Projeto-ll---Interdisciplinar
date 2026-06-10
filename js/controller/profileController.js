
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

        // Navegação para troféus
        const trophyCard = document.querySelector('.trophy-clickable-card');
        if (trophyCard) {
            trophyCard.addEventListener('click', () => {
                window.location.href = 'trophies.html';
            });
        }
    }

    // Lidar com atualização do perfil
    handleProfileUpdate(data) {
        const { name, email, birthDate, password } = data;

        const updateData = {
            name,
            email,
            birthDate
        };

        if (password) {
            updateData.password = password;
        }

        this.userModel.updateUser(updateData);
        
        // Atualizar avatar se foi alterado
        const avatarImg = document.getElementById('user-avatar');
        if (avatarImg) {
            const currentAvatarSrc = avatarImg.src;
            const avatarFileName = currentAvatarSrc.split('/').pop();
            updateData.avatar = avatarFileName;
            this.userModel.updateUser(updateData);
        }

        // Recarregar dados
        this.loadProfileData();

        // Mostrar mensagem de sucesso
        this.showSuccessMessage('Perfil atualizado com sucesso!');
    }

    // Repetir nível
    replayLevel(worldId, levelId) {
        window.location.href = `quiz-${worldId}.html`;
    }

    // Repetir mundo
    replayWorld(worldName) {
        const worldMap = {
            'Trânsito': 'transito',
            'Roupas': 'roupas',
            'Alimentos': 'cozinha',
            'Desporto': 'desporto',
            'Reflexo': 'reflexo'
        };

        const worldId = worldMap[worldName];
        if (worldId) {
            window.location.href = `quiz-${worldId}.html`;
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
            trophies: this.profileView.calculateTrophies(user, progress),
            weakWorlds: this.progressModel.getWeakWorlds(),
            incompleteLevels: this.progressModel.getIncompleteLevels()
        };
    }
}

export default ProfileController;
