class UserModel {
    constructor(authService = null) {
        this.authService = authService;
        this.userData = this.loadUserData();
    }

    // Definir o serviço de autenticação
    setAuthService(authService) {
        this.authService = authService;
    }

    // Carregar dados do utilizador do authService
    loadUserData() {
        // Se tiver authService, tentar obter utilizador autenticado
        if (this.authService && this.authService.isAuthenticated()) {
            return this.authService.getCurrentUser();
        }

        // Dados padrão para novo utilizador
        return {
            id: null,
            name: 'Utilizador',
            email: '',
            avatar: 'property 1=cão.png',
            birthDate: '',
            xp: 0,
            streak: 0,
            lastLoginDate: null,
            colorBlindnessType: null, // 'protanopia', 'deuteranopia', 'tritanopia', 'normal'
            ishiharaCompleted: false
        };
    }

    // Guardar dados do utilizador via authService
    async saveUserData() {
        // Se tiver authService, atualizar no bd.json
        if (this.authService && this.authService.isAuthenticated() && this.userData.id) {
            try {
                await this.authService.updateCurrentUser(this.userData);
            } catch (err) {
                console.error('Error updating user in database:', err);
            }
        }
    }

    // Atualizar dados do utilizador
    async updateUser(data) {
        this.userData = { ...this.userData, ...data };
        
        // Se tiver authService, atualizar no bd.json
        if (this.authService && this.authService.isAuthenticated() && this.userData.id) {
            try {
                const updatedUser = await this.authService.updateCurrentUser(this.userData);
                this.userData = updatedUser;
            } catch (error) {
                console.error('Error updating user:', error);
                await this.saveUserData();
            }
        } else {
            await this.saveUserData();
        }
        
        return this.userData;
    }

    // Obter dados do utilizador
    getUser() {
        // Se tiver authService, obter utilizador atual
        if (this.authService && this.authService.isAuthenticated()) {
            this.userData = this.authService.getCurrentUser();
        }
        return this.userData;
    }

    // Verificar se utilizador está autenticado
    isAuthenticated() {
        if (this.authService) {
            return this.authService.isAuthenticated();
        }
        return false;
    }

    // Adicionar XP
    async addXP(amount) {
        this.userData.xp += amount;
        
        // Se tiver authService, atualizar no bd.json
        if (this.authService && this.authService.isAuthenticated() && this.userData.id) {
            try {
                await this.authService.updateCurrentUser({ xp: this.userData.xp });
            } catch (error) {
                console.error('Error updating XP:', error);
                await this.saveUserData();
            }
        } else {
            await this.saveUserData();
        }
        
        return this.userData.xp;
    }

    // Atualizar streak
    async updateStreak() {
        const today = new Date().toDateString();
        const lastLogin = this.userData.lastLoginDate;
        const previousStreak = this.userData.streak;
        const previousLoginDay = lastLogin ? new Date(lastLogin).toDateString() : null;

        if (lastLogin) {
            const lastDate = new Date(lastLogin);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            if (lastDate.toDateString() === yesterday.toDateString()) {
                this.userData.streak += 1;
            } else if (lastDate.toDateString() !== today) {
                this.userData.streak = 1;
            }
        } else {
            this.userData.streak = 1;
        }

        this.userData.lastLoginDate = today;

        const streakChanged = this.userData.streak !== previousStreak;
        const lastLoginChanged = previousLoginDay !== today;

        if (!streakChanged && !lastLoginChanged) {
            return this.userData.streak;
        }
        
        // Se tiver authService, atualizar no bd.json
        if (this.authService && this.authService.isAuthenticated() && this.userData.id) {
            try {
                await this.authService.updateCurrentUser({
                    streak: this.userData.streak,
                    lastLoginDate: this.userData.lastLoginDate
                });
            } catch (error) {
                console.error('Error updating streak:', error);
                await this.saveUserData();
            }
        } else {
            await this.saveUserData();
        }
        
        return this.userData.streak;
    }

    // Definir tipo de daltonismo
    async setColorBlindnessType(type) {
        this.userData.colorBlindnessType = type;
        
        // Se tiver authService, atualizar no bd.json
        if (this.authService && this.authService.isAuthenticated() && this.userData.id) {
            try {
                await this.authService.updateCurrentUser({ colorBlindnessType: type });
            } catch (error) {
                console.error('Error updating color blindness type:', error);
                await this.saveUserData();
            }
        } else {
            await this.saveUserData();
        }
    }

    // Marcar teste Ishihara como completo
    async completeIshihara() {
        this.userData.ishiharaCompleted = true;
        
        // Se tiver authService, atualizar no bd.json
        if (this.authService && this.authService.isAuthenticated() && this.userData.id) {
            try {
                await this.authService.updateCurrentUser({ ishiharaCompleted: true });
            } catch (error) {
                console.error('Error updating Ishihara status:', error);
                await this.saveUserData();
            }
        } else {
            await this.saveUserData();
        }
    }

    // Resetar dados do utilizador
    resetUser() {
        this.userData = this.loadUserData();
    }

    // Logout
    async logout() {
        if (this.authService) {
            await this.authService.logout();
        }
        this.resetUser();
    }
}

export default UserModel;
