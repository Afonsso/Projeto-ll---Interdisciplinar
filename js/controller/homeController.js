class HomeController {
    constructor(userModel, progressModel, homeView) {
        this.userModel = userModel;
        this.progressModel = progressModel;
        this.homeView = homeView;
    }

    // Inicializar o controller
    init() {
        this.homeView.init(document.body);
        this.loadHomeData();
    }

    // Carregar dados para a página inicial
    loadHomeData() {
        const user = this.userModel.getUser();
        const progress = this.progressModel.getProgress();

        // Atualizar streak ao carregar a página
        this.userModel.updateStreak();

        // Renderizar a página inicial
        this.homeView.renderHome(user, progress);
    }

    // Navegar para o teste Ishihara
    goToIshiharaTest() {
        window.location.href = 'html/info_daltonismo.html';
    }

    // Navegar para um mundo específico
    goToWorld(worldId) {
        window.location.href = `html/quiz-${worldId}.html`;
    }

    // Obter sugestões de treino
    getTrainingSuggestions() {
       const incompleteLevels = typeof progressData.getIncompleteLevels === "function"
    ? progressData.getIncompleteLevels()
    : [];
     const weakWorlds = typeof progressData.getWeakWorlds === "function"
    ? progressData.getWeakWorlds()
    : [];
        const belowMaxStars = typeof progressData.getLevelsBelowMaxStars === "function"
    ? progressData.getLevelsBelowMaxStars()
    : [];

        return {
            incompleteLevels,
            weakWorlds,
            belowMaxStars
        };
    }
}

export default HomeController;
