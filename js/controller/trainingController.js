import WorldLogic from '../logic/world.js';

class TrainingController {
    constructor(quizModel, progressModel, userModel, trainingView) {
        this.quizModel = quizModel;
        this.progressModel = progressModel;
        this.userModel = userModel;
        this.trainingView = trainingView;
        this.worldLogic = new WorldLogic(quizModel, progressModel);
    }

    init() {
        this.trainingView.init(document.body);
        this.loadTrainingData();
    }

    loadTrainingData() {
        const worldsData = this.worldLogic.getAllWorlds();
        this.trainingView.renderWorlds(worldsData, this.progressModel);
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
