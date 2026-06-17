/**
 * Init.js - Ponto de entrada da aplicação MVC
 * Este arquivo inicializa e conecta os Modelos, Views e Controllers
 */

import StorageService from './services/storage.js';
import AuthService from './services/auth.js';

import UserModel from './model/userModel.js';
import ProgressModel from './model/progressModel.js';
import QuizModel from './model/quizModel.js';

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
        this.isGuest = false;
    }

    // Inicializar a aplicação
    async init() {
        this.checkGuestMode();
        await this.initializeServices();
        this.initializeModels();
        this.initializeViews();
        this.initializeControllers();
        this.detectCurrentPage();
        await this.initializeCurrentPage();
    }

    // Verificar se é modo convidado
    checkGuestMode() {
        const urlParams = new URLSearchParams(window.location.search);
        this.isGuest = urlParams.get('guest') === 'true';
        console.log('Guest mode:', this.isGuest);
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
        this.models.quiz = new QuizModel();
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
            this.models.quiz,
            this.models.progress,
            this.models.user,
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
        const path = window.location.pathname;
        console.log('Current path:', path);

        if (path.includes('login_account.html')) {
            this.currentPage = 'login';
        } else if (path.includes('create_account.html')) {
            this.currentPage = 'register';
        } else if (path.includes('home.html') || path.endsWith('/html/')) {
            this.currentPage = 'home';
        } else if (path.includes('about.html')) {
            this.currentPage = 'about';
            console.log('Detected about page');
        } else if (path.includes('training.html') || path.includes('quiz-')) {
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

        console.log('Detected page:', this.currentPage);
    }

    // Inicializar a página atual
    async initializeCurrentPage() {
        console.log('Initializing page. isGuest:', this.isGuest, 'currentPage:', this.currentPage);

        // Verificar autenticação para páginas protegidas
        if (this.isProtectedPage() && !this.services.auth.isAuthenticated()) {
            window.location.href = 'auth/login_account.html';
            return;
        }

        switch (this.currentPage) {
            case 'login':
            case 'register':
                // Páginas de autenticação - não precisam de controller específico
                console.log('Página de autenticação carregada');
                break;
            case 'home':
                this.controllers.home.init();
                break;
            case 'about':
                console.log('Initializing about page');
                this.controllers.about.init();
                break;
            case 'training':
                this.handleTrainingPage();
                break;
            case 'profile':
                this.controllers.profile.init();
                break;
            case 'ishihara':
                // Página de teste Ishihara - não precisa de controller MVC
                console.log('Página de teste Ishihara carregada');
                break;
            case 'trophies':
                // Página de troféus - pode usar o profile controller
                this.controllers.profile.init();
                break;
            default:
                this.controllers.home.init();
        }
    }

    // Verificar se a página atual é protegida (requer autenticação)
    isProtectedPage() {
        const protectedPages = ['home', 'training', 'profile', 'trophies'];
        return protectedPages.includes(this.currentPage);
    }

    // Lidar com página de treino (pode ser lista de mundos ou página específica de mundo)
    handleTrainingPage() {
        const path = window.location.pathname;
        
        if (path.includes('quiz-')) {
            // Página específica de um mundo
            const worldId = this.extractWorldIdFromPath(path);
            if (worldId) {
                this.controllers.training.loadWorldPage(worldId);
            } else {
                this.controllers.training.init();
            }
        } else {
            // Página de lista de mundos
            this.controllers.training.init();
        }
    }

    // Extrair worldId do path
    extractWorldIdFromPath(path) {
        const match = path.match(/quiz-([a-z]+)\.html/);
        return match ? match[1] : null;
    }

    // Obter instância de um controller específico
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
