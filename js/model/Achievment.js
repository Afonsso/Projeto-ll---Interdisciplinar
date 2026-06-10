class Trophy {
    constructor(id, nome, descricao, icone, raridade, condition) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.icone = icone;
        this.raridade = raridade; // "comum", "raro", "lendario"
        this.condition = condition; // Função que recebe o progresso do utilizador e retorna true se o troféu deve ser desbloqueado
        this.unlocked = false;
        this.unlockedAt = null;
    }
}

export default Trophy;