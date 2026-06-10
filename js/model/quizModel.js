class QuizModel {
    constructor() {
        this.quizData = this.initializeQuizData();
    }

    // Inicializar dados dos quizzes para cada mundo
    initializeQuizData() {
        return {
            transito: {
                name: 'Trânsito',
                emoji: '🚦',
                quizzes: [
                    {
                        id: 1,
                        type: 'quiz',
                        question: 'Qual é a cor do semáforo que indica "PARE"?',
                        options: ['Verde', 'Amarelo', 'Vermelho', 'Azul'],
                        correct: 2,
                        image: null
                    },
                    {
                        id: 2,
                        type: 'quiz',
                        question: 'O que significa a cor laranja nos sinais de trânsito?',
                        options: ['Perigo', 'Trabalho na via', 'Informação', 'Obrigação'],
                        correct: 1,
                        image: null
                    },
                    {
                        id: 3,
                        type: 'quiz',
                        question: 'Qual cor é usada para sinalizar áreas de serviço?',
                        options: ['Azul', 'Verde', 'Amarelo', 'Vermelho'],
                        correct: 0,
                        image: null
                    }
                ],
                games: [
                    {
                        id: 4,
                        type: 'game',
                        gameType: 'drag_drop',
                        title: 'Organize os Semáforos',
                        description: 'Arraste as cores para a ordem correta do semáforo',
                        items: ['Vermelho', 'Amarelo', 'Verde'],
                        correctOrder: ['Vermelho', 'Amarelo', 'Verde']
                    },
                    {
                        id: 5,
                        type: 'game',
                        gameType: 'speed',
                        title: 'Identificação Rápida',
                        description: 'Identifique a cor dos sinais o mais rápido possível',
                        timeLimit: 30
                    }
                ],
                boss: {
                    id: 'boss_transito',
                    type: 'boss',
                    title: 'Desafio Final de Trânsito',
                    description: 'Combine todos os conhecimentos adquiridos',
                    questions: [] // Será preenchido dinamicamente baseado nas dificuldades
                }
            },
            roupas: {
                name: 'Roupas & Estilo',
                emoji: '👚',
                quizzes: [
                    {
                        id: 1,
                        type: 'quiz',
                        question: 'Qual combinação de cores é considerada clássica?',
                        options: ['Vermelho e Verde', 'Azul Marinho e Branco', 'Amarelo e Roxo', 'Laranja e Preto'],
                        correct: 1,
                        image: null
                    },
                    {
                        id: 2,
                        type: 'quiz',
                        question: 'Qual cor transmite confiança e profissionalismo?',
                        options: ['Rosa', 'Azul Escuro', 'Amarelo', 'Verde Limão'],
                        correct: 1,
                        image: null
                    },
                    {
                        id: 3,
                        type: 'quiz',
                        question: 'O que significa a cor preta na moda?',
                        options: ['Alegria', 'Elegância e Sofisticação', 'Inocência', 'Energia'],
                        correct: 1,
                        image: null
                    }
                ],
                games: [
                    {
                        id: 4,
                        type: 'game',
                        gameType: 'matching',
                        title: 'Combine as Roupas',
                        description: 'Encontre pares de cores que combinam bem',
                        pairs: [
                            { color1: 'Azul', color2: 'Branco' },
                            { color1: 'Cinza', color2: 'Preto' },
                            { color1: 'Bege', color2: 'Marrom' }
                        ]
                    },
                    {
                        id: 5,
                        type: 'game',
                        gameType: 'classification',
                        title: 'Classifique as Cores',
                        description: 'Classifique as roupas por tons (quente/frio)',
                        items: [
                            { name: 'Camisa Vermelha', tone: 'quente' },
                            { name: 'Calça Azul', tone: 'frio' },
                            { name: 'Blusa Amarela', tone: 'quente' },
                            { name: 'Sapato Verde', tone: 'frio' }
                        ]
                    }
                ],
                boss: {
                    id: 'boss_roupas',
                    type: 'boss',
                    title: 'Desafio Final de Estilo',
                    description: 'Crie combinações perfeitas',
                    questions: []
                }
            },
            cozinha: {
                name: 'Cozinha & Alimentação',
                emoji: '🏡',
                quizzes: [
                    {
                        id: 1,
                        type: 'quiz',
                        question: 'Qual cor indica que uma fruta está madura?',
                        options: ['Verde', 'Amarela/Vermelha', 'Azul', 'Roxa'],
                        correct: 1,
                        image: null
                    },
                    {
                        id: 2,
                        type: 'quiz',
                        question: 'O que significa a carne com cor acastanhada?',
                        options: ['Fresca', 'Velha/Estragada', 'Congelada', 'Cozida'],
                        correct: 1,
                        image: null
                    },
                    {
                        id: 3,
                        type: 'quiz',
                        question: 'Qual cor deve ter o leite fresco?',
                        options: ['Amarelo', 'Azulado', 'Branco', 'Rosa'],
                        correct: 2,
                        image: null
                    }
                ],
                games: [
                    {
                        id: 4,
                        type: 'game',
                        gameType: 'sorting',
                        title: 'Separe os Alimentos',
                        description: 'Separe frutas maduras das verdes',
                        items: [
                            { name: 'Banana Verde', state: 'verde' },
                            { name: 'Banana Amarela', state: 'madura' },
                            { name: 'Tomate Verde', state: 'verde' },
                            { name: 'Tomate Vermelho', state: 'madura' }
                        ]
                    },
                    {
                        id: 5,
                        type: 'game',
                        gameType: 'memory',
                        title: 'Memória de Cores',
                        description: 'Encontre os pares de alimentos com a mesma cor',
                        pairs: 6
                    }
                ],
                boss: {
                    id: 'boss_cozinha',
                    type: 'boss',
                    title: 'Chef de Cores',
                    description: 'Identifique o estado dos alimentos',
                    questions: []
                }
            },
            desporto: {
                name: 'Desporto',
                emoji: '⚽',
                quizzes: [
                    {
                        id: 1,
                        type: 'quiz',
                        question: 'Quantas cores tem o arco-íris?',
                        options: ['5', '6', '7', '8'],
                        correct: 2,
                        image: null
                    },
                    {
                        id: 2,
                        type: 'quiz',
                        question: 'Qual é a cor do cartão que indica expulsão no futebol?',
                        options: ['Amarelo', 'Vermelho', 'Azul', 'Verde'],
                        correct: 1,
                        image: null
                    },
                    {
                        id: 3,
                        type: 'quiz',
                        question: 'O que significa a faixa preta em artes marciais?',
                        options: ['Iniciante', 'Nível Intermediário', 'Mestre/Expert', 'Instrutor'],
                        correct: 2,
                        image: null
                    }
                ],
                games: [
                    {
                        id: 4,
                        type: 'game',
                        gameType: 'identification',
                        title: 'Identifique o Equipamento',
                        description: 'Identifique a cor dos equipamentos desportivos',
                        items: [
                            { name: 'Bola de Futebol', color: 'Branca e Preta' },
                            { name: 'Bola de Basquetebol', color: 'Laranja' },
                            { name: 'Bola de Ténis', color: 'Amarela' }
                        ]
                    },
                    {
                        id: 5,
                        type: 'game',
                        gameType: 'reaction',
                        title: 'Reação ao Cartão',
                        description: 'Reaja rapidamente à cor do cartão mostrado',
                        timeLimit: 20
                    }
                ],
                boss: {
                    id: 'boss_desporto',
                    type: 'boss',
                    title: 'Campeão de Cores',
                    description: 'Desafio final desportivo',
                    questions: []
                }
            },
            reflexo: {
                name: 'Reflexo',
                emoji: '🏁',
                quizzes: [
                    {
                        id: 1,
                        type: 'quiz',
                        question: 'Qual é a cor complementar do azul?',
                        options: ['Verde', 'Laranja', 'Roxo', 'Amarelo'],
                        correct: 1,
                        image: null
                    },
                    {
                        id: 2,
                        type: 'quiz',
                        question: 'O que acontece quando misturamos vermelho e azul?',
                        options: ['Verde', 'Laranja', 'Roxo', 'Marrom'],
                        correct: 2,
                        image: null
                    },
                    {
                        id: 3,
                        type: 'quiz',
                        question: 'Qual cor não está no arco-íris?',
                        options: ['Rosa', 'Vermelho', 'Azul', 'Amarelo'],
                        correct: 0,
                        image: null
                    }
                ],
                games: [
                    {
                        id: 4,
                        type: 'game',
                        gameType: 'color_blind_test',
                        title: 'Teste de Reflexo',
                        description: 'Identifique cores com distorção simulada',
                        difficulty: 'hard'
                    },
                    {
                        id: 5,
                        type: 'game',
                        gameType: 'speed_challenge',
                        title: 'Desafio Contra-Relógio',
                        description: 'Complete o máximo de tarefas em 60 segundos',
                        timeLimit: 60
                    }
                ],
                boss: {
                    id: 'boss_reflexo',
                    type: 'boss',
                    title: 'Mestre das Cores',
                    description: 'O desafio final supremo',
                    questions: []
                }
            }
        };
    }

    // Obter dados de um mundo específico
    getWorldData(worldId) {
        return this.quizData[worldId];
    }

    // Obter um quiz específico
    getQuiz(worldId, quizId) {
        const world = this.quizData[worldId];
        if (!world) return null;
        return world.quizzes.find(q => q.id === quizId);
    }

    // Obter um jogo específico
    getGame(worldId, gameId) {
        const world = this.quizData[worldId];
        if (!world) return null;
        return world.games.find(g => g.id === gameId);
    }

    // Obter boss de um mundo
    getBoss(worldId) {
        const world = this.quizData[worldId];
        if (!world) return null;
        return world.boss;
    }

    // Gerar boss baseado nas dificuldades do utilizador
    generateBossQuestions(worldId, wrongAnswers) {
        const world = this.quizData[worldId];
        if (!world) return [];

        // Se houver respostas erradas, usar essas questões no boss
        if (wrongAnswers && wrongAnswers.length > 0) {
            return wrongAnswers.map(answer => ({
                ...answer,
                fromWrongAnswers: true
            }));
        }

        // Caso contrário, usar questões aleatórias do mundo
        const allQuestions = [...world.quizzes];
        return allQuestions.sort(() => Math.random() - 0.5).slice(0, 5);
    }

    // Obter todos os mundos
    getAllWorlds() {
        return this.quizData;
    }
}

export default QuizModel;
