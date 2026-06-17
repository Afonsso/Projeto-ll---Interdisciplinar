import {
    WORLD_LEVELS,
    WORLD_QUIZ_BANK,
    saveWorldContentOverrides,
    clearWorldContentOverrides
} from '../logic/world.js';

const API_URL = 'http://localhost:3000';
const QUIZ_LEVELS_PER_WORLD = 4;
const QUESTIONS_PER_LEVEL = 5;

const state = {
    worldLevels: cloneData(WORLD_LEVELS),
    quizBank: cloneData(WORLD_QUIZ_BANK),
    users: [],
    selectedQuizWorld: 'comida',
    selectedQuizLevel: 1,
    selectedGameWorld: 'comida',
    selectedGameLevel: 4
};

function cloneData(data) {
    return JSON.parse(JSON.stringify(data));
}

function showFeedback(message, type = 'success') {
    const feedbackEl = document.getElementById('admin-feedback');
    if (!feedbackEl) {
        return;
    }

    feedbackEl.textContent = message;
    feedbackEl.className = `admin-feedback ${type}`;
}

function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.admin-panel');

    tabButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const target = button.dataset.tab;

            tabButtons.forEach((btn) => btn.classList.toggle('active', btn === button));
            panels.forEach((panel) => {
                panel.classList.toggle('active', panel.dataset.panel === target);
            });
        });
    });
}

function loadContentOverrides() {
    try {
        const worldLevelsRaw = window.localStorage.getItem('croma_admin_world_levels');
        const quizBankRaw = window.localStorage.getItem('croma_admin_quiz_bank');

        if (worldLevelsRaw) {
            state.worldLevels = JSON.parse(worldLevelsRaw);
        }

        if (quizBankRaw) {
            state.quizBank = JSON.parse(quizBankRaw);
        }
    } catch (error) {
        console.error(error);
        showFeedback('Erro ao carregar conteudo do admin.', 'error');
    }
}

function saveContent() {
    saveWorldContentOverrides(state.worldLevels, state.quizBank);
    showFeedback('Conteudo guardado. Atualiza as paginas de jogo para veres as alteracoes.');
}

function resetContent() {
    state.worldLevels = cloneData(WORLD_LEVELS);
    state.quizBank = cloneData(WORLD_QUIZ_BANK);
    clearWorldContentOverrides();

    renderQuizSelectors();
    renderQuizEditor();
    renderGameSelectors();
    renderGameEditor();

    showFeedback('Conteudo reposto para o padrao.');
}

async function fetchUsers() {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) {
        throw new Error('Nao foi possivel obter utilizadores. Verifica se o json-server esta ativo.');
    }

    return response.json();
}

async function updateUser(userId, payload) {
    const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error('Falha ao atualizar utilizador.');
    }

    return response.json();
}

async function deleteUser(userId) {
    const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error('Falha ao remover utilizador.');
    }
}

async function createUser(payload) {
    const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error('Falha ao criar utilizador.');
    }

    return response.json();
}

async function loadUsers() {
    try {
        state.users = await fetchUsers();
        renderUsers();
        showFeedback('Utilizadores carregados.');
    } catch (error) {
        console.error(error);
        showFeedback(error.message, 'error');
    }
}

function renderUsers() {
    const usersList = document.getElementById('users-list');
    if (!usersList) {
        return;
    }

    usersList.innerHTML = '';

    state.users.forEach((user) => {
        const userCard = document.createElement('article');
        userCard.className = 'card user-card';
        userCard.innerHTML = `
            <label>
                Nome
                <input type="text" data-field="name" value="${user.name || ''}">
            </label>
            <label>
                Email
                <input type="email" data-field="email" value="${user.email || ''}">
            </label>
            <label>
                XP
                <input type="number" data-field="xp" value="${user.xp || 0}">
            </label>
            <label>
                Streak
                <input type="number" data-field="streak" value="${user.streak || 0}">
            </label>
            <button type="button" class="btn btn-primary" data-action="save">Guardar</button>
            <button type="button" class="btn danger" data-action="delete">Apagar</button>
        `;

        const saveBtn = userCard.querySelector('[data-action="save"]');
        const deleteBtn = userCard.querySelector('[data-action="delete"]');

        saveBtn.addEventListener('click', async () => {
            try {
                const payload = {
                    name: userCard.querySelector('[data-field="name"]').value.trim(),
                    email: userCard.querySelector('[data-field="email"]').value.trim().toLowerCase(),
                    xp: Number(userCard.querySelector('[data-field="xp"]').value) || 0,
                    streak: Number(userCard.querySelector('[data-field="streak"]').value) || 0
                };

                await updateUser(user.id, payload);
                showFeedback('Utilizador atualizado com sucesso.');
                await loadUsers();
            } catch (error) {
                console.error(error);
                showFeedback(error.message, 'error');
            }
        });

        deleteBtn.addEventListener('click', async () => {
            const confirmed = window.confirm(`Remover utilizador ${user.name || user.email}?`);
            if (!confirmed) {
                return;
            }

            try {
                await deleteUser(user.id);
                showFeedback('Utilizador removido.');
                await loadUsers();
            } catch (error) {
                console.error(error);
                showFeedback(error.message, 'error');
            }
        });

        usersList.appendChild(userCard);
    });
}

function setupNewUserForm() {
    const form = document.getElementById('new-user-form');
    if (!form) {
        return;
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const payload = {
            name: String(formData.get('name') || '').trim(),
            email: String(formData.get('email') || '').trim().toLowerCase(),
            password: String(formData.get('password') || '').trim(),
            avatar: 'doggie.png',
            birthDate: null,
            createdAt: new Date().toISOString(),
            colorBlindnessType: null,
            ishiharaCompleted: false,
            xp: 0,
            streak: 0,
            lastLoginDate: null,
            progress: null
        };

        try {
            await createUser(payload);
            form.reset();
            showFeedback('Utilizador criado com sucesso.');
            await loadUsers();
        } catch (error) {
            console.error(error);
            showFeedback(error.message, 'error');
        }
    });
}

function getQuizLevelIds(worldKey) {
    const world = state.worldLevels[worldKey];
    if (!world?.levels) {
        return [];
    }

    return Object.entries(world.levels)
        .filter(([, level]) => level.tipo === 'quiz')
        .map(([levelId]) => Number(levelId))
        .sort((a, b) => a - b)
        .slice(0, QUIZ_LEVELS_PER_WORLD);
}

function renderQuizSelectors() {
    const worldSelect = document.getElementById('quiz-world-select');
    const levelSelect = document.getElementById('quiz-level-select');

    if (!worldSelect || !levelSelect) {
        return;
    }

    worldSelect.innerHTML = Object.keys(state.worldLevels)
        .map((worldKey) => `<option value="${worldKey}">${worldKey}</option>`)
        .join('');

    if (!state.worldLevels[state.selectedQuizWorld]) {
        state.selectedQuizWorld = Object.keys(state.worldLevels)[0];
    }

    worldSelect.value = state.selectedQuizWorld;

    const levelIds = getQuizLevelIds(state.selectedQuizWorld);
    levelSelect.innerHTML = levelIds
        .map((levelId) => `<option value="${levelId}">${levelId}</option>`)
        .join('');

    if (!levelIds.includes(state.selectedQuizLevel)) {
        state.selectedQuizLevel = levelIds[0] || 1;
    }

    levelSelect.value = String(state.selectedQuizLevel);

    worldSelect.onchange = () => {
        state.selectedQuizWorld = worldSelect.value;
        renderQuizSelectors();
        renderQuizEditor();
    };

    levelSelect.onchange = () => {
        state.selectedQuizLevel = Number(levelSelect.value);
        renderQuizEditor();
    };
}

function renderQuizEditor() {
    const questionsContainer = document.getElementById('quiz-questions-editor');
    const titleInput = document.getElementById('quiz-level-title');
    const descriptionInput = document.getElementById('quiz-level-description');

    if (!questionsContainer || !titleInput || !descriptionInput) {
        return;
    }

    const world = state.worldLevels[state.selectedQuizWorld];
    const level = world?.levels?.[state.selectedQuizLevel];

    if (!world || !level) {
        questionsContainer.innerHTML = '<p>Nivel nao encontrado.</p>';
        return;
    }

    titleInput.value = level.titulo || '';
    descriptionInput.value = level.descricao || '';

    titleInput.oninput = () => {
        level.titulo = titleInput.value;
    };

    descriptionInput.oninput = () => {
        level.descricao = descriptionInput.value;
    };

    const startIndex = (state.selectedQuizLevel - 1) * QUESTIONS_PER_LEVEL;
    const worldBank = state.quizBank[state.selectedQuizWorld] || [];

    const questionsSlice = worldBank.slice(startIndex, startIndex + QUESTIONS_PER_LEVEL);
    questionsContainer.innerHTML = '';

    questionsSlice.forEach((question, idx) => {
        const card = document.createElement('article');
        card.className = 'quiz-question-card';

        const bankIndex = startIndex + idx;

        card.innerHTML = `
            <h3>Pergunta ${idx + 1}</h3>
            <label>
                Enunciado
                <input type="text" data-field="question" value="${question.question || ''}">
            </label>
            <label>
                Opcoes (separadas por |)
                <input type="text" data-field="options" value="${(question.options || []).join(' | ')}">
            </label>
            <label>
                Indice da correta (0-3)
                <input type="number" data-field="correct" min="0" max="3" value="${Number(question.correct) || 0}">
            </label>
        `;

        const questionInput = card.querySelector('[data-field="question"]');
        const optionsInput = card.querySelector('[data-field="options"]');
        const correctInput = card.querySelector('[data-field="correct"]');

        questionInput.addEventListener('input', () => {
            state.quizBank[state.selectedQuizWorld][bankIndex].question = questionInput.value;
        });

        optionsInput.addEventListener('input', () => {
            state.quizBank[state.selectedQuizWorld][bankIndex].options = optionsInput.value
                .split('|')
                .map((item) => item.trim())
                .filter(Boolean);
        });

        correctInput.addEventListener('input', () => {
            state.quizBank[state.selectedQuizWorld][bankIndex].correct = Number(correctInput.value) || 0;
        });

        questionsContainer.appendChild(card);
    });
}

function getGameLevelsByWorld(worldKey) {
    const world = state.worldLevels[worldKey];
    if (!world?.levels) {
        return [];
    }

    return Object.entries(world.levels)
        .filter(([, level]) => level.tipo === 'game')
        .map(([levelId]) => Number(levelId))
        .sort((a, b) => a - b);
}

function renderGameSelectors() {
    const worldSelect = document.getElementById('game-world-select');
    const levelSelect = document.getElementById('game-level-select');

    if (!worldSelect || !levelSelect) {
        return;
    }

    worldSelect.innerHTML = Object.keys(state.worldLevels)
        .map((worldKey) => `<option value="${worldKey}">${worldKey}</option>`)
        .join('');

    if (!state.worldLevels[state.selectedGameWorld]) {
        state.selectedGameWorld = Object.keys(state.worldLevels)[0];
    }

    worldSelect.value = state.selectedGameWorld;

    const gameLevels = getGameLevelsByWorld(state.selectedGameWorld);
    levelSelect.innerHTML = gameLevels
        .map((levelId) => `<option value="${levelId}">${levelId}</option>`)
        .join('');

    if (!gameLevels.includes(state.selectedGameLevel)) {
        state.selectedGameLevel = gameLevels[0] || 4;
    }

    levelSelect.value = String(state.selectedGameLevel);

    worldSelect.onchange = () => {
        state.selectedGameWorld = worldSelect.value;
        renderGameSelectors();
        renderGameEditor();
    };

    levelSelect.onchange = () => {
        state.selectedGameLevel = Number(levelSelect.value);
        renderGameEditor();
    };
}

function renderGameEditor() {
    const world = state.worldLevels[state.selectedGameWorld];
    const gameLevel = world?.levels?.[state.selectedGameLevel];
    if (!gameLevel) {
        return;
    }

    const titleInput = document.getElementById('game-title');
    const descriptionInput = document.getElementById('game-description');
    const gameTypeInput = document.getElementById('game-type');
    const itemsInput = document.getElementById('game-items');
    const correctOrderInput = document.getElementById('game-correct-order');
    const pairsInput = document.getElementById('game-pairs');
    const timeLimitInput = document.getElementById('game-time-limit');

    titleInput.value = gameLevel.titulo || '';
    descriptionInput.value = gameLevel.descricao || '';
    gameTypeInput.value = gameLevel.gameType || 'sorting';
    itemsInput.value = gameLevel.items ? JSON.stringify(gameLevel.items, null, 2) : '';
    correctOrderInput.value = gameLevel.correctOrder ? JSON.stringify(gameLevel.correctOrder, null, 2) : '';
    pairsInput.value = gameLevel.pairs || '';
    timeLimitInput.value = gameLevel.timeLimit || '';

    titleInput.oninput = () => {
        gameLevel.titulo = titleInput.value;
    };

    descriptionInput.oninput = () => {
        gameLevel.descricao = descriptionInput.value;
    };

    gameTypeInput.onchange = () => {
        gameLevel.gameType = gameTypeInput.value;
    };

    itemsInput.onchange = () => {
        try {
            gameLevel.items = itemsInput.value.trim() ? JSON.parse(itemsInput.value) : undefined;
            showFeedback('Itens do jogo atualizados.');
        } catch (error) {
            showFeedback('JSON invalido em Itens.', 'error');
        }
    };

    correctOrderInput.onchange = () => {
        try {
            gameLevel.correctOrder = correctOrderInput.value.trim()
                ? JSON.parse(correctOrderInput.value)
                : undefined;
            showFeedback('Ordem correta atualizada.');
        } catch (error) {
            showFeedback('JSON invalido em Ordem correta.', 'error');
        }
    };

    pairsInput.onchange = () => {
        const value = Number(pairsInput.value);
        if (!Number.isNaN(value) && value > 0) {
            gameLevel.pairs = value;
        } else {
            delete gameLevel.pairs;
        }
    };

    timeLimitInput.onchange = () => {
        const value = Number(timeLimitInput.value);
        if (!Number.isNaN(value) && value > 0) {
            gameLevel.timeLimit = value;
        } else {
            delete gameLevel.timeLimit;
        }
    };
}

function setupButtons() {
    const saveBtn = document.getElementById('save-content-btn');
    const resetBtn = document.getElementById('reset-content-btn');
    const reloadUsersBtn = document.getElementById('reload-users-btn');

    saveBtn.addEventListener('click', saveContent);
    resetBtn.addEventListener('click', () => {
        const confirmed = window.confirm('Isto vai repor quizzes e jogos para o estado original. Continuar?');
        if (confirmed) {
            resetContent();
        }
    });
    reloadUsersBtn.addEventListener('click', loadUsers);
}

function init() {
    setupTabs();
    loadContentOverrides();
    setupButtons();
    setupNewUserForm();

    renderQuizSelectors();
    renderQuizEditor();
    renderGameSelectors();
    renderGameEditor();

    loadUsers();
}

document.addEventListener('DOMContentLoaded', init);
