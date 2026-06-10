class ProgressModel {
    constructor(authService = null) {
        this.authService = authService;
        this.progressData = this.loadProgress();
    }

    // Definir o serviço de autenticação
    setAuthService(authService) {
        this.authService = authService;
    }

    // Carregar progresso do utilizador autenticado
    loadProgress() {
        // Se tiver authService e utilizador autenticado, carregar do utilizador
        if (this.authService && this.authService.isAuthenticated()) {
            const user = this.authService.getCurrentUser();
            if (user && user.progress) {
                return user.progress;
            }
        }

        // Estrutura padrão para novo progresso
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
                },
                reflexo: {
                    name: 'Reflexo',
                    emoji: '🏁',
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

    // Criar estrutura padrão para níveis
    createDefaultLevels() {
        return {
            1: { type: 'quiz', stars: 0, completed: false, attempts: 0 },
            2: { type: 'quiz', stars: 0, completed: false, attempts: 0 },
            3: { type: 'quiz', stars: 0, completed: false, attempts: 0 },
            4: { type: 'game', stars: 0, completed: false, attempts: 0 },
            5: { type: 'game', stars: 0, completed: false, attempts: 0 }
        };
    }

    // Guardar progresso via authService
    async saveProgress() {
        if (this.authService && this.authService.isAuthenticated()) {
            try {
                const user = this.authService.getCurrentUser();
                if (user && user.id) {
                    await this.authService.updateCurrentUser({ progress: this.progressData });
                    // Atualizar o currentUser com os dados atualizados
                    this.progressData = this.authService.getCurrentUser().progress;
                }
            } catch (error) {
                console.error('Error saving progress:', error);
            }
        }
    }

    // Obter progresso completo
    getProgress() {
        return this.progressData;
    }

    // Obter progresso de um mundo específico
    getWorldProgress(worldId) {
        return this.progressData.worlds[worldId];
    }

    // Obter progresso de um nível específico
    getLevelProgress(worldId, levelId) {
        return this.progressData.worlds[worldId]?.levels[levelId];
    }

    // Completar um nível
    async completeLevel(worldId, levelId, stars, score) {
        const world = this.progressData.worlds[worldId];
        if (!world) return null;

        const level = world.levels[levelId];
        if (!level) return null;

        // Atualizar nível
        level.stars = Math.max(level.stars, stars);
        level.completed = true;
        level.attempts += 1;

        // Adicionar à atividade recente
        this.progressData.recentActivity.unshift({
            worldId,
            levelId,
            stars,
            score,
            date: new Date().toISOString()
        });

        // Manter apenas as 10 atividades mais recentes
        if (this.progressData.recentActivity.length > 10) {
            this.progressData.recentActivity = this.progressData.recentActivity.slice(0, 10);
        }

        // Adicionar aos níveis completados se não existir
        const levelKey = `${worldId}-${levelId}`;
        if (!this.progressData.completedLevels.includes(levelKey)) {
            this.progressData.completedLevels.push(levelKey);
        }

        // Verificar se todos os níveis do mundo estão completos
        const allLevelsCompleted = Object.values(world.levels).every(l => l.completed);
        if (allLevelsCompleted) {
            world.completed = true;
        }

        // Calcular total de estrelas
        this.calculateTotalStars();

        // Desbloquear próximo mundo se aplicável
        this.checkWorldUnlock(worldId);

        await this.saveProgress();
        return level;
    }

    // Derrotar boss de mundo
    async defeatBoss(worldId) {
        const world = this.progressData.worlds[worldId];
        if (!world) return null;

        world.bossDefeated = true;
        await this.saveProgress();
        return world;
    }

    // Desbloquear mundo
    async unlockWorld(worldId) {
        const world = this.progressData.worlds[worldId];
        if (world) {
            world.unlocked = true;
            await this.saveProgress();
        }
    }

    // Verificar se deve desbloquear próximo mundo
    checkWorldUnlock(completedWorldId) {
        const worldOrder = ['transito', 'roupas', 'cozinha', 'desporto', 'reflexo'];
        const currentIndex = worldOrder.indexOf(completedWorldId);

        if (currentIndex >= 0 && currentIndex < worldOrder.length - 1) {
            const nextWorldId = worldOrder[currentIndex + 1];
            const currentWorld = this.progressData.worlds[completedWorldId];

            // Desbloquear próximo mundo se o atual estiver completo
            if (currentWorld.completed && currentWorld.bossDefeated) {
                this.unlockWorld(nextWorldId);
            }
        }
    }

    // Calcular total de estrelas
    calculateTotalStars() {
        let total = 0;
        for (const worldId in this.progressData.worlds) {
            const world = this.progressData.worlds[worldId];
            for (const levelId in world.levels) {
                total += world.levels[levelId].stars;
            }
        }
        this.progressData.totalStars = total;
    }

    // Obter mundos com menor pontuação (para sugestões)
    getWeakWorlds() {
        const worldScores = [];
        for (const worldId in this.progressData.worlds) {
            const world = this.progressData.worlds[worldId];
            if (world.unlocked && !world.completed) {
                const worldStars = Object.values(world.levels).reduce((sum, level) => sum + level.stars, 0);
                const maxStars = Object.keys(world.levels).length * 3;
                const percentage = (worldStars / maxStars) * 100;
                worldScores.push({ worldId, percentage, world });
            }
        }
        return worldScores.sort((a, b) => a.percentage - b.percentage);
    }

    // Obter níveis não completos
    getIncompleteLevels() {
        const incomplete = [];
        for (const worldId in this.progressData.worlds) {
            const world = this.progressData.worlds[worldId];
            if (world.unlocked) {
                for (const levelId in world.levels) {
                    const level = world.levels[levelId];
                    if (!level.completed) {
                        incomplete.push({ worldId, levelId, level, world });
                    }
                }
            }
        }
        return incomplete;
    }

    // Obter níveis com menos de 3 estrelas
    getLevelsBelowMaxStars() {
        const belowMax = [];
        for (const worldId in this.progressData.worlds) {
            const world = this.progressData.worlds[worldId];
            if (world.unlocked) {
                for (const levelId in world.levels) {
                    const level = world.levels[levelId];
                    if (level.stars < 3) {
                        belowMax.push({ worldId, levelId, level, world });
                    }
                }
            }
        }
        return belowMax;
    }

    // Resetar progresso
    async resetProgress() {
        this.progressData = this.loadProgress();
        await this.saveProgress();
    }
}

export default ProgressModel;
