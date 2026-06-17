/**
 * Init.js - Ponto de entrada da aplicação MVC
 * Este arquivo inicializa e conecta os Modelos, Views e Controllers
 */

import StorageService from './services/storage.js';
import AuthService from './services/auth.js';

import UserModel from './model/userModel.js';
import ProgressModel from './model/progressModel.js';

import HomeView from './view/homeView.js';
import AboutView from './view/aboutView.js';
import TrainingView from './view/trainingView.js';
import ProfileView from './view/profileView.js';

import HomeController from './controller/homeController.js';
import AboutController from './controller/aboutController.js';
import TrainingController from './controller/trainingController.js';
import ProfileController from './controller/profileController.js';
import AuthController from './controller/authController.js';

class App {
    constructor() {
        this.services = {};
        this.models = {};
        this.views = {};
        this.controllers = {};
        this.currentPage = null;
    }

    async init() {
        await this.initializeServices();
        this.initializeModels();
        this.initializeViews();
        this.initializeControllers();
        this.detectCurrentPage();
        await this.initializeCurrentPage();
    }

    // Inicializar Serviços
    async initializeServices() {
        this.services.storage = new StorageService();
        this.services.auth = new AuthService(this.services.storage);
        await this.services.auth.init();
    }

    // Inicializar Modelos
    initializeModels() {
        this.models.user = new UserModel(this.services.auth);
        this.models.progress = new ProgressModel(this.services.auth);
    }

    // Inicializar Views
    initializeViews() {
        this.views.home = new HomeView();
        this.views.about = new AboutView();
        this.views.training = new TrainingView();
        this.views.profile = new ProfileView();
    }

    // Inicializar Controllers
    initializeControllers() {
        this.controllers.auth = new AuthController(
            this.services.auth,
            this.models.user
        );

        this.controllers.home = new HomeController(
            this.models.user,
            this.models.progress,
            this.views.home
        );

        this.controllers.about = new AboutController(
            this.views.about
        );

        this.controllers.training = new TrainingController(
            this.models.progress,
            this.views.training
        );

        this.controllers.profile = new ProfileController(
            this.models.user,
            this.models.progress,
            this.views.profile
        );
    }

    // Detectar a página atual baseado na URL
    detectCurrentPage() {
        const path = window.location.pathname.toLowerCase();

        if (path.includes('login_account.html')) {
            this.currentPage = 'login';
        } else if (path.includes('create_account.html')) {
            this.currentPage = 'register';
        } else if (path.includes('home.html') || path.endsWith('/html/')) {
            this.currentPage = 'home';
        } else if (path.includes('about.html')) {
            this.currentPage = 'about';
        } else if (path.includes('training.html')) {
            this.currentPage = 'training';
        } else if (path.includes('profile.html')) {
            this.currentPage = 'profile';
        } else if (path.includes('info_daltonismo.html')) {
            this.currentPage = 'ishihara';
        } else if (path.includes('trophies.html')) {
            this.currentPage = 'trophies';
        } else {
            this.currentPage = 'home';
        }
    }

    async initializeCurrentPage() {
        if (this.isProtectedPage() && !this.services.auth.isAuthenticated()) {
            window.location.href = 'auth/login_account.html';
            return;
        }

        switch (this.currentPage) {
            case 'login':
            case 'register':
                break;
            case 'home':
                this.controllers.home.init();
                break;
            case 'about':
                this.controllers.about.init();
                break;
            case 'training':
                this.controllers.training.init();
                break;
            case 'profile':
            case 'trophies':
                this.controllers.profile.init();
                break;
            default:
                this.controllers.home.init();
        }
    }

    isProtectedPage() {
        const protectedPages = ['home', 'training', 'profile', 'trophies'];
        return protectedPages.includes(this.currentPage);
    }

    getController(name) {
        return this.controllers[name];
    }

    // Obter instância de um model específico
    getModel(name) {
        return this.models[name];
    }

    // Obter instância de uma view específica
    getView(name) {
        return this.views[name];
    }

    // Obter instância de um service específico
    getService(name) {
        return this.services[name];
    }
}

// Criar instância global da aplicação
let app = null;

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    app = new App();
    app.init();

    // Expor a aplicação globalmente para acesso de outras partes do código
    window.CromaApp = app;
});

// Exportar para uso em módulos
export default App;
