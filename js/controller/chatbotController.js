import ChatbotView from '../view/chatbotView.js';

const SYSTEM_PROMPT = `És o Croma Bot, o assistente inteligente oficial da aplicação "Croma" — uma plataforma portuguesa que apoia pessoas daltônicas (com deuteranopia, protanopia, tritanopia ou acromatopsia) nas suas tarefas diárias.

As tuas diretrizes:
1. Tom: Amigável, empático, científico mas prático e acessível. Fala sempre em português europeu.
2. Foco:
   - Identificar e descrever cores com precisão (ex: Verde-oliva, Vermelho-carmesim, Azul-marinho).
   - Alertar sobre pares de cores que os daltônicos confundem frequentemente.
   - Sugerir combinações harmoniosas de roupas e objetos.
   - Explicar resultados do teste de Ishihara de forma empática e didática.
   - Fornecer dicas de acessibilidade de cores e contraste.
   - Ajudar com dúvidas sobre as funcionalidades da aplicação Croma (treino, perfil, quizzes, teste Ishihara).
3. Formato: Respostas concisas, claras e úteis. Usa listas quando fizer sentido.

Se o utilizador perguntar sobre a aplicação Croma especificamente: tem teste de Ishihara, treino com quizzes em vários mundos (trânsito, roupa, comida, desporto), perfil com XP e conquistas, e este assistente de chat.`;

class ChatbotController {
    constructor(authService, chatbotView) {
        this.authService = authService;
        this.chatbotView = chatbotView || new ChatbotView();
        this.history = []; // {role: 'user'|'assistant', content: string}
        this.recentTopics = [];
        this.isSending = false;
    }

    init() {
        const container = document.getElementById('chatbot-root');
        if (!container) return;

        const currentUser = this.authService.getCurrentUser?.();
        const userName = currentUser?.name || 'utilizador';

        this.chatbotView.init(container);
        this.chatbotView.renderPage({ userName });

        // Welcome message (não vai ao histórico de API)
        this.chatbotView.addMessage('bot', `Olá, ${userName}! Sou o Croma Bot. Posso ajudar-te com daltonismo, combinações de cores, treino e muito mais. O que precisas?`);

        this.bindEvents();
    }

    bindEvents() {
        this.chatbotView.bindHandlers({
            onSubmit: (message, image) => this.handleUserMessage(message, image),
            onSuggestion: (topic) => this.handleSuggestion(topic)
        });
    }

    handleSuggestion(topic) {
        this.chatbotView.setInputValue(topic);
        this.handleUserMessage(topic);
    }

    async handleUserMessage(message, imageBase64) {
        const trimmed = String(message || '').trim();
        if ((!trimmed && !imageBase64) || this.isSending) return;

        // Show user message
        this.chatbotView.addMessage('user', trimmed, imageBase64);
        this.chatbotView.clearInput();
        this.chatbotView.removeAttachedImage();

        // Track recent topics
        if (trimmed) {
            this.recentTopics = [trimmed, ...this.recentTopics]
                .filter((item, i, arr) => arr.indexOf(item) === i)
                .slice(0, 5);
            this.chatbotView.renderRecentTopics(this.recentTopics);
        }

        this.isSending = true;
        this.chatbotView.showTyping();

        // Build message for API
        const userContent = imageBase64
            ? [
                { type: 'image', source: { type: 'base64', media_type: this._getMimeType(imageBase64), data: imageBase64.split(',')[1] } },
                { type: 'text', text: trimmed || 'Descreve esta imagem do ponto de vista do daltonismo.' }
              ]
            : trimmed;

        // Push to history
        this.history.push({ role: 'user', content: userContent });

        try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': '',  // injected by claude.ai proxy
                    'anthropic-version': '2023-06-01',
                    'anthropic-dangerous-direct-browser-access': 'true'
                },
                body: JSON.stringify({
                    model: 'claude-sonnet-4-6',
                    max_tokens: 1024,
                    system: SYSTEM_PROMPT,
                    messages: this.history
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            const replyText = data.content?.[0]?.text || 'Desculpa, não consegui obter uma resposta.';

            this.history.push({ role: 'assistant', content: replyText });

            this.chatbotView.hideTyping();
            this.chatbotView.addMessage('bot', replyText);

        } catch (err) {
            console.error('Chatbot API error:', err);
            this.chatbotView.hideTyping();

            // Fallback respostas contextuais
            const fallback = this._getFallbackResponse(trimmed);
            this.history.push({ role: 'assistant', content: fallback });
            this.chatbotView.addMessage('bot', fallback);
        } finally {
            this.isSending = false;
        }
    }

    _getMimeType(base64) {
        const match = base64.match(/^data:([^;]+);/);
        return (match && match[1]) || 'image/jpeg';
    }

    _getFallbackResponse(text) {
        const t = String(text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (/(ishihara|teste|daltonismo)/.test(t))
            return 'O teste de Ishihara identifica padrões de daltonismo através de placas com números. Na aplicação Croma podes realizá-lo na secção de Diagnóstico e ver os resultados detalhados no final.';
        if (/(cor|vermelho|verde|azul|roxo|roupa|combina)/.test(t))
            return 'Para daltônicos deuteranômalos, o vermelho e o verde podem parecer muito semelhantes. Uma boa dica: usa contrastes de luminosidade em vez de depender apenas da cor — por exemplo, azul-marinho com bege resulta muito bem!';
        if (/(treino|quiz|mundo|jogo)/.test(t))
            return 'A área de Treino da Croma tem mundos temáticos (Trânsito, Roupa, Comida, Desporto) com quizzes progressivos. Completa desafios para ganhar XP e desbloquear conquistas!';
        if (/(perfil|xp|progresso|conquista)/.test(t))
            return 'No teu Perfil podes ver o XP acumulado, as estrelas ganhas em cada mundo e as conquistas desbloqueadas. O progresso é guardado automaticamente.';
        return 'Não consegui ligar ao servidor agora. Tenta novamente em breve! Entretanto, posso ajudar com dúvidas sobre daltonismo, treino e a aplicação Croma.';
    }
}

export default ChatbotController;