import { setupWorldLevelModal } from '../logic/level.js';
import QuizLevelLogic from '../logic/quizLevel.js';
import GameLevelLogic from '../logic/gameLevel.js';
import {
    createWorldLevelDataAdapter,
    getWorldConfig,
    hasWorldConfig
} from '../logic/world.js';

let worldPageInitialized = false;

async function waitForProgressModel(timeoutMs = 5000) {
    const startTime = Date.now();

    return new Promise((resolve) => {
        const check = () => {
            const model = window.CromaApp?.getModel?.('progress');
            if (model) {
                resolve(model);
                return;
            }

            if (Date.now() - startTime >= timeoutMs) {
                resolve(null);
                return;
            }

            requestAnimationFrame(check);
        };

        check();
    });
}

function detectWorldId() {
    const worldId = document.body.dataset.world;
    if (worldId) {
        return worldId;
    }

    const path = window.location.pathname.toLowerCase();
    if (path.includes('comida.html')) return 'comida';
    if (path.includes('transito.html')) return 'transito';
    if (path.includes('roupa.html')) return 'roupa';
    if (path.includes('desporto.html')) return 'desporto';
    return null;
}

function setupResetButton() {
    const resetButton = document.querySelector('.btn-reset');
    if (!resetButton) {
        return;
    }

    resetButton.addEventListener('click', () => {
        window.location.reload();
    });
}

function isLevelUnlocked(worldProgress, levelId) {
    if (!worldProgress?.unlocked) {
        return false;
    }

    if (levelId === 1) {
        return true;
    }

    const previousLevel = worldProgress.levels?.[levelId - 1];
    return Boolean((previousLevel?.stars || 0) >= 1);
}

function syncWorldButtons(worldSlug, progressModel) {
    const worldConfig = getWorldConfig(worldSlug);
    if (!worldConfig) {
        return;
    }

    const worldProgress = progressModel.getWorldProgress(worldConfig.progressWorldId);
    if (!worldProgress) {
        return;
    }

    document.querySelectorAll('[data-level]').forEach((button) => {
        const levelId = Number(button.dataset.level);
        const levelProgress = worldProgress.levels?.[levelId];
        const unlocked = isLevelUnlocked(worldProgress, levelId);
        const image = button.querySelector('img');

        button.classList.toggle('bloqueado', !unlocked);
        button.disabled = false;

        if (image) {
            if (!unlocked) {
                image.src = '../../imagens/pordesbloquear.png';
            } else if (levelProgress?.completed) {
                image.src = '../../imagens/start.png';
            } else {
                image.src = '../../imagens/start.png';
            }
        }
    });
}

function getLevelFromHash() {
    const hash = window.location.hash || '';
    const match = hash.match(/^#nivel-(\d+)$/i);
    if (!match) {
        return null;
    }

    const levelId = Number(match[1]);
    return Number.isNaN(levelId) ? null : levelId;
}

function openLevelFromHash() {
    const levelId = getLevelFromHash();
    if (!levelId) {
        return;
    }

    const levelButton = document.querySelector(`[data-level="${levelId}"]`);
    if (levelButton) {
        levelButton.click();
    }
}

async function initWorldPage() {
    if (worldPageInitialized) {
        return;
    }

    const worldId = detectWorldId();
    if (!worldId || !hasWorldConfig(worldId)) {
        return;
    }

    const progressModel = await waitForProgressModel();
    if (!progressModel) {
        return;
    }

    worldPageInitialized = true;

    const dataAdapter = createWorldLevelDataAdapter(worldId);
    const quizLogic = new QuizLevelLogic(dataAdapter);
    const gameLogic = new GameLevelLogic(dataAdapter);
    const worldConfig = getWorldConfig(worldId);
    const worldProgress = progressModel.getWorldProgress(worldConfig.progressWorldId);

    const modalLevels = Object.fromEntries(
        Object.entries(worldConfig.levels).map(([levelId, level]) => {
            const numericLevelId = Number(levelId);
            const levelProgress = worldProgress?.levels?.[numericLevelId];

            return [numericLevelId, {
                titulo: level.titulo,
                descricao: !isLevelUnlocked(worldProgress, numericLevelId)
                    ? 'Este nivel esta bloqueado. Conquista pelo menos 1 estrela no nivel anterior.'
                    : level.descricao,
                bloqueado: !isLevelUnlocked(worldProgress, numericLevelId),
                estrelas: '⭐'.repeat(levelProgress?.stars || 0) + '☆'.repeat(3 - (levelProgress?.stars || 0))
            }];
        })
    );

    setupResetButton();
    syncWorldButtons(worldId, progressModel);
    setupWorldLevelModal(modalLevels, {
        onPlay: async (levelId) => {
            const level = worldConfig.levels[levelId];
            if (!level) {
                return;
            }

            const onComplete = async ({ correctAnswers, totalQuestions }) => {
                await progressModel.completeLevel(
                    worldConfig.progressWorldId,
                    levelId,
                    correctAnswers,
                    totalQuestions
                );

                syncWorldButtons(worldId, progressModel);
            };

            if (level.tipo === 'quiz') {
                quizLogic.renderQuizModal(worldConfig.progressWorldId, levelId, { onComplete });
                return;
            }

            gameLogic.renderGameModal(worldConfig.progressWorldId, levelId, { onComplete });
        }
    });

    // Permite abrir diretamente um nível via hash (#nivel-x), usado pelo modo aleatório.
    openLevelFromHash();
}

document.addEventListener('DOMContentLoaded', initWorldPage);
