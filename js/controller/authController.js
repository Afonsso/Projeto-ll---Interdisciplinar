
class AuthController {
    constructor(authService, userModel) {
        this.authService = authService;
        this.userModel = userModel;
    }

    // Inicializar o controller
    async init() {
        // Configurar o userModel com o authService
        this.userModel.setAuthService(this.authService);

        this.bindLoginPage();
        this.bindRegisterPage();
    }

    bindLoginPage() {
        const loginForm = document.getElementById('login-form');
        if (!loginForm) return;

        const closeBtn = document.querySelector('.btn-fechar');
        if (closeBtn) {
            closeBtn.addEventListener('click', (event) => {
                event.preventDefault();
                window.location.href = '../../index.html';
            });
        }

        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const email = document.getElementById('email')?.value || '';
            const password = document.getElementById('password')?.value || '';
            const errorDiv = document.getElementById('login-error');
            const successDiv = document.getElementById('login-success');
            const loginBtn = document.getElementById('login-btn');

            this.hideMessage(errorDiv);
            this.hideMessage(successDiv);

            if (loginBtn) {
                loginBtn.disabled = true;
                loginBtn.textContent = 'A entrar...';
            }

            const result = await this.login(email, password);

            if (result.success) {
                this.showMessage(successDiv, 'Login realizado com sucesso! A redirecionar...');
                window.location.replace('../Home.html');
                return;
            }

            this.showMessage(errorDiv, result.error || 'Erro ao fazer login');
            if (loginBtn) {
                loginBtn.disabled = false;
                loginBtn.textContent = 'Entrar';
            }
        });
    }

    bindRegisterPage() {
        const registerForm = document.getElementById('register-form');
        if (!registerForm) return;

        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const nome = document.getElementById('nome')?.value || '';
            const email = document.getElementById('email')?.value || '';
            const idade = Number(document.getElementById('idade')?.value || 0);
            const password = document.getElementById('password')?.value || '';
            const confirmPassword = document.getElementById('confirm-password')?.value || '';

            const errorDiv = document.getElementById('register-error');
            const successDiv = document.getElementById('register-success');
            const registerBtn = document.getElementById('register-btn');

            this.hideMessage(errorDiv);
            this.hideMessage(successDiv);

            if (password !== confirmPassword) {
                this.showMessage(errorDiv, 'As palavras-passe nao coincidem');
                return;
            }

            if (password.length < 6) {
                this.showMessage(errorDiv, 'A palavra-passe deve ter pelo menos 6 caracteres');
                return;
            }

            if (!Number.isFinite(idade) || idade <= 0) {
                this.showMessage(errorDiv, 'Indica uma idade valida');
                return;
            }

            const birthYear = new Date().getFullYear() - idade;
            const birthDate = `${birthYear}-01-01`;

            if (registerBtn) {
                registerBtn.disabled = true;
                registerBtn.textContent = 'A criar conta...';
            }

            const result = await this.register({
                name: nome,
                email,
                password,
                birthDate
            });

            if (result.success) {
                this.showMessage(successDiv, 'Conta criada com sucesso! A redirecionar...');
                window.setTimeout(() => {
                    window.location.href = '../Home.html';
                }, 1200);
                return;
            }

            this.showMessage(errorDiv, result.error || 'Erro ao criar conta');
            if (registerBtn) {
                registerBtn.disabled = false;
                registerBtn.textContent = 'Criar conta';
            }
        });
    }

    showMessage(element, message) {
        if (!element) return;
        element.textContent = message;
        element.style.display = 'block';
    }

    hideMessage(element) {
        if (!element) return;
        element.style.display = 'none';
    }

    // Login
    async login(email, password) {
        return await this.authService.login(email, password);
    }

    // Registro
    async register(userData) {
        return await this.authService.register(userData);
    }

    // Logout
    async logout() {
        const result = await this.authService.logout();
        
        // Limpar o userModel
        this.userModel.resetUser();
        
        return result;
    }

    // Verificar se está autenticado
    isAuthenticated() {
        return this.authService.isAuthenticated();
    }

    // Obter utilizador atual
    getCurrentUser() {
        return this.authService.getCurrentUser();
    }

    // Atualizar perfil do utilizador
    async updateProfile(data) {
        return await this.authService.updateCurrentUser(data);
    }

    // Alterar password
    async changePassword(currentPassword, newPassword) {
        return await this.authService.changePassword(currentPassword, newPassword);
    }

    // Alterar email
    async changeEmail(newEmail) {
        return await this.authService.changeEmail(newEmail);
    }

    // Eliminar conta
    async deleteAccount() {
        return await this.authService.deleteAccount();
    }

    // Verificar se email já existe
    async checkEmailExists(email) {
        return await this.authService.checkEmailExists(email);
    }
}

export default AuthController;
