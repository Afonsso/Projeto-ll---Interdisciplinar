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
    renderWorlds(worldsData, progressData) {
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
            const world = worldsData[worldId];
            const progress = progressData.getWorldProgress(worldId);
            
            if (!world) return;

            const isUnlocked = progress?.unlocked || false;
            const isCompleted = progress?.completed || false;

            worldsHTML += `
                <div class="categoria-item ${isUnlocked ? '' : 'locked'} ${isCompleted ? 'completed' : ''}" onclick="goToWorld('${worldId}')">
                    <span class="categoria-emoji">${world.emoji}</span>
                    <span class="categoria-name">${world.name}</span>
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
