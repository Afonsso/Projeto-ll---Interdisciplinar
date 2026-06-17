class TrainingController {
    constructor(progressModel, trainingView) {
        this.progressModel = progressModel;
        this.trainingView = trainingView;
    }

    init() {
        this.trainingView.init(document.body);
        this.trainingView.renderWorlds(this.progressModel);
    }
}

// Funções globais para navegação
window.goToRandomMode = function() {
    alert('Modo Aleatório em desenvolvimento');
};

window.goToWorld = function(worldId) {
    window.location.href = `../mundos/${worldId}.html`;
};

export default TrainingController;
