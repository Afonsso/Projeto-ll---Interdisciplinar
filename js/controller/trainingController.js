class TrainingController {
    constructor(progressModel, trainingView) {
        this.progressModel = progressModel;
        this.trainingView = trainingView;
    }

    init() {
        this.trainingView.init(document.body);
        this.trainingView.renderWorlds(this.progressModel);

        window.goToRandomMode = () => {
            const target = this.getRandomPlayableLevel();
            if (!target) {
                alert('Ainda nao tens niveis desbloqueados para o modo aleatorio.');
                return;
            }

            window.location.href = `./mundos/${target.slug}.html#nivel-${target.levelId}`;
        };
    }

    isLevelUnlocked(worldProgress, levelId) {
        if (!worldProgress?.unlocked) {
            return false;
        }

        if (levelId === 1) {
            return true;
        }

        const previousLevel = worldProgress.levels?.[levelId - 1];
        return Boolean((previousLevel?.stars || 0) >= 1);
    }

    getWorldSlug(worldId) {
        const worldSlugMap = {
            cozinha: 'comida',
            roupas: 'roupa',
            transito: 'transito',
            desporto: 'desporto'
        };

        return worldSlugMap[worldId] || worldId;
    }

    getRandomPlayableLevel() {
        const progress = this.progressModel.getProgress();
        const worlds = progress?.worlds || {};
        const candidates = [];

        Object.entries(worlds).forEach(([worldId, worldProgress]) => {
            if (!worldProgress?.unlocked || !worldProgress?.levels) {
                return;
            }

            Object.keys(worldProgress.levels).forEach((levelKey) => {
                const levelId = Number(levelKey);
                if (Number.isNaN(levelId)) {
                    return;
                }

                if (this.isLevelUnlocked(worldProgress, levelId)) {
                    candidates.push({
                        worldId,
                        slug: this.getWorldSlug(worldId),
                        levelId
                    });
                }
            });
        });

        if (candidates.length === 0) {
            return null;
        }

        const randomIndex = Math.floor(Math.random() * candidates.length);
        return candidates[randomIndex];
    }
}

window.goToWorld = function(worldId) {
    const worldSlugMap = {
        cozinha: 'comida',
        roupas: 'roupa',
        transito: 'transito',
        desporto: 'desporto'
    };

    const slug = worldSlugMap[worldId] || worldId;
    window.location.href = `./mundos/${slug}.html`;
};

export default TrainingController;
