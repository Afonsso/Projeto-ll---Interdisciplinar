class ProgressModel {
    constructor(authService = null) {
        this.authService = authService;
        this.progressData = this.loadProgress();
    }

    setAuthService(authService) {
        this.authService = authService;
    }

    loadProgress() {
        if (this.authService && this.authService.isAuthenticated()) {
            const user = this.authService.getCurrentUser();
            if (user && user.progress) {
                return this.normalizeProgress(user.progress);
            }
        }

        return this.createDefaultProgress();
    }

    createDefaultProgress() {
        return {
            worlds: {
                transito: {
                    name: 'Trânsito',
                    emoji: '🚦',
                    unlocked: true,
                    completed: false,
                    bossDefeated: false,
                    levels: this.createDefaultLevels()
                },
                roupas: {
                    name: 'Roupas & Estilo',
                    emoji: '👚',
                    unlocked: false,
                    completed: false,
                    bossDefeated: false,
                    levels: this.createDefaultLevels()
                },
                cozinha: {
                    name: 'Cozinha & Alimentação',
                    emoji: '🏡',
                    unlocked: false,
                    completed: false,
                    bossDefeated: false,
                    levels: this.createDefaultLevels()
                },
                desporto: {
                    name: 'Desporto',
                    emoji: '⚽',
                    unlocked: false,
                    completed: false,
                    bossDefeated: false,
                    levels: this.createDefaultLevels()

                }
            },
            totalStars: 0,
            completedLevels: [],
            recentActivity: []
        };
    }

    normalizeProgress(progress) {
        const defaultProgress = this.createDefaultProgress();

        progress.worlds = progress.worlds || defaultProgress.worlds;
        progress.totalStars = progress.totalStars || 0;
        progress.completedLevels = progress.completedLevels || [];
        progress.recentActivity = progress.recentActivity || [];

        for (const worldId in defaultProgress.worlds) {
            if (!progress.worlds[worldId]) {
                progress.worlds[worldId] = defaultProgress.worlds[worldId];
            }

            const world = progress.worlds[worldId];
            const defaultWorld = defaultProgress.worlds[worldId];

            world.name = world.name || defaultWorld.name;
            world.emoji = world.emoji || defaultWorld.emoji;
            world.unlocked = world.unlocked ?? defaultWorld.unlocked;
            world.completed = world.completed ?? false;
            world.bossDefeated = world.bossDefeated ?? false;
            world.levels = world.levels || this.createDefaultLevels();

            for (const levelId in defaultWorld.levels) {
                if (!world.levels[levelId]) {
                    world.levels[levelId] = defaultWorld.levels[levelId];
                }

                const level = world.levels[levelId];

                level.type = level.type || defaultWorld.levels[levelId].type;
                level.stars = level.stars || 0;
                level.completed = level.completed || false;
                level.attempts = level.attempts || 0;
                level.bestScore = level.bestScore || 0;
                level.totalQuestions = level.totalQuestions || 0;
                level.xpEarned = level.xpEarned || 0;
            }
        }

        this.syncWorldUnlocksByCompletion(progress);

        this.progressData = progress;
        this.calculateTotalStars();

        return progress;
    }

    syncWorldUnlocksByCompletion(progress) {
        const worldOrder = ['transito', 'roupas', 'cozinha', 'desporto'];

        for (let index = 0; index < worldOrder.length - 1; index += 1) {
            const currentWorldId = worldOrder[index];
            const nextWorldId = worldOrder[index + 1];
            const currentWorld = progress.worlds[currentWorldId];
            const nextWorld = progress.worlds[nextWorldId];

            if (currentWorld?.completed && nextWorld) {
                nextWorld.unlocked = true;
            }
        }
    }

    createDefaultLevels() {
        return {
            1: {
                type: 'quiz',
                stars: 0,
                completed: false,
                attempts: 0,
                bestScore: 0,
                totalQuestions: 0,
                xpEarned: 0
            },
            2: {
                type: 'quiz',
                stars: 0,
                completed: false,
                attempts: 0,
                bestScore: 0,
                totalQuestions: 0,
                xpEarned: 0
            },
            3: {
                type: 'quiz',
                stars: 0,
                completed: false,
                attempts: 0,
                bestScore: 0,
                totalQuestions: 0,
                xpEarned: 0
            },
            4: {
                type: 'game',
                stars: 0,
                completed: false,
                attempts: 0,
                bestScore: 0,
                totalQuestions: 0,
                xpEarned: 0
            },
            5: {
                type: 'game',
                stars: 0,
                completed: false,
                attempts: 0,
                bestScore: 0,
                totalQuestions: 0,
                xpEarned: 0
            }
        };
    }

    async saveProgress() {
        if (this.authService && this.authService.isAuthenticated()) {
            try {
                const user = this.authService.getCurrentUser();

                if (user && user.id) {
                    await this.authService.updateCurrentUser({
                        progress: this.progressData
                    });

                    const updatedUser = this.authService.getCurrentUser();

                    if (updatedUser && updatedUser.progress) {
                        this.progressData = updatedUser.progress;
                    }
                }
            } catch (error) {
                console.error('Error saving progress:', error);
            }
        }
    }

    getProgress() {
        return this.progressData;
    }

    getWorldProgress(worldId) {
        return this.progressData.worlds[worldId];
    }

    getLevelProgress(worldId, levelId) {
        return this.progressData.worlds[worldId]?.levels[levelId];
    }

    calculateStars(correctAnswers, totalQuestions) {
        const percentage = totalQuestions > 0
            ? (correctAnswers / totalQuestions) * 100
            : 0;

        if (percentage >= 90) return 3;
        if (percentage >= 40) return 2;
        if (percentage > 0) return 1;
        return 0;
    }

    calculateXp(levelId, totalQuestions, correctAnswers) {
        const levelMultiplier = Number(levelId) || 1;
        const baseXp = totalQuestions * 10;
        const performanceBonus = correctAnswers * 5;
        const levelBonus = levelMultiplier * 20;

        return baseXp + performanceBonus + levelBonus;
    }

    async completeLevel(worldId, levelId, correctAnswers, totalQuestions) {
        const world = this.progressData.worlds[worldId];
        if (!world) return null;

        const level = world.levels[levelId];
        if (!level) return null;

        const stars = this.calculateStars(correctAnswers, totalQuestions);
        const calculatedXp = this.calculateXp(levelId, totalQuestions, correctAnswers);

        const previousXp = level.xpEarned || 0;
        const gainedXp = Math.max(0, calculatedXp - previousXp);

        level.stars = Math.max(level.stars, stars);
        level.completed = true;
        level.attempts += 1;
        level.bestScore = Math.max(level.bestScore || 0, correctAnswers);
        level.totalQuestions = Math.max(level.totalQuestions || 0, totalQuestions);
        level.xpEarned = Math.max(previousXp, calculatedXp);

        const levelKey = `${worldId}-${levelId}`;

        if (!this.progressData.completedLevels.includes(levelKey)) {
            this.progressData.completedLevels.push(levelKey);
        }

        this.progressData.recentActivity.unshift({
            worldId,
            levelId,
            stars,
            score: correctAnswers,
            totalQuestions,
            xp: gainedXp,
            date: new Date().toISOString()
        });

        if (this.progressData.recentActivity.length > 10) {
            this.progressData.recentActivity =
                this.progressData.recentActivity.slice(0, 10);
        }

        const allLevelsCompleted = Object.values(world.levels)
            .every(level => level.completed);

        if (allLevelsCompleted) {
            world.completed = true;
        }

        this.calculateTotalStars();
        this.checkWorldUnlock(worldId);

        await this.addXpToUser(gainedXp);
        await this.saveProgress();

        return {
            level,
            stars,
            gainedXp,
            totalXpForLevel: level.xpEarned
        };
    }

    async addXpToUser(xp) {
        if (!xp || xp <= 0) return;

        if (this.authService && this.authService.isAuthenticated()) {
            const user = this.authService.getCurrentUser();

            if (user) {
                const currentXp = user.xp || 0;

                await this.authService.updateCurrentUser({
                    xp: currentXp + xp
                });
            }
        }
    }

    async defeatBoss(worldId) {
        const world = this.progressData.worlds[worldId];
        if (!world) return null;

        world.bossDefeated = true;

        this.checkWorldUnlock(worldId);

        await this.saveProgress();
        return world;
    }

    async unlockWorld(worldId) {
        const world = this.progressData.worlds[worldId];

        if (world) {
            world.unlocked = true;
            await this.saveProgress();
        }
    }

    checkWorldUnlock(completedWorldId) {
        const worldOrder = ['transito', 'roupas', 'cozinha', 'desporto'];
        const currentIndex = worldOrder.indexOf(completedWorldId);

        if (currentIndex >= 0 && currentIndex < worldOrder.length - 1) {
            const nextWorldId = worldOrder[currentIndex + 1];
            const currentWorld = this.progressData.worlds[completedWorldId];

            if (currentWorld.completed) {
                const nextWorld = this.progressData.worlds[nextWorldId];

                if (nextWorld) {
                    nextWorld.unlocked = true;
                }
            }
        }
    }

    calculateTotalStars() {
        let total = 0;

        for (const worldId in this.progressData.worlds) {
            const world = this.progressData.worlds[worldId];

            for (const levelId in world.levels) {
                total += world.levels[levelId].stars || 0;
            }
        }

        this.progressData.totalStars = total;
    }

    getTotalPossibleStars() {
        let total = 0;

        for (const worldId in this.progressData.worlds) {
            const world = this.progressData.worlds[worldId];
            total += Object.keys(world.levels).length * 3;
        }

        return total;
    }

    getTotalLevels() {
        let total = 0;

        for (const worldId in this.progressData.worlds) {
            total += Object.keys(this.progressData.worlds[worldId].levels).length;
        }

        return total;
    }

    getProgressPercentage() {
        const totalLevels = this.getTotalLevels();
        const completed = this.progressData.completedLevels.length;

        return totalLevels > 0
            ? Math.round((completed / totalLevels) * 100)
            : 0;
    }

    getWeakWorlds() {
        const worldScores = [];

        for (const worldId in this.progressData.worlds) {
            const world = this.progressData.worlds[worldId];

            if (world.unlocked) {
                const worldStars = Object.values(world.levels)
                    .reduce((sum, level) => sum + (level.stars || 0), 0);

                const maxStars = Object.keys(world.levels).length * 3;
                const percentage = maxStars > 0
                    ? (worldStars / maxStars) * 100
                    : 0;

                worldScores.push({
                    worldId,
                    percentage,
                    stars: worldStars,
                    maxStars,
                    world
                });
            }
        }

        return worldScores.sort((a, b) => a.percentage - b.percentage);
    }

    getIncompleteLevels() {
        const incomplete = [];

        for (const worldId in this.progressData.worlds) {
            const world = this.progressData.worlds[worldId];

            if (world.unlocked) {
                for (const levelId in world.levels) {
                    const level = world.levels[levelId];

                    if (!level.completed) {
                        incomplete.push({
                            worldId,
                            levelId,
                            level,
                            world
                        });
                    }
                }
            }
        }

        return incomplete;
    }

    getLevelsBelowMaxStars() {
        const belowMax = [];

        for (const worldId in this.progressData.worlds) {
            const world = this.progressData.worlds[worldId];

            if (world.unlocked) {
                for (const levelId in world.levels) {
                    const level = world.levels[levelId];

                    if (level.completed && level.stars < 3) {
                        belowMax.push({
                            worldId,
                            levelId,
                            level,
                            world
                        });
                    }
                }
            }
        }

        return belowMax.sort((a, b) => a.level.stars - b.level.stars);
    }

    getSmartTrainingSuggestions() {
        const incompleteLevels = this.getIncompleteLevels();
        const weakWorlds = this.getWeakWorlds();
        const belowMaxStars = this.getLevelsBelowMaxStars();

        const suggestions = [];

        if (incompleteLevels.length > 0) {
            suggestions.push({
                type: 'continue',
                priority: 'high',
                title: 'Continuar progresso',
                description: 'Completa níveis que ainda estão por terminar.',
                items: incompleteLevels.slice(0, 3)
            });
        }

        if (weakWorlds.length > 0) {
            suggestions.push({
                type: 'weak-world',
                priority: 'medium',
                title: 'Reforçar mundo mais fraco',
                description: 'Treina os mundos onde tens menor pontuação.',
                items: weakWorlds.slice(0, 2)
            });
        }

        if (incompleteLevels.length === 0 && belowMaxStars.length > 0) {
            suggestions.push({
                type: 'improve-stars',
                priority: 'low',
                title: 'Melhorar estrelas',
                description: 'Repete níveis completos com menos de 3 estrelas.',
                items: belowMaxStars.slice(0, 3)
            });
        }

        return suggestions;
    }

    async resetProgress() {
        this.progressData = this.createDefaultProgress();
        await this.saveProgress();
    }
}

export default ProgressModel;