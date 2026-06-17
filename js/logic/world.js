/**
 * World Logic - Gerencia a lógica relacionada a mundos
 */
export const WORLD_LEVELS = {
    comida: {
        progressWorldId: 'cozinha',
        levels: {
            1: { tipo: 'quiz', titulo: 'Nivel 1 - Quiz', descricao: 'Identifica cores basicas de alimentos frescos.' },
            2: { tipo: 'quiz', titulo: 'Nivel 2 - Quiz', descricao: 'Interpreta sinais de qualidade e maturacao.' },
            3: { tipo: 'quiz', titulo: 'Nivel 3 - Quiz', descricao: 'Decide com seguranca em situacoes do dia a dia na cozinha.' },
            4: { tipo: 'game', titulo: 'Nivel 4 - Jogo', descricao: 'Separa frutas maduras das verdes!', gameType: 'sorting', items: [{ name: 'Banana Verde', state: 'verde' }, { name: 'Banana Amarela', state: 'madura' }, { name: 'Tomate Verde', state: 'verde' }, { name: 'Tomate Vermelho', state: 'madura' }] },
            5: { tipo: 'game', titulo: 'Nivel 5 - Jogo', descricao: 'Memoria de cores de alimentos!', gameType: 'memory', pairs: 6 }
        }
    },
    transito: {
        progressWorldId: 'transito',
        levels: {
            1: { tipo: 'quiz', titulo: 'Nivel 1 - Quiz', descricao: 'Reconhece cores essenciais de sinalizacao.' },
            2: { tipo: 'quiz', titulo: 'Nivel 2 - Quiz', descricao: 'Interpreta sinais e marcas da via com precisao.' },
            3: { tipo: 'quiz', titulo: 'Nivel 3 - Quiz', descricao: 'Aplica regras visuais de seguranca em contexto real.' },
            4: { tipo: 'game', titulo: 'Nivel 4 - Jogo', descricao: 'Organiza os semaforos na ordem correta!', gameType: 'drag_drop', items: ['Vermelho', 'Amarelo', 'Verde'], correctOrder: ['Vermelho', 'Amarelo', 'Verde'] },
            5: { tipo: 'game', titulo: 'Nivel 5 - Jogo', descricao: 'Identifica a cor dos sinais o mais rapido possivel!', gameType: 'speed', timeLimit: 30 }
        }
    },
    roupa: {
        progressWorldId: 'roupas',
        levels: {
            1: { tipo: 'quiz', titulo: 'Nivel 1 - Quiz', descricao: 'Aprende combinacoes classicas de cores no vestuario.' },
            2: { tipo: 'quiz', titulo: 'Nivel 2 - Quiz', descricao: 'Distingue tons formais, casuais e de destaque.' },
            3: { tipo: 'quiz', titulo: 'Nivel 3 - Quiz', descricao: 'Escolhe paletas equilibradas para diferentes ocasioes.' },
            4: { tipo: 'quiz', titulo: 'Nivel 4 - Quiz', descricao: 'Resolve cenarios de estilo com leitura correta de cor.' },
            5: { tipo: 'game', titulo: 'Nivel 5 - Jogo', descricao: 'Classifica as roupas por tons quentes e frios!', gameType: 'sorting', items: [{ name: 'Camisa Vermelha', state: 'madura' }, { name: 'Calca Azul', state: 'verde' }, { name: 'Blusa Amarela', state: 'madura' }, { name: 'Sapato Verde', state: 'verde' }] }
        }
    },
    desporto: {
        progressWorldId: 'desporto',
        levels: {
            1: { tipo: 'quiz', titulo: 'Nivel 1 - Quiz', descricao: 'Reconhece cores chave em sinais e equipamentos desportivos.' },
            2: { tipo: 'quiz', titulo: 'Nivel 2 - Quiz', descricao: 'Interpreta regras e simbolos por cor em modalidades populares.' },
            3: { tipo: 'quiz', titulo: 'Nivel 3 - Quiz', descricao: 'Avalia situacoes de jogo com base em codigos visuais.' },
            4: { tipo: 'quiz', titulo: 'Nivel 4 - Quiz', descricao: 'Domina leitura de cor em competicao e arbitragem.' },
            5: { tipo: 'game', titulo: 'Nivel 5 - Jogo', descricao: 'Reage rapidamente a cor do cartao mostrado!', question: 'Reage rapidamente a cor do cartao mostrado!', options: ['Vermelho', 'Amarelo', 'Verde', 'Azul'], correct: 0 }
        }
    }
};

export const WORLD_QUIZ_BANK = {
    comida: [
        { question: 'Qual cor indica normalmente uma banana madura?', options: ['Verde', 'Amarela', 'Azul', 'Branca'], correct: 1 },
        { question: 'Tomate pronto para comer costuma estar de que cor?', options: ['Vermelho', 'Cinza', 'Roxo', 'Preto'], correct: 0 },
        { question: 'Leite fresco tem geralmente que cor?', options: ['Branco', 'Verde', 'Laranja', 'Castanho'], correct: 0 },
        { question: 'Folhas de alface frescas tendem a ser:', options: ['Verde viva', 'Roxa escura', 'Azul clara', 'Preta'], correct: 0 },
        { question: 'Maca verde e normalmente:', options: ['Imatura', 'Sempre podre', 'Sempre doce', 'Ja cozida'], correct: 0 },
        { question: 'Uva roxa madura apresenta geralmente tom:', options: ['Roxo intenso', 'Cinza claro', 'Azul neon', 'Branco puro'], correct: 0 },
        { question: 'Pao queimado ganha cor:', options: ['Preta', 'Verde', 'Rosa', 'Azul'], correct: 0 },
        { question: 'Carne de frango cozida em seguranca fica:', options: ['Rosada no centro', 'Branca por dentro', 'Azulada', 'Verde escura'], correct: 1 },
        { question: 'Abacate no ponto costuma ter casca:', options: ['Muito verde clara', 'Escura e uniforme', 'Branca', 'Vermelha'], correct: 1 },
        { question: 'Queijo mofado inadequado pode mostrar pontos:', options: ['Azuis ou verdes anormais', 'Apenas brancos', 'Apenas amarelos', 'Sem qualquer mancha'], correct: 0 },
        { question: 'Limao maduro geralmente fica:', options: ['Amarelo', 'Roxo', 'Preto', 'Azul'], correct: 0 },
        { question: 'Morango fresco tem cor predominante:', options: ['Vermelho vivo', 'Cinza', 'Verde escuro', 'Azul marinho'], correct: 0 },
        { question: 'Peixe fresco deve ter guelras:', options: ['Vermelhas vivas', 'Cinza secas', 'Pretas opacas', 'Brancas secas'], correct: 0 },
        { question: 'Oleo queimado tende a escurecer para:', options: ['Castanho escuro', 'Amarelo claro', 'Azul claro', 'Branco'], correct: 0 },
        { question: 'Batata com manchas verdes indica presenca de:', options: ['Solanina', 'Acucar extra', 'Vitamina C', 'Sal'], correct: 0 },
        { question: 'Arroz cru normal e geralmente:', options: ['Branco ou bege claro', 'Verde fluorescente', 'Azul escuro', 'Vermelho vivo'], correct: 0 },
        { question: 'Leite estragado pode ganhar tom:', options: ['Amarelado e opaco', 'Azul brilhante', 'Roxo forte', 'Transparente'], correct: 0 },
        { question: 'Ovo com clara muito escura e sinal de:', options: ['Possivel alteracao', 'Frescura extrema', 'Cozimento perfeito', 'Nada relevante'], correct: 0 },
        { question: 'Cenoura fresca tem cor:', options: ['Laranja vivo', 'Cinza', 'Azul', 'Preto'], correct: 0 },
        { question: 'Pepino no ponto tem casca:', options: ['Verde uniforme', 'Branca total', 'Vermelha', 'Laranja'], correct: 0 }
    ],
    transito: [
        { question: 'No semaforo, qual cor significa parar?', options: ['Verde', 'Vermelho', 'Azul', 'Branco'], correct: 1 },
        { question: 'A cor amarela no semaforo pede:', options: ['Acelerar', 'Atencao', 'Estacionar', 'Virar obrigatoriamente'], correct: 1 },
        { question: 'A cor verde no semaforo indica:', options: ['Parar sempre', 'Avancar se seguro', 'Dar marcha atras', 'Pisca alerta'], correct: 1 },
        { question: 'Cones de obra na via usam tipicamente:', options: ['Laranja', 'Cinza', 'Azul', 'Verde'], correct: 0 },
        { question: 'Passadeira pedonal e marcada geralmente em:', options: ['Preto e verde', 'Branco e preto', 'Vermelho e amarelo', 'Azul e laranja'], correct: 1 },
        { question: 'Sinal de proibicao costuma ter borda:', options: ['Vermelha', 'Azul', 'Verde', 'Amarela'], correct: 0 },
        { question: 'Placa de obrigacao e geralmente:', options: ['Azul com simbolo branco', 'Vermelha com simbolo preto', 'Verde com simbolo preto', 'Branca sem simbolo'], correct: 0 },
        { question: 'Sinal triangular de perigo costuma ter fundo:', options: ['Branco', 'Azul', 'Verde', 'Laranja'], correct: 0 },
        { question: 'Luz de marcha atras e normalmente:', options: ['Branca', 'Vermelha', 'Amarela', 'Azul'], correct: 0 },
        { question: 'Luz de travagem traseira e:', options: ['Vermelha', 'Branca', 'Verde', 'Azul'], correct: 0 },
        { question: 'Em autoestradas portuguesas, sinais direcionais sao comuns em:', options: ['Azul', 'Roxo', 'Preto', 'Laranja'], correct: 0 },
        { question: 'Faixa amarela continua junto ao passeio indica:', options: ['Restricao de paragem/estacionamento', 'Zona de corrida', 'Pista ciclovia obrigatoria', 'Sem qualquer regra'], correct: 0 },
        { question: 'Veiculos de emergencia usam luzes:', options: ['Azuis intermitentes', 'Verdes fixas', 'Pretas', 'Brancas fixas'], correct: 0 },
        { question: 'Sinal temporario de obras geralmente usa destaque:', options: ['Amarelo/laranja', 'Roxo', 'Preto total', 'Cinza total'], correct: 0 },
        { question: 'Semaforo avariado exige prioridade por:', options: ['Sinais e regras gerais', 'Cor do carro', 'Tamanho do carro', 'Musica ligada'], correct: 0 },
        { question: 'Marca rodoviaria de stop e normalmente:', options: ['Branca no pavimento', 'Azul no pavimento', 'Verde no pavimento', 'Rosa no pavimento'], correct: 0 },
        { question: 'Pisca de mudanca de direcao habitual e:', options: ['Laranja', 'Azul', 'Verde', 'Branco'], correct: 0 },
        { question: 'Luz de nevoeiro traseira e:', options: ['Vermelha forte', 'Branca', 'Verde', 'Azul'], correct: 0 },
        { question: 'Sinal de informacao turistica pode surgir em:', options: ['Castanho', 'Roxo', 'Rosa choque', 'Preto'], correct: 0 },
        { question: 'Ao ver amarelo no semaforo, a acao segura e:', options: ['Preparar para parar', 'Acelerar sempre', 'Ignorar', 'Dar buzinadelas'], correct: 0 }
    ],
    roupa: [
        { question: 'Que combinacao e classica para look formal?', options: ['Azul marinho e branco', 'Laranja e verde lima', 'Roxo e amarelo neon', 'Vermelho e rosa choque'], correct: 0 },
        { question: 'Cor associada a profissionalismo no vestuario:', options: ['Azul escuro', 'Amarelo neon', 'Limao', 'Coral forte'], correct: 0 },
        { question: 'A cor preta na moda transmite normalmente:', options: ['Desleixo', 'Elegancia', 'Infantilidade', 'Alegria extrema'], correct: 1 },
        { question: 'Branco e azul claro costumam passar imagem de:', options: ['Caos visual', 'Leveza e limpeza', 'Agressividade', 'Peso visual'], correct: 1 },
        { question: 'Bege e marrom geralmente criam efeito:', options: ['Neutro e harmonico', 'Muito agressivo', 'Infantil', 'Desorganizado'], correct: 0 },
        { question: 'Vermelho em excesso em look formal pode passar:', options: ['Grande destaque', 'Discricao maxima', 'Invisibilidade', 'Neutralidade total'], correct: 0 },
        { question: 'Cinza com branco costuma transmitir:', options: ['Sobriedade', 'Confusao visual', 'Paleta neon', 'Contraste extremo sem equilibrio'], correct: 0 },
        { question: 'Para entrevista, tom muito recomendado e:', options: ['Azul marinho', 'Amarelo fluorescente', 'Rosa neon', 'Verde limao intenso'], correct: 0 },
        { question: 'Cores complementares criam:', options: ['Contraste forte', 'Ausencia de contraste', 'Sempre monotonia', 'Proibicao visual'], correct: 0 },
        { question: 'Look monocromatico usa:', options: ['Variacoes da mesma cor', 'Quatro cores aleatorias', 'Apenas preto e branco obrigatorio', 'Sem nenhuma cor'], correct: 0 },
        { question: 'Preto com dourado passa ideia de:', options: ['Sofisticacao', 'Desleixo', 'Uniforme escolar', 'Roupa desportiva tecnica'], correct: 0 },
        { question: 'Pastel e mais associado a:', options: ['Suavidade', 'Agressividade', 'Alto contraste violento', 'Tom metalico'], correct: 0 },
        { question: 'Jeans azul combina facilmente com:', options: ['Branco', 'Laranja neon e roxo neon', 'Verde radioativo', 'Rosa choque e ciano'], correct: 0 },
        { question: 'Estampa muito colorida combina melhor com:', options: ['Peca lisa neutra', 'Outra estampa ainda mais carregada', 'Apenas metalizado', 'Quatro neon ao mesmo tempo'], correct: 0 },
        { question: 'Sapato preto e geralmente:', options: ['Versatil', 'Incompativel com tudo', 'Apenas desportivo', 'Apenas praia'], correct: 0 },
        { question: 'Branco total no look tende a passar:', options: ['Limpeza visual', 'Peso visual extremo', 'Caos cromatico', 'Ambiguidade total'], correct: 0 },
        { question: 'Cores frias incluem:', options: ['Azul e verde', 'Laranja e vermelho', 'Amarelo e coral', 'Castanho e dourado'], correct: 0 },
        { question: 'Cores quentes incluem:', options: ['Vermelho e laranja', 'Azul e ciano', 'Verde e azul marinho', 'Cinza e preto'], correct: 0 },
        { question: 'Para reduzir contraste no look, deves usar:', options: ['Tons proximos', 'Complementares saturadas', 'Neon puro', 'Preto com amarelo vivo'], correct: 0 },
        { question: 'Acessorio colorido em look neutro serve para:', options: ['Criar ponto focal', 'Apagar completamente o visual', 'Eliminar estilo', 'Quebrar a roupa'], correct: 0 }
    ],
    desporto: [
        { question: 'No futebol, cartao de expulsao e da cor:', options: ['Amarelo', 'Vermelho', 'Azul', 'Verde'], correct: 1 },
        { question: 'No futebol, cartao de advertencia e:', options: ['Amarelo', 'Azul', 'Verde', 'Preto'], correct: 0 },
        { question: 'Faixa preta em artes marciais indica:', options: ['Iniciante', 'Nivel avancado', 'Sem experiencia', 'Apenas arbitro'], correct: 1 },
        { question: 'Bolas de basquetebol sao normalmente:', options: ['Laranjas', 'Verdes', 'Brancas', 'Roxas'], correct: 0 },
        { question: 'Bola oficial de tenis e geralmente:', options: ['Amarela', 'Preta', 'Azul escura', 'Roxa'], correct: 0 },
        { question: 'Em natacao, boias de sinalizacao costumam ser:', options: ['Azuis ou laranjas vivas', 'Cinza escuro', 'Pretas', 'Transparentes'], correct: 0 },
        { question: 'Pista de atletismo e frequentemente:', options: ['Vermelha/terra', 'Azul neon', 'Preta brilhante', 'Verde limao'], correct: 0 },
        { question: 'Bandeira de canto no futebol precisa ser:', options: ['Bem visivel', 'Da mesma cor do relvado', 'Transparente', 'Preta opaca'], correct: 0 },
        { question: 'Touca de natacao neon ajuda em:', options: ['Visibilidade', 'Invisibilidade', 'Peso extra', 'Menos seguranca'], correct: 0 },
        { question: 'Coletes em treino de equipa usam cores para:', options: ['Distinguir grupos', 'Decorar sem funcao', 'Tapar numeros', 'Reduzir jogo'], correct: 0 },
        { question: 'Em ciclismo, roupa refletora melhora:', options: ['Seguranca', 'Peso da bicicleta', 'Velocidade do vento', 'Consumo de agua'], correct: 0 },
        { question: 'No voleibol, linha de campo precisa ser:', options: ['Contrastante com piso', 'Mesma cor do piso', 'Transparente', 'Piscante'], correct: 0 },
        { question: 'Semaforo da largada em provas motorizadas usa luzes para:', options: ['Sinalizar inicio', 'Marcar pontos', 'Trocar pneus', 'Contar voltas'], correct: 0 },
        { question: 'Capacete de ciclismo em cor viva facilita:', options: ['Ser visto no transito', 'Ficar escondido', 'Aquecer mais', 'Perder estabilidade'], correct: 0 },
        { question: 'No andebol, arbitro usa cartoes para:', options: ['Comunicar sancoes', 'Trocar jogador automaticamente', 'Contar golos', 'Parar cronometro'], correct: 0 },
        { question: 'Em desportos de neve, lentes coloridas servem para:', options: ['Melhorar contraste visual', 'Piorar visao sempre', 'Aumentar peso', 'Diminuir foco'], correct: 0 },
        { question: 'Linha de meta destacada ajuda a:', options: ['Identificar chegada', 'Confundir atletas', 'Reduzir distancia', 'Ocultar tempo'], correct: 0 },
        { question: 'Bola de futsal costuma ter cor:', options: ['Alta visibilidade', 'Transparente', 'Preta total', 'Camuflada'], correct: 0 },
        { question: 'No rugby, arbitro usa cor no cartao para:', options: ['Indicar tipo de penalizacao', 'Indicar patrocinador', 'Escolher bola', 'Marcar placar'], correct: 0 },
        { question: 'Equipamento de guarda-redes muitas vezes difere em cor para:', options: ['Distinguir da equipa', 'Combinar com rede', 'Sumir no campo', 'Evitar regras'], correct: 0 }
    ]
};

const ADMIN_WORLD_LEVELS_KEY = 'croma_admin_world_levels';
const ADMIN_QUIZ_BANK_KEY = 'croma_admin_quiz_bank';

function canUseLocalStorage() {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function cloneData(data) {
    return JSON.parse(JSON.stringify(data));
}

function getOverrideFromStorage(key, fallbackData) {
    if (!canUseLocalStorage()) {
        return cloneData(fallbackData);
    }

    try {
        const rawValue = window.localStorage.getItem(key);
        if (!rawValue) {
            return cloneData(fallbackData);
        }

        const parsed = JSON.parse(rawValue);
        return parsed || cloneData(fallbackData);
    } catch (error) {
        console.error('Erro ao ler overrides do admin:', error);
        return cloneData(fallbackData);
    }
}

function getRuntimeWorldLevels() {
    return getOverrideFromStorage(ADMIN_WORLD_LEVELS_KEY, WORLD_LEVELS);
}

function getRuntimeQuizBank() {
    return getOverrideFromStorage(ADMIN_QUIZ_BANK_KEY, WORLD_QUIZ_BANK);
}

export function saveWorldContentOverrides(worldLevels, quizBank) {
    if (!canUseLocalStorage()) {
        return;
    }

    window.localStorage.setItem(ADMIN_WORLD_LEVELS_KEY, JSON.stringify(worldLevels));
    window.localStorage.setItem(ADMIN_QUIZ_BANK_KEY, JSON.stringify(quizBank));
}

export function clearWorldContentOverrides() {
    if (!canUseLocalStorage()) {
        return;
    }

    window.localStorage.removeItem(ADMIN_WORLD_LEVELS_KEY);
    window.localStorage.removeItem(ADMIN_QUIZ_BANK_KEY);
}

function buildFiveQuizQuestions(level, worldSlug, levelId) {
    const baseQuestions = [];

    if (Array.isArray(level.questions) && level.questions.length > 0) {
        baseQuestions.push(...level.questions);
    } else if (level.question && Array.isArray(level.options)) {
        baseQuestions.push({
            question: level.question,
            options: level.options,
            correct: Number(level.correct) || 0
        });
    }

    const worldBank = getRuntimeQuizBank()[worldSlug] || [];
    const mergedQuestions = [...baseQuestions];

    worldBank.forEach((questionItem) => {
        const alreadyAdded = mergedQuestions.some((q) => q.question === questionItem.question);
        if (!alreadyAdded) {
            mergedQuestions.push(questionItem);
        }
    });

    if (mergedQuestions.length === 0) {
        return [];
    }

    const startIndex = Math.max(0, (Number(levelId) - 1) * 5);
    const selectedQuestions = mergedQuestions.slice(startIndex, startIndex + 5);
    const fallbackQuestions = selectedQuestions.length > 0 ? selectedQuestions : mergedQuestions;

    const normalized = [];
    for (let index = 0; index < 5; index += 1) {
        const sourceQuestion = fallbackQuestions[index % fallbackQuestions.length];
        normalized.push({
            question: sourceQuestion.question,
            options: [...sourceQuestion.options],
            correct: Number(sourceQuestion.correct) || 0
        });
    }

    return normalized;
}

export function getWorldConfig(worldSlug) {
    const worldLevels = getRuntimeWorldLevels();
    return worldLevels[worldSlug] || null;
}

export function hasWorldConfig(worldSlug) {
    return Boolean(getWorldConfig(worldSlug));
}

export function createWorldLevelDataAdapter(worldSlug) {
    const worldData = getWorldConfig(worldSlug);

    return {
        getQuiz(worldId, levelId) {
            const level = worldData?.levels[levelId];
            if (level?.tipo !== 'quiz') {
                return null;
            }

            const questions = buildFiveQuizQuestions(level, worldSlug, levelId);
            if (questions.length === 0) {
                return null;
            }

            return {
                ...level,
                questions,
                question: questions[0].question,
                options: questions[0].options,
                correct: questions[0].correct
            };
        },
        getGame(worldId, levelId) {
            const level = worldData?.levels[levelId];
            if (level?.tipo !== 'game') {
                return null;
            }

            return {
                ...level,
                title: level.title || level.titulo,
                description: level.description || level.descricao
            };
        }
    };
}

class WorldLogic {
    constructor(quizModel, progressModel) {
        this.quizModel = quizModel;
        this.progressModel = progressModel;
    }

    // Obter dados de um mundo específico
    getWorldData(worldId) {
        return this.quizModel.getWorldData(worldId);
    }

    // Obter todos os mundos
    getAllWorlds() {
        return this.quizModel.getAllWorlds();
    }

    // Obter progresso de um mundo
    getWorldProgress(worldId) {
        return this.progressModel.getWorldProgress(worldId);
    }

    // Verificar se um mundo está desbloqueado
    isWorldUnlocked(worldId) {
        const progress = this.getWorldProgress(worldId);
        return progress?.unlocked || false;
    }

    // Verificar se um mundo está completo
    isWorldCompleted(worldId) {
        const progress = this.getWorldProgress(worldId);
        return progress?.completed || false;
    }

    // Calcular estrelas de um mundo
    calculateWorldStars(worldId) {
        const progress = this.getWorldProgress(worldId);
        if (!progress || !progress.levels) return 0;
        
        return Object.values(progress.levels).reduce((total, level) => total + (level.stars || 0), 0);
    }

    // Calcular progresso percentual de um mundo
    calculateWorldProgress(worldId) {
        const progress = this.getWorldProgress(worldId);
        if (!progress || !progress.levels) return 0;
        
        const totalLevels = Object.keys(progress.levels).length;
        const completedLevels = Object.values(progress.levels).filter(level => level.completed).length;
        
        return Math.round((completedLevels / totalLevels) * 100);
    }

    // Desbloquear próximo mundo
    unlockNextWorld(currentWorldId) {
        const worldOrder = ['transito', 'roupas', 'cozinha', 'desporto'];
        const currentIndex = worldOrder.indexOf(currentWorldId);
        
        if (currentIndex !== -1 && currentIndex < worldOrder.length - 1) {
            const nextWorldId = worldOrder[currentIndex + 1];
            const progress = this.progressModel.getProgress();
            
            if (progress.worlds[nextWorldId]) {
                progress.worlds[nextWorldId].unlocked = true;
                this.progressModel.saveProgress();
            }
        }
    }

    // Marcar mundo como completo
    markWorldCompleted(worldId) {
        const progress = this.progressModel.getProgress();
        
        if (progress.worlds[worldId]) {
            progress.worlds[worldId].completed = true;
            this.progressModel.saveProgress();
            
            // Desbloquear próximo mundo
            this.unlockNextWorld(worldId);
        }
    }

    // Obter boss de um mundo
    getBoss(worldId) {
        return this.quizModel.getBoss(worldId);
    }

    // Gerar perguntas do boss
    generateBossQuestions(worldId, difficulties) {
        return this.quizModel.generateBossQuestions(worldId, difficulties);
    }
}

export default WorldLogic;
