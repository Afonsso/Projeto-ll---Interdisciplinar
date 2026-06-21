import ChatbotView from '../view/chatbotView.js';

const STORAGE_VERSION = 'v1';
const MAX_CONVERSATIONS = 10;
const MAX_MESSAGES_PER_CONVERSATION = 40;

class ChatbotController {
    constructor(authService, chatbotView) {
        this.authService = authService;
        this.chatbotView = chatbotView || new ChatbotView();
        this.conversations = [];
        this.activeConversationId = null;
        this.storageKey = 'croma_chat_history_guest';
        this.isSending = false;
        this.userName = 'utilizador';
    }

    init() {
        const container = document.getElementById('chatbot-root');
        if (!container) return;

        const currentUser = this.authService?.getCurrentUser?.();
        this.userName = currentUser?.name || 'utilizador';
        const userKey = currentUser?.id || currentUser?.email || 'guest';
        this.storageKey = `croma_chat_history_${STORAGE_VERSION}_${userKey}`;

        this._loadState();

        if (!this.activeConversationId || !this._getActiveConversation()) {
            this._createConversation({ persist: this.conversations.length === 0 });
        }

        this.chatbotView.init(container);
        this.chatbotView.renderPage({ userName: this.userName });
        this._renderSidebar();
        this._renderActiveConversation();
        this.bindEvents();
    }

    bindEvents() {
        this.chatbotView.bindHandlers({
            onSubmit: (message, image) => this.handleUserMessage(message, image),
            onSuggestion: (topic) => this.handleSuggestion(topic),
            onSelectConversation: (conversationId) => this.selectConversation(conversationId),
            onNewConversation: () => this.startNewConversation()
        });
    }

    handleSuggestion(topic) {
        this.chatbotView.setInputValue(topic);
        this.handleUserMessage(topic);
    }

    selectConversation(conversationId) {
        if (this.isSending) return;

        const conversation = this.conversations.find(item => item.id === conversationId);
        if (!conversation) return;

        this.activeConversationId = conversationId;
        this._saveState();
        this._renderSidebar();
        this._renderActiveConversation();
    }

    startNewConversation() {
        if (this.isSending) return;

        this._createConversation({ persist: true });
        this._saveState();
        this._renderSidebar();
        this._renderActiveConversation();
        this.chatbotView.clearInput();
        this.chatbotView.removeAttachedImage();
    }

    async handleUserMessage(message, imageBase64) {
        const trimmed = String(message || '').trim();
        const liveImageBase64 = imageBase64 || null;
        if ((!trimmed && !liveImageBase64) || this.isSending) return;

        const conversation = this._getActiveConversation() || this._createConversation({ persist: true });
        const userMessage = {
            role: 'user',
            text: trimmed || '📷 Imagem enviada',
            // A imagem é usada só nesta interação. Não é guardada no histórico/localStorage.
            createdAt: new Date().toISOString()
        };

        this._appendMessage(conversation, userMessage);
        this.chatbotView.addMessage('user', userMessage.text, liveImageBase64);
        this.chatbotView.clearInput();
        this.chatbotView.removeAttachedImage();
        this._renderSidebar();

        this.isSending = true;
        this.chatbotView.setSendingState(true);
        this.chatbotView.showTyping();

        try {
            await this._delay(450);
            const replyText = await this._buildReply(trimmed, liveImageBase64);
            const assistantMessage = {
                role: 'assistant',
                text: replyText,
                createdAt: new Date().toISOString()
            };

            this._appendMessage(conversation, assistantMessage);
            this.chatbotView.hideTyping();
            this.chatbotView.addMessage('bot', replyText);
            this.chatbotView.renderSuggestedTopics(this._getSuggestions(trimmed));
            this._renderSidebar();
        } catch (err) {
            console.error('Chatbot error:', err);
            this.chatbotView.hideTyping();
            const fallback = 'Ocorreu um problema ao gerar a resposta. A imagem não foi guardada no histórico. Tenta enviar novamente ou descreve o que queres analisar.';
            this._appendMessage(conversation, {
                role: 'assistant',
                text: fallback,
                createdAt: new Date().toISOString()
            });
            this.chatbotView.addMessage('bot', fallback);
        } finally {
            this.isSending = false;
            this.chatbotView.setSendingState(false);
            this._saveState();
        }
    }

    _appendMessage(conversation, message) {
        conversation.messages.push(message);
        conversation.messages = conversation.messages.slice(-MAX_MESSAGES_PER_CONVERSATION);
        conversation.updatedAt = new Date().toISOString();

        if (!conversation.title || conversation.title === 'Nova conversa') {
            conversation.title = this._makeTitle(message.text);
        }

        this._sortAndTrimConversations();
        this._saveState();
    }

    async _buildReply(text, imageBase64) {
        if (imageBase64) {
            return this._buildImageReply(text, imageBase64);
        }

        return this._buildLocalReply(text, false);
    }

    async _buildImageReply(text, imageBase64) {
        const normalized = this._normalize(text);
        const analysis = await this._analyzeImageBase64(imageBase64);
        const colors = analysis.colors.length > 0
            ? analysis.colors.map(color => color.label).join(', ')
            : 'tons pouco definidos';

        const contrastText = analysis.contrastRatio >= 4.5
            ? 'O contraste geral parece bom para leitura e distinção.'
            : analysis.contrastRatio >= 3
                ? 'O contraste geral parece médio; pode funcionar em elementos grandes, mas não é ideal para texto pequeno.'
                : 'O contraste geral parece baixo; convém reforçar diferença de claro/escuro ou acrescentar contornos.';

        const colorTip = this._getImageColorTip(analysis.colors.map(color => color.label));

        if (/(combina|combinar|roupa|look|camisa|calcas|calças|vestido|sapatos|outfit)/.test(normalized)) {
            return `Analisei a imagem sem a guardar no histórico.

**Tons principais:** ${colors}.

${contrastText}

Para roupa/look: ${colorTip} Se quiseres uma combinação mais segura para pessoas daltónicas, usa uma peça neutra como branco, preto, cinzento, bege ou azul-marinho para separar tons parecidos.`;
        }

        if (/(contraste|legivel|legível|texto|fundo|interface|design|acessibilidade)/.test(normalized)) {
            return `Analisei a imagem sem a guardar no histórico.

**Tons principais:** ${colors}.

${contrastText}

Para acessibilidade, evita depender apenas da cor: usa texto, ícones, padrões ou contornos. Se houver texto por cima da imagem, coloca uma camada escura/clara por trás para aumentar a legibilidade.`;
        }

        if (/(cor|cores|vermelho|verde|azul|amarelo|roxo|rosa|laranja|castanho|bege)/.test(normalized)) {
            return `Analisei a imagem sem a guardar no histórico.

**Tons principais:** ${colors}.

${contrastText}

${colorTip}`;
        }

        return `Analisei a imagem sem a guardar no histórico.

**Tons principais:** ${colors}.

${contrastText}

Consigo ajudar melhor se me disseres o objetivo: confirmar se as cores combinam, melhorar contraste, perceber possíveis confusões para daltonismo ou adaptar a imagem para acessibilidade.`;
    }

    _analyzeImageBase64(imageBase64) {
        return new Promise((resolve, reject) => {
            const image = new Image();

            image.onload = () => {
                try {
                    const size = 72;
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d', { willReadFrequently: true });
                    const scale = Math.min(size / image.width, size / image.height, 1);

                    canvas.width = Math.max(1, Math.round(image.width * scale));
                    canvas.height = Math.max(1, Math.round(image.height * scale));
                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

                    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                    const buckets = new Map();
                    let minLum = 1;
                    let maxLum = 0;
                    let total = 0;

                    for (let i = 0; i < pixels.length; i += 4) {
                        const alpha = pixels[i + 3];
                        if (alpha < 80) continue;

                        const r = pixels[i];
                        const g = pixels[i + 1];
                        const b = pixels[i + 2];
                        const lum = this._relativeLuminance(r, g, b);
                        minLum = Math.min(minLum, lum);
                        maxLum = Math.max(maxLum, lum);
                        total += 1;

                        const key = [r, g, b].map(value => Math.round(value / 32) * 32).join('-');
                        const current = buckets.get(key) || { count: 0, r: 0, g: 0, b: 0 };
                        current.count += 1;
                        current.r += r;
                        current.g += g;
                        current.b += b;
                        buckets.set(key, current);
                    }

                    const colors = [...buckets.values()]
                        .sort((a, b) => b.count - a.count)
                        .slice(0, 5)
                        .map(bucket => {
                            const r = Math.round(bucket.r / bucket.count);
                            const g = Math.round(bucket.g / bucket.count);
                            const b = Math.round(bucket.b / bucket.count);
                            return {
                                r,
                                g,
                                b,
                                label: this._describeColor(r, g, b),
                                percent: total ? Math.round((bucket.count / total) * 100) : 0
                            };
                        })
                        .filter((color, index, array) => array.findIndex(item => item.label === color.label) === index)
                        .slice(0, 4);

                    resolve({
                        colors,
                        contrastRatio: Number(((maxLum + 0.05) / (minLum + 0.05)).toFixed(2))
                    });
                } catch (error) {
                    reject(error);
                }
            };

            image.onerror = () => reject(new Error('Não foi possível carregar a imagem.'));
            image.src = imageBase64;
        });
    }

    _relativeLuminance(r, g, b) {
        const convert = value => {
            const channel = value / 255;
            return channel <= 0.03928
                ? channel / 12.92
                : Math.pow((channel + 0.055) / 1.055, 2.4);
        };

        return (0.2126 * convert(r)) + (0.7152 * convert(g)) + (0.0722 * convert(b));
    }

    _describeColor(r, g, b) {
        const { h, s, l } = this._rgbToHsl(r, g, b);

        if (l < 12) return 'preto';
        if (l > 88 && s < 30) return 'branco';
        if (s < 14) return l > 55 ? 'cinzento claro' : 'cinzento escuro';
        if (l < 24) return 'tom escuro';
        if (h < 15 || h >= 345) return 'vermelho';
        if (h < 38) return l < 45 ? 'castanho' : 'laranja';
        if (h < 65) return 'amarelo';
        if (h < 165) return 'verde';
        if (h < 200) return 'turquesa';
        if (h < 255) return 'azul';
        if (h < 292) return 'roxo';
        if (h < 335) return 'rosa';
        return 'vermelho';
    }

    _rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0;
        let s = 0;
        const l = (max + min) / 2;

        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r:
                    h = ((g - b) / d) + (g < b ? 6 : 0);
                    break;
                case g:
                    h = ((b - r) / d) + 2;
                    break;
                default:
                    h = ((r - g) / d) + 4;
            }

            h *= 60;
        }

        return { h, s: s * 100, l: l * 100 };
    }

    _getImageColorTip(labels) {
        const set = new Set(labels);

        if (set.has('vermelho') && set.has('verde')) {
            return 'Há vermelho e verde na imagem, uma combinação que pode ser difícil para protanopia/deuteranopia. Reforça com diferença de luminosidade, padrão ou legenda.';
        }

        if (set.has('azul') && set.has('roxo')) {
            return 'Azul e roxo podem ficar parecidos em algumas condições de luz. Separar com branco, cinzento claro ou contorno ajuda.';
        }

        if (set.has('amarelo') && (set.has('castanho') || set.has('verde'))) {
            return 'Amarelo com castanho/verde pode perder definição dependendo da iluminação. Um contorno escuro ou fundo neutro melhora a distinção.';
        }

        if (set.has('cinzento claro') || set.has('branco') || set.has('preto') || set.has('cinzento escuro')) {
            return 'A presença de tons neutros ajuda a separar as cores e torna a composição mais segura para acessibilidade.';
        }

        return 'Para tornar a imagem mais acessível, aumenta o contraste de claro/escuro e acrescenta pistas que não dependam só da cor.';
    }

    _buildLocalReply(text, hasImage) {
        const normalized = this._normalize(text);

        if (hasImage && !text) {
            return 'Recebi a imagem para esta resposta, mas ela não fica guardada no histórico. Posso ajudar-te a pensar em contraste, combinações de cores e possíveis confusões comuns para pessoas daltónicas.';
        }

        if (hasImage) {
            return 'Imagem recebida para esta resposta, mas sem ficar guardada no histórico. Diz-me quais são as cores ou objetos que queres comparar.';
        }

        if (/\b(ola|olá|oi|bom dia|boa tarde|boa noite|hey)\b/.test(normalized)) {
            return `Olá, ${this.userName}! Sou o Croma Bot. Posso ajudar-te com daltonismo, teste de Ishihara, treino, perfil, XP, conquistas e combinações de cores.`;
        }

        if (/(cor|cores|vermelho|verde|azul|roxo|amarelo|laranja|castanho|bege|preto|branco|cinzento|rosa|roupa|camisa|gravata|calcas|calças|combina|combinar|look)/.test(normalized)) {
            return this._buildColorAdvice(normalized, text);
        }

        if (/(ishihara|teste|diagnostico|diagnóstico|placas|daltonismo|daltonico|daltónico|daltônico)/.test(normalized)) {
            return 'O teste de Ishihara usa placas com pontos coloridos para perceber se tens dificuldade em distinguir certos tons. Na Croma, podes fazer o teste e usar o resultado para personalizar a tua experiência. O resultado não substitui uma avaliação médica, mas ajuda-te a perceber melhor o teu perfil visual.';
        }

        if (/(deuteranopia|deuteranomalia|protanopia|protanomalia|tritanopia|tritanomalia|acromatopsia)/.test(normalized)) {
            return 'Esses tipos de daltonismo afetam canais de cor diferentes: deuteranopia/deuteranomalia dificulta sobretudo verdes, protanopia/protanomalia afeta vermelhos, tritanopia/tritanomalia afeta azuis e amarelos, e acromatopsia reduz muito ou totalmente a perceção de cor. Uma boa estratégia é usar contraste de luminosidade, etiquetas e padrões, não apenas cor.';
        }

        if (/(treino|quiz|quizzes|mundo|mundos|jogo|jogar|nivel|nível|desporto|transito|trânsito|comida|roupa)/.test(normalized)) {
            return 'Na área de Treino podes entrar em mundos temáticos como Trânsito, Roupa, Comida e Desporto. Completa quizzes e desafios para ganhar XP, desbloquear progresso e praticar decisões do dia a dia ligadas às cores.';
        }

        if (/(perfil|xp|progresso|estrela|estrelas|conquista|conquistas|trofeu|troféu)/.test(normalized)) {
            return 'No Perfil consegues ver o teu XP, progresso por mundo, estrelas e conquistas desbloqueadas. O histórico do chatbot fica guardado neste navegador para poderes voltar às conversas anteriores.';
        }

        if (/(contraste|acessibilidade|legibilidade|interface|design|texto|fundo)/.test(normalized)) {
            return 'Para melhorar acessibilidade: usa bom contraste entre texto e fundo, evita depender só de vermelho/verde, acrescenta ícones ou etiquetas, usa padrões em gráficos e confirma estados importantes com texto, não apenas com cor.';
        }

        if (/(historico|histórico|conversa|conversas|guardar|guardado)/.test(normalized)) {
            return 'O histórico está ativo: cada conversa fica guardada no painel “Histórico”, à esquerda. Podes clicar numa conversa antiga para a abrir ou usar “Nova” para começar outra sem apagar as anteriores.';
        }

        if (this._isOutOfScope(normalized)) {
            return 'Sou um assistente dedicado só ao tema do daltonismo e perceção de cores na Croma (teste de Ishihara, tipos de daltonismo, contraste, combinações de cores, treino e perfil). Essa pergunta sai fora desse âmbito, por isso não vou conseguir ajudar com ela. Tens alguma dúvida sobre cores, daltonismo ou a aplicação Croma?';
        }

        return 'Posso ajudar-te com dúvidas sobre daltonismo, combinações de cores, contraste, treino, quizzes, XP, conquistas e teste de Ishihara. Diz-me o contexto e eu respondo de forma prática.';
    }

    /**
     * Deteta se a pergunta foge claramente ao âmbito de daltonismo/cor da
     * aplicação (ex: matemática, geografia, programação, atualidades,
     * piadas, receitas, etc.), para que o chatbot recuse em vez de tentar
     * responder a qualquer assunto.
     */
    _isOutOfScope(normalizedText) {
        // Tópicos claramente fora do âmbito de daltonismo/cor/Croma.
        const outOfScopePatterns = [
            /\b(capital de|presidente|primeiro[- ]ministro|guerra|historia mundial|história mundial)\b/,
            /\b(equa[cç][aã]o|matematica|matemática|deriva|integral|raiz quadrada|teorema)\b/,
            /\b(codigo|código|programar|programação|javascript|python|java\b|html|css\b|sql|bug|funcao|função)\b/,
            /\b(piada|anedota|horoscopo|horóscopo|signo|previsao do tempo|previsão do tempo|meteorologia)\b/,
            /\b(receita|cozinhar|culinaria|culinária|bolo|massa|ingrediente)\b/,
            /\b(futebol|jogo de futebol|resultado do jogo|campeonato|liga dos campeoes|liga dos campeões)\b/,
            /\b(filme|serie|série|musica|música|cantor|cantora|ator|atriz|netflix|spotify)\b/,
            /\b(bolsa de valores|acoes|ações|bitcoin|criptomoeda|investir|economia mundial)\b/,
            /\b(namoro|relacionamento amoroso|conselho de vida|terapia|psicologo|psicólogo)\b/
        ];

        // Se a frase também tocar em cor/daltonismo/Croma, não é considerada
        // fora de âmbito (ex.: "qual filme tem boas combinações de cor?").
        const inScopeHint = /(cor|cores|dalton|ishihara|protan|deuter|tritan|contraste|acessibilidade|croma|treino|perfil|xp)/.test(normalizedText);
        if (inScopeHint) return false;

        return outOfScopePatterns.some((pattern) => pattern.test(normalizedText));
    }

    _buildColorAdvice(normalizedText, originalText = '') {
        const colors = this._extractColorsFromText(originalText || normalizedText);
        const asksContrast = /(contraste|legivel|legível|texto|fundo|background|wcag|acessibilidade)/.test(normalizedText);
        const asksCompatibility = /(combina|combinar|fica bem|resulta|usar junto|juntas|juntos|look|roupa|camisa|calcas|calças|vestido|sapatos|outfit)/.test(normalizedText);
        const asksDaltonism = /(dalton|daltónico|daltônico|protan|deuter|tritan|confund|distinguir)/.test(normalizedText);
        const asksMeaning = /(significa|significado|transmite|sensacao|sensação|emoção|emocao)/.test(normalizedText);

        if (colors.length === 1) {
            const color = colors[0];
            const contrastTip = this._getTextContrastSuggestion(color);
            const meaning = this._getColorMeaning(color.label);

            if (asksContrast) {
                return `A cor **${color.label}** (${color.hex}) tem luminosidade ${this._describeLightness(color)}. ${contrastTip} Para acessibilidade, confirma sempre o contraste com o fundo real e não uses só a cor para transmitir informação.`;
            }

            if (asksMeaning) {
                return `A cor **${color.label}** (${color.hex}) costuma transmitir ${meaning}. Em interfaces ou materiais acessíveis, combina-a com texto/ícones para a mensagem não depender só da cor.`;
            }

            return `A cor que identifico é **${color.label}** (${color.hex}). É um tom ${this._describeLightness(color)}. ${contrastTip} ${this._getAccessibleColorAdvice([color])}`;
        }

        if (colors.length >= 2) {
            const mainColors = colors.slice(0, 3);
            const pairAdvice = this._getColorPairAdvice(mainColors[0], mainColors[1]);
            const contrastRatio = this._contrastRatioForColors(mainColors[0], mainColors[1]);
            const contrastText = contrastRatio >= 4.5
                ? `O contraste entre **${mainColors[0].label}** e **${mainColors[1].label}** é bom para texto normal (${contrastRatio}:1).`
                : contrastRatio >= 3
                    ? `O contraste entre **${mainColors[0].label}** e **${mainColors[1].label}** é médio (${contrastRatio}:1); pode servir para elementos grandes, mas não para texto pequeno.`
                    : `O contraste entre **${mainColors[0].label}** e **${mainColors[1].label}** é baixo (${contrastRatio}:1); para texto ou botões, convém aumentar a diferença claro/escuro.`;

            if (asksContrast) {
                return `${contrastText} ${this._getAccessibleColorAdvice(mainColors)}`;
            }

            if (asksDaltonism) {
                return `${pairAdvice} ${this._getAccessibleColorAdvice(mainColors)} Para pessoas daltónicas, acrescenta também etiquetas, padrões, ícones ou contornos.`;
            }

            if (asksCompatibility) {
                return `${pairAdvice} ${contrastText} Para roupa/design, uma forma segura é deixar uma das cores dominar e usar a outra como detalhe.`;
            }

            return `As cores que encontrei foram **${this._readableList(mainColors.map(color => `${color.label} (${color.hex})`))}**. ${pairAdvice} ${contrastText}`;
        }

        if (asksMeaning) {
            return 'Cores transmitem sensações diferentes conforme o contexto: **azul** passa calma/confiança, **verde** equilíbrio/natureza, **amarelo** atenção/otimismo, **vermelho** energia/urgência, **roxo** criatividade e **neutros** simplicidade. Para acessibilidade, junta sempre texto ou ícones à cor.';
        }

        if (asksContrast) {
            return 'Para avaliar contraste preciso de duas cores, por exemplo “contraste entre #273154 e branco” ou “texto preto em fundo amarelo”. Regra prática: texto pequeno precisa de contraste forte; se as cores tiverem luminosidade parecida, usa uma versão mais clara/escura ou adiciona contorno.';
        }

        if (asksDaltonism) {
            return 'Para pessoas daltónicas, evita depender só de vermelho/verde, azul/roxo ou amarelo/bege. As combinações mais seguras usam diferença clara de luminosidade, por exemplo azul-marinho com branco, preto com amarelo claro, ou uma cor forte com cinzento/branco. Acrescenta etiquetas, ícones ou padrões.';
        }

        if (asksCompatibility) {
            return 'Para saber se cores combinam, usa esta regra simples: escolhe uma cor principal, uma cor de apoio e um neutro. Exemplos seguros: azul-marinho + branco + amarelo, verde + bege + branco, vermelho fechado + azul-marinho + cinzento. O neutro ajuda a separar tons parecidos.';
        }

        const hasRed = /vermelh/.test(normalizedText);
        const hasGreen = /verde/.test(normalizedText);
        const hasBlue = /azul/.test(normalizedText);
        const hasPurple = /roxo|violeta|lilas|lilás/.test(normalizedText);
        const hasYellow = /amarel/.test(normalizedText);
        const hasBrown = /castanh|bege/.test(normalizedText);

        if (hasRed && hasGreen) {
            return 'Vermelho e verde podem ser confundidos por pessoas com protanopia ou deuteranopia. Para tornar a combinação mais segura, acrescenta diferença de luminosidade, textura, contorno ou uma terceira cor neutra como branco, preto, cinzento ou bege.';
        }

        if (hasBlue && hasPurple) {
            return 'Azul e roxo podem ficar parecidos em alguns contextos, sobretudo com pouca luz. Para um look mais claro e fácil de distinguir, combina azul-marinho com branco, bege ou cinzento claro.';
        }

        if (hasYellow && hasBrown) {
            return 'Amarelo, castanho e bege podem aproximar-se dependendo da iluminação. Usa contraste: amarelo com azul-escuro ou castanho com branco costuma ficar mais legível.';
        }

        if (hasRed && hasBlue) {
            return 'Vermelho com azul costuma criar uma combinação forte e distinguível. Para roupa, funciona melhor se um dos tons for mais escuro, por exemplo azul-marinho com vermelho mais fechado.';
        }

        return 'Posso responder a perguntas sobre cores como: “que cor é #273154?”, “vermelho combina com azul?”, “esta cor é boa para texto?”, “que cores evitar para daltónicos?” ou “que cor transmite calma?”. Em geral, avalio contraste, combinação, significado visual e risco de confusão para daltonismo.';
    }

    _extractColorsFromText(text) {
        const source = String(text || '');
        const normalized = this._normalize(source);
        const colors = [];
        const seen = new Set();

        const addColor = (color) => {
            if (!color || seen.has(color.hex)) return;
            seen.add(color.hex);
            colors.push(color);
        };

        const hexMatches = source.match(/#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g) || [];
        hexMatches.forEach(hex => {
            const rgb = this._hexToRgb(hex);
            if (!rgb) return;
            addColor({
                ...rgb,
                hex: this._rgbToHex(rgb.r, rgb.g, rgb.b),
                label: this._describeColor(rgb.r, rgb.g, rgb.b)
            });
        });

        const namedColors = [
            { terms: ['azul marinho', 'azul-marinho'], label: 'azul-marinho', hex: '#0b1f4d' },
            { terms: ['azul claro'], label: 'azul claro', hex: '#7ec8e3' },
            { terms: ['azul escuro'], label: 'azul escuro', hex: '#1f3a5f' },
            { terms: ['vermelho'], label: 'vermelho', hex: '#d62828' },
            { terms: ['verde'], label: 'verde', hex: '#2a9d55' },
            { terms: ['amarelo'], label: 'amarelo', hex: '#f4d35e' },
            { terms: ['laranja'], label: 'laranja', hex: '#f77f00' },
            { terms: ['roxo', 'violeta'], label: 'roxo', hex: '#7b2cbf' },
            { terms: ['lilas', 'lilás'], label: 'lilás', hex: '#b185db' },
            { terms: ['rosa'], label: 'rosa', hex: '#f284b6' },
            { terms: ['castanho', 'marrom'], label: 'castanho', hex: '#7f4f24' },
            { terms: ['bege'], label: 'bege', hex: '#d8c3a5' },
            { terms: ['preto'], label: 'preto', hex: '#111111' },
            { terms: ['branco'], label: 'branco', hex: '#ffffff' },
            { terms: ['cinzento', 'cinza'], label: 'cinzento', hex: '#808080' },
            { terms: ['turquesa', 'ciano'], label: 'turquesa', hex: '#2ec4b6' }
        ];

        namedColors.forEach(item => {
            if (item.terms.some(term => new RegExp(`\\b${this._escapeRegExp(this._normalize(term))}\\b`).test(normalized))) {
                const rgb = this._hexToRgb(item.hex);
                addColor({ ...rgb, hex: item.hex, label: item.label });
            }
        });

        return colors;
    }

    _hexToRgb(hex) {
        const clean = String(hex || '').replace('#', '').trim();
        if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(clean)) return null;
        const full = clean.length === 3
            ? clean.split('').map(char => char + char).join('')
            : clean;

        return {
            r: parseInt(full.slice(0, 2), 16),
            g: parseInt(full.slice(2, 4), 16),
            b: parseInt(full.slice(4, 6), 16)
        };
    }

    _rgbToHex(r, g, b) {
        return `#${[r, g, b].map(value => Math.max(0, Math.min(255, value)).toString(16).padStart(2, '0')).join('')}`;
    }

    _contrastRatioForColors(colorA, colorB) {
        const lumA = this._relativeLuminance(colorA.r, colorA.g, colorA.b);
        const lumB = this._relativeLuminance(colorB.r, colorB.g, colorB.b);
        const lighter = Math.max(lumA, lumB);
        const darker = Math.min(lumA, lumB);
        return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
    }

    _getTextContrastSuggestion(color) {
        const black = { r: 17, g: 17, b: 17, label: 'preto', hex: '#111111' };
        const white = { r: 255, g: 255, b: 255, label: 'branco', hex: '#ffffff' };
        const blackRatio = this._contrastRatioForColors(color, black);
        const whiteRatio = this._contrastRatioForColors(color, white);

        if (blackRatio >= whiteRatio) {
            return `Para texto por cima desta cor, **preto/cinzento muito escuro** é a opção mais legível (${blackRatio}:1).`;
        }

        return `Para texto por cima desta cor, **branco** é a opção mais legível (${whiteRatio}:1).`;
    }

    _getColorPairAdvice(colorA, colorB) {
        const labels = [colorA.label, colorB.label];
        const has = (...names) => names.every(name => labels.includes(name));
        const familyA = this._colorFamily(colorA.label);
        const familyB = this._colorFamily(colorB.label);

        if (has('vermelho', 'verde')) {
            return 'Vermelho e verde podem combinar visualmente, mas são uma dupla de risco para protanopia/deuteranopia. Usa diferença clara de luminosidade, padrão ou uma legenda.';
        }

        if ((familyA === 'azul' && familyB === 'roxo') || (familyA === 'roxo' && familyB === 'azul')) {
            return 'Azul e roxo ficam harmoniosos, mas podem parecer próximos. Para distinguir melhor, usa azul-marinho com lilás claro, ou separa com branco/cinzento.';
        }

        if ((familyA === 'amarelo' && familyB === 'castanho') || (familyA === 'castanho' && familyB === 'amarelo')) {
            return 'Amarelo e castanho/bege combinam de forma quente e natural, mas precisam de bom contraste para não parecerem “apagados”.';
        }

        if ((familyA === 'vermelho' && familyB === 'azul') || (familyA === 'azul' && familyB === 'vermelho')) {
            return 'Vermelho e azul costumam funcionar bem porque têm diferença visual forte. Para um resultado mais equilibrado, usa um deles como cor principal e o outro como destaque.';
        }

        if (familyA === 'neutro' || familyB === 'neutro') {
            return 'Esta combinação é segura: tons neutros ajudam a separar a cor principal e costumam melhorar a legibilidade.';
        }

        return 'Estas cores podem funcionar, mas o mais importante é garantir diferença de claro/escuro. Se forem muito parecidas em luminosidade, acrescenta um neutro, contorno ou padrão.';
    }

    _getAccessibleColorAdvice(colors) {
        const families = colors.map(color => this._colorFamily(color.label));

        if (families.includes('vermelho') && families.includes('verde')) {
            return 'Para daltonismo vermelho-verde, esta é uma combinação sensível; reforça com texto, ícones ou padrões.';
        }

        if (families.includes('azul') && families.includes('roxo')) {
            return 'Para evitar confusão, aumenta a diferença de luminosidade entre azul e roxo.';
        }

        if (families.includes('amarelo') && families.includes('castanho')) {
            return 'Em luz fraca, amarelo/bege/castanho podem aproximar-se; usa contorno escuro ou fundo neutro.';
        }

        return 'É uma escolha mais acessível quando também há bom contraste, etiquetas e sinais visuais além da cor.';
    }

    _getColorMeaning(label) {
        const family = this._colorFamily(label);
        const meanings = {
            vermelho: 'energia, urgência, paixão ou alerta',
            verde: 'natureza, sucesso, segurança ou equilíbrio',
            azul: 'confiança, calma, tecnologia ou estabilidade',
            amarelo: 'atenção, otimismo, luz ou destaque',
            laranja: 'energia, criatividade ou proximidade',
            roxo: 'criatividade, mistério ou sofisticação',
            rosa: 'delicadeza, simpatia ou cuidado',
            castanho: 'conforto, terra, estabilidade ou naturalidade',
            neutro: 'simplicidade, equilíbrio e apoio visual'
        };

        return meanings[family] || 'uma sensação visual específica dependendo do contexto';
    }

    _describeLightness(color) {
        const { l } = this._rgbToHsl(color.r, color.g, color.b);
        if (l < 25) return 'escuro';
        if (l > 75) return 'claro';
        return 'médio';
    }

    _colorFamily(label) {
        if (/vermelh/.test(label)) return 'vermelho';
        if (/verde/.test(label)) return 'verde';
        if (/azul/.test(label)) return 'azul';
        if (/amarel/.test(label)) return 'amarelo';
        if (/laranja/.test(label)) return 'laranja';
        if (/roxo|violeta|lilas|lilás/.test(label)) return 'roxo';
        if (/rosa/.test(label)) return 'rosa';
        if (/castanh|bege/.test(label)) return 'castanho';
        if (/preto|branco|cinzent|cinza/.test(label)) return 'neutro';
        return label;
    }

    _readableList(items) {
        if (items.length <= 1) return items[0] || '';
        return `${items.slice(0, -1).join(', ')} e ${items[items.length - 1]}`;
    }

    _escapeRegExp(text) {
        return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    _getSuggestions(text) {
        const normalized = this._normalize(text);

        if (/(cor|roupa|combina|vermelho|verde|azul|contraste|branco|preto)/.test(normalized)) {
            return [
                'Que cor é #273154?',
                'Qual o contraste entre branco e azul-marinho?',
                'Vermelho e verde combinam para daltónicos?'
            ];
        }

        if (/(treino|quiz|mundo|xp|conquista)/.test(normalized)) {
            return [
                'Como melhorar no treino?',
                'Onde vejo o meu XP?',
                'Que mundos existem na Croma?'
            ];
        }

        return [
            'Como funciona o teste de Ishihara?',
            'Como melhorar o contraste?',
            'Que cores devo evitar juntas?'
        ];
    }

    _renderActiveConversation() {
        const conversation = this._getActiveConversation();
        const welcome = `Olá, ${this.userName}! Sou o Croma Bot. Posso ajudar-te com daltonismo, combinações de cores, treino e muito mais. O que precisas?`;
        this.chatbotView.renderMessages(conversation?.messages || [], welcome);
    }

    _renderSidebar() {
        this.chatbotView.renderConversationHistory(this.conversations, this.activeConversationId);
    }

    _createConversation({ persist = false } = {}) {
        const conversation = {
            id: `chat_${Date.now()}_${Math.random().toString(16).slice(2)}`,
            title: 'Nova conversa',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messages: []
        };

        this.conversations.unshift(conversation);
        this.activeConversationId = conversation.id;
        this._sortAndTrimConversations();

        if (persist) this._saveState();
        return conversation;
    }

    _getActiveConversation() {
        return this.conversations.find(item => item.id === this.activeConversationId) || null;
    }

    _sortAndTrimConversations() {
        this.conversations = this.conversations
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            .slice(0, MAX_CONVERSATIONS);

        if (!this.conversations.some(item => item.id === this.activeConversationId)) {
            this.activeConversationId = this.conversations[0]?.id || null;
        }
    }

    _loadState() {
        try {
            const raw = localStorage.getItem(this.storageKey);
            if (!raw) {
                this.conversations = [];
                this.activeConversationId = null;
                return;
            }

            const parsed = JSON.parse(raw);
            this.conversations = Array.isArray(parsed.conversations)
                ? parsed.conversations.map(item => ({
                    id: item.id,
                    title: item.title || 'Conversa',
                    createdAt: item.createdAt || new Date().toISOString(),
                    updatedAt: item.updatedAt || item.createdAt || new Date().toISOString(),
                    messages: Array.isArray(item.messages)
                        ? item.messages.map(message => {
                            const { imageBase64, ...safeMessage } = message || {};
                            return safeMessage;
                        })
                        : []
                }))
                : [];
            this.activeConversationId = parsed.activeConversationId || this.conversations[0]?.id || null;
            this._sortAndTrimConversations();
            this._saveState(); // remove imagens antigas que tenham ficado guardadas em versões anteriores
        } catch (error) {
            console.warn('Não foi possível carregar o histórico do chatbot:', error);
            this.conversations = [];
            this.activeConversationId = null;
        }
    }

    _saveState() {
        try {
            const safeConversations = this.conversations.map(conversation => ({
                ...conversation,
                messages: (conversation.messages || []).map(message => {
                    const { imageBase64, ...safeMessage } = message || {};
                    return safeMessage;
                })
            }));

            localStorage.setItem(this.storageKey, JSON.stringify({
                activeConversationId: this.activeConversationId,
                conversations: safeConversations
            }));
        } catch (error) {
            console.warn('Não foi possível guardar o histórico do chatbot:', error);
        }
    }

    _makeTitle(text) {
        const clean = String(text || 'Nova conversa').trim();
        return clean.length > 42 ? `${clean.slice(0, 42)}...` : clean;
    }

    _normalize(text) {
        return String(text || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    _delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export default ChatbotController;