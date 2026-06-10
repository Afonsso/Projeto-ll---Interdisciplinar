class World {
    constructor(id, nome, icone, ordem = 1) {
        this.id = id;
        this.nome = nome;           // Trânsito, Roupa & Estilo, etc.
        this.icone = icone;
        this.ordem = ordem;
        this.levels = [];
        this.bossLevel = null;
        this.unlocked = false;
    }

    addLevel(level) {
        this.levels.push(level);
    }

    isCompleted(progress) {
        return this.levels.every(level => 
            progress.worldProgress.get(this.id)?.completedLevels?.includes(level.id)
        );
    }
}

export default World;