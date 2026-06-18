/**
 * TrainingView - Gerencia a renderização da página de Treino/Quizzes
 */
class TrainingView {
    constructor() {
        this.container = null;
    }

    init(container) {
        this.container = container;
    }

    // Renderizar a lista de mundos com categorias
    renderWorlds(progressModel) {
        const worldsContainer = document.getElementById('worlds-container');
        if (!worldsContainer) return;

        const worldsOrder = ['transito', 'roupas', 'cozinha', 'desporto'];
        
        let worldsHTML = `
            <h1 class="quizzes-title">Quizzes</h1>
            <div class="quizzes-modes">
                <button class="mode-button modo-aleatorio" onclick="goToRandomMode()">
                    Modo Aleatório
                </button>
                
                <div class="desafios-categoria">
                    <h2 class="categoria-title">Desafios por Categoria</h2>
                    <div class="categoria-list">
        `;

        worldsOrder.forEach(worldId => {
            const progress = progressModel.getWorldProgress(worldId);
            if (!progress) return;

            const isUnlocked = progress.unlocked || false;
            const isCompleted = progress.completed || false;

            worldsHTML += `
                <div class="categoria-item ${isUnlocked ? '' : 'locked'} ${isCompleted ? 'completed' : ''}" onclick="goToWorld('${worldId}')">
                    <span class="categoria-emoji">${progress.emoji}</span>
                    <span class="categoria-name">${progress.name}</span>
                </div>
            `;
        });

        worldsHTML += `
                    </div>
                </div>
            </div>
        `;
        
        worldsContainer.innerHTML = worldsHTML;
    }
}

export default TrainingView;
