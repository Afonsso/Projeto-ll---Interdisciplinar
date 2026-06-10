
class AuthController {
    constructor(authService, userModel) {
        this.authService = authService;
        this.userModel = userModel;
    }

    // Inicializar o controller
    async init() {
        // Inicializar o serviço de autenticação
        await this.authService.init();
        
        // Configurar o userModel com o authService
        this.userModel.setAuthService(this.authService);
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
