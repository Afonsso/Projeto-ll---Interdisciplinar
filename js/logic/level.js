/**
 * Level Logic - Gerencia a lógica relacionada a níveis
 */
class LevelLogic {
    constructor(progressModel, userModel) {
        this.progressModel = progressModel;
        this.userModel = userModel;
    }

    // Obter progresso de um nível específico
    getLevelProgress(worldId, levelId) {
        return this.progressModel.getLevelProgress(worldId, levelId);
    }

    // Completar um nível
    async completeLevel(worldId, levelId, stars, score) {
        const progress = this.progressModel.getProgress();
        const world = progress.worlds[worldId];
        
        if (!world || !world.levels[levelId]) {
            console.error('Level not found:', worldId, levelId);
            return null;
        }

        const level = world.levels[levelId];

        // Atualizar nível
        level.stars = Math.max(level.stars, stars);
        level.completed = true;
        level.attempts += 1;

        // Adicionar à atividade recente
        progress.recentActivity.unshift({
            worldId,
            levelId,
            stars,
            score,
            date: new Date().toISOString()
        });

        // Manter apenas as 10 atividades mais recentes
        if (progress.recentActivity.length > 10) {
            progress.recentActivity = progress.recentActivity.slice(0, 10);
        }

        // Adicionar aos níveis completados se não existir
        const levelKey = `${worldId}-${levelId}`;
        if (!progress.completedLevels.includes(levelKey)) {
            progress.completedLevels.push(levelKey);
        }

        // Calcular total de estrelas
        progress.totalStars = Object.values(world.levels).reduce((total, l) => total + l.stars, 0);

        // Adicionar XP ao utilizador
        await this.userModel.addXP(score);

        // Guardar progresso
        await this.progressModel.saveProgress();

        return { stars, score, levelKey };
    }

    // Verificar se um nível está completo
    isLevelCompleted(worldId, levelId) {
        const level = this.getLevelProgress(worldId, levelId);
        return level?.completed || false;
    }

    // Obter estrelas de um nível
    getLevelStars(worldId, levelId) {
        const level = this.getLevelProgress(worldId, levelId);
        return level?.stars || 0;
    }

    // Obter tentativas de um nível
    getLevelAttempts(worldId, levelId) {
        const level = this.getLevelProgress(worldId, levelId);
        return level?.attempts || 0;
    }

    // Obter tipo de um nível
    getLevelType(worldId, levelId) {
        const level = this.getLevelProgress(worldId, levelId);
        return level?.type || 'quiz';
    }

    // Obter todos os níveis de um mundo
    getWorldLevels(worldId) {
        const progress = this.progressModel.getProgress();
        const world = progress.worlds[worldId];
        
        if (!world || !world.levels) {
            return {};
        }

        return world.levels;
    }

    // Obter níveis incompletos
    getIncompleteLevels() {
        const progress = this.progressModel.getProgress();
        const incompleteLevels = [];

        Object.keys(progress.worlds).forEach(worldId => {
            const world = progress.worlds[worldId];
            if (world.levels) {
                Object.keys(world.levels).forEach(levelId => {
                    if (!world.levels[levelId].completed) {
                        incompleteLevels.push(`${worldId}-${levelId}`);
                    }
                });
            }
        });

        return incompleteLevels;
    }

    // Obter níveis abaixo do máximo de estrelas
    getLevelsBelowMaxStars() {
        const progress = this.progressModel.getProgress();
        const belowMaxStars = [];

        Object.keys(progress.worlds).forEach(worldId => {
            const world = progress.worlds[worldId];
            if (world.levels) {
                Object.keys(world.levels).forEach(levelId => {
                    if (world.levels[levelId].stars < 3) {
                        belowMaxStars.push(`${worldId}-${levelId}`);
                    }
                });
            }
        });

        return belowMaxStars;
    }

    // Resetar nível
    async resetLevel(worldId, levelId) {
        const progress = this.progressModel.getProgress();
        const world = progress.worlds[worldId];
        
        if (!world || !world.levels[levelId]) {
            return false;
        }

        world.levels[levelId] = {
            type: world.levels[levelId].type,
            stars: 0,
            completed: false,
            attempts: 0
        };

        // Remover dos níveis completados
        const levelKey = `${worldId}-${levelId}`;
        const index = progress.completedLevels.indexOf(levelKey);
        if (index !== -1) {
            progress.completedLevels.splice(index, 1);
        }

        await this.progressModel.saveProgress();
        return true;
    }
}

export default LevelLogic;
