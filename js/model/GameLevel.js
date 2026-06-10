import Level from './Level.js';

class GameLevel extends Level {
    constructor(id, numero, worldId, dificuldade, xpReward, gameConfig = {}) {
        super(id, numero, worldId, dificuldade, "game", xpReward);
        this.gameConfig = gameConfig; // tipo de jogo, tempo limite, etc.
    }
}

export default GameLevel;