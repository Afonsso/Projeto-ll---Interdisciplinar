/**
 * Auth Service - Gerencia autenticação de utilizadores
 */
class AuthService {
    constructor(storageService) {
        this.storageService = storageService;
        this.currentUser = null;
        this.currentSession = null;
    }

    // Inicializar o serviço
    async init() {
        // Tentar carregar sessão do localStorage
        const sessionId = localStorage.getItem('croma_session_id');
        if (sessionId) {
            await this.restoreSession(sessionId);
        }
    }

    // Login
    async login(email, password) {
        try {
            const normalizedEmail = email.trim().toLowerCase();

            // Carregar utilizador do bd.json
            const user = await this.storageService.getUserByEmail(normalizedEmail);
            
            if (!user) {
                throw new Error('Email ou password incorretos');
            }

            // Verificar password (em produção, usar hash)
            if (user.password !== password) {
                throw new Error('Email ou password incorretos');
            }

            // Criar sessão
            const session = await this.storageService.createSession(user.id);
            
            // Guardar sessão no localStorage
            localStorage.setItem('croma_session_id', session.id);
            
            // Atualizar último login
            const updatedUser = await this.storageService.updateUser(user.id, {
                lastLoginDate: new Date().toISOString()
            });

            // Definir utilizador atual
            this.currentUser = updatedUser;
            this.currentSession = session;

            return { success: true, user: this.currentUser, session: this.currentSession };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    }

    // Registro
    async register(userData) {
        try {
            const normalizedUserData = {
                ...userData,
                name: userData.name.trim(),
                email: userData.email.trim().toLowerCase()
            };

            // Validar dados
            if (!normalizedUserData.name || !normalizedUserData.email || !normalizedUserData.password) {
                throw new Error('Todos os campos são obrigatórios');
            }

            // Validar email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(normalizedUserData.email)) {
                throw new Error('Email inválido');
            }

            // Validar password
            if (normalizedUserData.password.length < 6) {
                throw new Error('A password deve ter pelo menos 6 caracteres');
            }

            // Criar utilizador
            const newUser = await this.storageService.addUser(normalizedUserData);
            
            // Criar sessão automaticamente após registro
            const session = await this.storageService.createSession(newUser.id);
            
            // Guardar sessão no localStorage
            localStorage.setItem('croma_session_id', session.id);

            // Definir utilizador atual
            this.currentUser = newUser;
            this.currentSession = session;

            return { success: true, user: this.currentUser, session: this.currentSession };
        } catch (error) {
            console.error('Register error:', error);
            return { success: false, error: error.message };
        }
    }

    // Logout
    async logout() {
        try {
            if (this.currentSession) {
                await this.storageService.deleteSession(this.currentSession.id);
            }

            // Remover sessão do localStorage
            localStorage.removeItem('croma_session_id');
            localStorage.removeItem('croma_user');
            localStorage.removeItem('croma_progress');

            // Limpar utilizador atual
            this.currentUser = null;
            this.currentSession = null;

            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, error: error.message };
        }
    }

    // Restaurar sessão
    async restoreSession(sessionId) {
        try {
            const session = await this.storageService.getSession(sessionId);
            
            if (!session) {
                // Sessão inválida ou expirada
                localStorage.removeItem('croma_session_id');
                return false;
            }

            // Carregar utilizador da sessão
            const user = await this.storageService.getUserById(session.userId);
            
            if (!user) {
                // Utilizador não encontrado
                localStorage.removeItem('croma_session_id');
                return false;
            }

            this.currentUser = user;
            this.currentSession = session;

            return true;
        } catch (error) {
            console.error('Restore session error:', error);
            localStorage.removeItem('croma_session_id');
            return false;
        }
    }

    // Verificar se está autenticado
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Obter utilizador atual
    getCurrentUser() {
        return this.currentUser;
    }

    // Obter sessão atual
    getCurrentSession() {
        return this.currentSession;
    }

    // Atualizar utilizador atual
    async updateCurrentUser(userData) {
        if (!this.currentUser) {
            throw new Error('Nenhum utilizador autenticado');
        }

        const updatedUser = await this.storageService.updateUser(
            this.currentUser.id,
            userData
        );

        this.currentUser = updatedUser;

        return updatedUser;
    }

    // Verificar se o email já existe
    async checkEmailExists(email) {
        const user = await this.storageService.getUserByEmail(email);
        return user !== null;
    }

    // Alterar password
    async changePassword(currentPassword, newPassword) {
        if (!this.currentUser) {
            throw new Error('Nenhum utilizador autenticado');
        }

        // Verificar password atual
        if (this.currentUser.password !== currentPassword) {
            throw new Error('Password atual incorreta');
        }

        // Validar nova password
        if (newPassword.length < 6) {
            throw new Error('A nova password deve ter pelo menos 6 caracteres');
        }

        // Atualizar password
        await this.storageService.updateUser(this.currentUser.id, {
            password: newPassword
        });

        this.currentUser.password = newPassword;

        return { success: true };
    }

    // Alterar email
    async changeEmail(newEmail) {
        if (!this.currentUser) {
            throw new Error('Nenhum utilizador autenticado');
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail)) {
            throw new Error('Email inválido');
        }

        // Verificar se o email já existe
        const emailExists = await this.checkEmailExists(newEmail);
        if (emailExists) {
            throw new Error('Email já está em uso');
        }

        // Atualizar email
        await this.storageService.updateUser(this.currentUser.id, {
            email: newEmail.toLowerCase()
        });

        this.currentUser.email = newEmail.toLowerCase();

        return { success: true };
    }

    // Eliminar conta
    async deleteAccount() {
        if (!this.currentUser) {
            throw new Error('Nenhum utilizador autenticado');
        }

        // Remover utilizador
        await this.storageService.deleteUser(this.currentUser.id);
        
        // Remover todas as sessões do utilizador
        await this.storageService.deleteUserSessions(this.currentUser.id);

        // Fazer logout
        await this.logout();

        return { success: true };
    }

    // Login como convidado
    loginAsGuest() {
        localStorage.setItem('croma_guest', 'true');
        return { success: true };
    }

    // Verificar se é convidado
    isGuest() {
        return localStorage.getItem('croma_guest') === 'true';
    }

    // Logout como convidado
    logoutGuest() {
        localStorage.removeItem('croma_guest');
        return { success: true };
    }
}

export default AuthService;
