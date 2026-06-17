/**
 * World Logic - Gerencia a lógica relacionada a mundos
 */
class WorldLogic {
    constructor(quizModel, progressModel) {
        this.quizModel = quizModel;
        this.progressModel = progressModel;
    }

    // Obter dados de um mundo específico
    getWorldData(worldId) {
        return this.quizModel.getWorldData(worldId);
    }

    // Obter todos os mundos
    getAllWorlds() {
        return this.quizModel.getAllWorlds();
    }

    // Obter progresso de um mundo
    getWorldProgress(worldId) {
        return this.progressModel.getWorldProgress(worldId);
    }

    // Verificar se um mundo está desbloqueado
    isWorldUnlocked(worldId) {
        const progress = this.getWorldProgress(worldId);
        return progress?.unlocked || false;
    }

    // Verificar se um mundo está completo
    isWorldCompleted(worldId) {
        const progress = this.getWorldProgress(worldId);
        return progress?.completed || false;
    }

    // Calcular estrelas de um mundo
    calculateWorldStars(worldId) {
        const progress = this.getWorldProgress(worldId);
        if (!progress || !progress.levels) return 0;
        
        return Object.values(progress.levels).reduce((total, level) => total + (level.stars || 0), 0);
    }

    // Calcular progresso percentual de um mundo
    calculateWorldProgress(worldId) {
        const progress = this.getWorldProgress(worldId);
        if (!progress || !progress.levels) return 0;
        
        const totalLevels = Object.keys(progress.levels).length;
        const completedLevels = Object.values(progress.levels).filter(level => level.completed).length;
        
        return Math.round((completedLevels / totalLevels) * 100);
    }

    // Desbloquear próximo mundo
    unlockNextWorld(currentWorldId) {
        const worldOrder = ['transito', 'roupas', 'cozinha', 'desporto'];
        const currentIndex = worldOrder.indexOf(currentWorldId);
        
        if (currentIndex !== -1 && currentIndex < worldOrder.length - 1) {
            const nextWorldId = worldOrder[currentIndex + 1];
            const progress = this.progressModel.getProgress();
            
            if (progress.worlds[nextWorldId]) {
                progress.worlds[nextWorldId].unlocked = true;
                this.progressModel.saveProgress();
            }
        }
    }

    // Marcar mundo como completo
    markWorldCompleted(worldId) {
        const progress = this.progressModel.getProgress();
        
        if (progress.worlds[worldId]) {
            progress.worlds[worldId].completed = true;
            this.progressModel.saveProgress();
            
            // Desbloquear próximo mundo
            this.unlockNextWorld(worldId);
        }
    }

    // Obter boss de um mundo
    getBoss(worldId) {
        return this.quizModel.getBoss(worldId);
    }

    // Gerar perguntas do boss
    generateBossQuestions(worldId, difficulties) {
        return this.quizModel.generateBossQuestions(worldId, difficulties);
    }
}

export default WorldLogic;
