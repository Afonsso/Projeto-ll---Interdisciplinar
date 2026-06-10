class Level {
    constructor(id, numero, worldId, dificuldade, tipo, xpReward) {
        this.id = id;
        this.numero = numero;
        this.worldId = worldId;
        this.dificuldade = dificuldade; // "facil", "medio", "dificil"
        this.tipo = tipo;               // "quiz" | "game"
        this.xpReward = xpReward;
        this.stars = 0;                 // 0 a 3
        this.completed = false;
    }
}

export default Level;