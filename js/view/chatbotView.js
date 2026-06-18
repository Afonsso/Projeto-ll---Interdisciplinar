class ChatbotView {
    constructor() {
        this.container = null;
        this._pendingImageBase64 = null;
        this._fileInput = null;
    }

    init(container) {
        this.container = container;
    }

    renderPage({ userName }) {
        if (!this.container) return;

        const name = this.escapeHtml(userName || 'utilizador');

        this.container.innerHTML = `
            <main class="chatbot-page">
                <section class="chatbot-shell">
                    <aside class="chatbot-sidebar">
                        <div class="chatbot-sidebar-header">
                            <h2>Histórico</h2>
                            <button type="button" class="chatbot-new-chat" id="chatbot-new-chat" data-new-conversation="true">Nova</button>
                        </div>
                        <div id="chatbot-recent-list" class="chatbot-recent-list">
                            <p class="chatbot-empty-state">Sem conversas recentes.</p>
                        </div>
                    </aside>

                    <section class="chatbot-panel">
                        <div class="chatbot-hero">
                            <div class="chatbot-hero-copy">
                                <span class="chatbot-eyebrow">Olá, ${name}!</span>
                                <h1>Chat Bot</h1>
                                <p>Ajuda para o seu cotidiano e mais...</p>
                            </div>
                            <div class="chatbot-hero-avatar" aria-hidden="true">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="80" height="80">
                                    <rect x="2" y="7" width="20" height="13" rx="3" stroke="currentColor" stroke-width="1.6"/>
                                    <circle cx="8.5" cy="13.5" r="2" fill="currentColor"/>
                                    <circle cx="15.5" cy="13.5" r="2" fill="currentColor"/>
                                    <rect x="6" y="17" width="12" height="1.5" rx="0.75" fill="currentColor"/>
                                    <path d="M9 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
                                </svg>
                            </div>
                        </div>

                        <div class="chatbot-messages" id="chatbot-messages" aria-live="polite"></div>

                        <div class="chatbot-suggestions" id="chatbot-suggestions">
                            <button type="button" class="chatbot-suggestion" data-suggested-topic="Como funciona o teste de Ishihara?">Como funciona o teste de Ishihara?</button>
                            <button type="button" class="chatbot-suggestion" data-suggested-topic="Esta gravata vermelha combina com camisa azul?">Esta gravata combina com camisa azul?</button>
                            <button type="button" class="chatbot-suggestion" data-suggested-topic="Como melhorar no treino?">Como melhorar no treino?</button>
                        </div>

                        <div class="chatbot-image-preview" id="chatbot-image-preview" style="display:none;">
                            <img id="chatbot-preview-img" src="" alt="Imagem anexada" />
                            <button type="button" class="chatbot-remove-image" id="chatbot-remove-image" aria-label="Remover imagem">✕</button>
                        </div>

                        <form class="chatbot-composer" id="chatbot-form">
                            <button type="button" class="chatbot-plus" id="chatbot-attach-btn" aria-label="Anexar imagem">+</button>
                            <input
                                id="chatbot-input"
                                type="text"
                                placeholder="Pergunte ao Chat Bot"
                                autocomplete="off"
                            />
                            <button type="submit" class="chatbot-send" id="chatbot-send-btn" aria-label="Enviar mensagem">
                                <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
                                    <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </form>

                        <input type="file" id="chatbot-file-input" accept="image/*" style="display:none;" />
                    </section>
                </section>
            </main>
        `;

        this._fileInput = document.getElementById('chatbot-file-input');
    }

    renderConversationHistory(conversations, activeConversationId) {
        const container = document.getElementById('chatbot-recent-list');
        if (!container) return;

        const items = Array.isArray(conversations) ? conversations : [];
        if (items.length === 0) {
            container.innerHTML = '<p class="chatbot-empty-state">Sem conversas recentes.</p>';
            return;
        }

        container.innerHTML = items.map(conversation => {
            const lastMessage = [...(conversation.messages || [])].reverse().find(message => message.text);
            const snippet = lastMessage?.text || 'Conversa vazia';
            const isActive = conversation.id === activeConversationId;

            return `
                <button type="button"
                    class="chatbot-recent-item ${isActive ? 'is-active' : ''}"
                    data-conversation-id="${this.escapeHtml(conversation.id)}">
                    <span class="chatbot-recent-title">${this.escapeHtml(conversation.title || 'Conversa')}</span>
                    <span class="chatbot-recent-snippet">${this.escapeHtml(this._truncate(snippet, 56))}</span>
                    <span class="chatbot-recent-date">${this.escapeHtml(this._formatDate(conversation.updatedAt))}</span>
                </button>
            `;
        }).join('');
    }

    renderRecentTopics(topics) {
        this.renderConversationHistory(
            (topics || []).map((topic, index) => ({
                id: `topic_${index}`,
                title: topic,
                updatedAt: new Date().toISOString(),
                messages: [{ text: topic }]
            })),
            null
        );
    }

    renderSuggestedTopics(topics) {
        const container = document.getElementById('chatbot-suggestions');
        if (!container || !topics || topics.length === 0) return;

        container.innerHTML = topics
            .map(t => `<button type="button" class="chatbot-suggestion" data-suggested-topic="${this.escapeHtml(t)}">${this.escapeHtml(t)}</button>`)
            .join('');
    }

    renderMessages(messages, emptyWelcomeText) {
        const container = document.getElementById('chatbot-messages');
        if (!container) return;

        container.innerHTML = '';

        const items = Array.isArray(messages) ? messages : [];
        if (items.length === 0 && emptyWelcomeText) {
            this.addMessage('bot', emptyWelcomeText);
            return;
        }

        items.forEach(message => {
            const role = message.role === 'assistant' ? 'bot' : 'user';
            this.addMessage(role, message.text, message.imageBase64);
        });
    }

    addMessage(role, text, imageBase64) {
        const container = document.getElementById('chatbot-messages');
        if (!container) return;

        const bubble = document.createElement('div');
        bubble.className = `chatbot-message chatbot-message-${role}`;

        if (imageBase64 && role === 'user') {
            const img = document.createElement('img');
            img.src = imageBase64;
            img.className = 'chatbot-message-image';
            img.alt = 'Imagem enviada';
            bubble.appendChild(img);
        }

        if (text) {
            const textEl = document.createElement('div');
            textEl.className = 'chatbot-message-text';
            textEl.innerHTML = this._renderMarkdown(text);
            bubble.appendChild(textEl);
        }

        container.appendChild(bubble);
        container.scrollTop = container.scrollHeight;
    }

    showTyping() {
        const container = document.getElementById('chatbot-messages');
        if (!container || document.getElementById('chatbot-typing')) return;

        const typing = document.createElement('div');
        typing.id = 'chatbot-typing';
        typing.className = 'chatbot-message chatbot-message-bot chatbot-typing';
        typing.innerHTML = '<span></span><span></span><span></span>';
        container.appendChild(typing);
        container.scrollTop = container.scrollHeight;
    }

    hideTyping() {
        const el = document.getElementById('chatbot-typing');
        if (el) el.remove();
    }

    setSendingState(isSending) {
        const input = document.getElementById('chatbot-input');
        const sendBtn = document.getElementById('chatbot-send-btn');
        const attachBtn = document.getElementById('chatbot-attach-btn');

        [input, sendBtn, attachBtn].forEach(el => {
            if (el) el.disabled = Boolean(isSending);
        });
    }

    setInputValue(value) {
        const input = document.getElementById('chatbot-input');
        if (input) {
            input.value = value;
            input.focus();
        }
    }

    getInputValue() {
        const input = document.getElementById('chatbot-input');
        return input ? input.value : '';
    }

    clearInput() {
        this.setInputValue('');
    }

    getPendingImage() {
        return this._pendingImageBase64;
    }

    removeAttachedImage() {
        this._pendingImageBase64 = null;
        const preview = document.getElementById('chatbot-image-preview');
        const previewImg = document.getElementById('chatbot-preview-img');
        if (preview) preview.style.display = 'none';
        if (previewImg) previewImg.src = '';
        if (this._fileInput) this._fileInput.value = '';
    }

    bindHandlers({ onSubmit, onSuggestion, onSelectConversation, onNewConversation }) {
        const form = document.getElementById('chatbot-form');
        const attachBtn = document.getElementById('chatbot-attach-btn');
        const fileInput = document.getElementById('chatbot-file-input');
        const removeBtn = document.getElementById('chatbot-remove-image');
        const input = document.getElementById('chatbot-input');

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                onSubmit?.(this.getInputValue(), this._pendingImageBase64);
            });
        }

        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    onSubmit?.(this.getInputValue(), this._pendingImageBase64);
                }
            });
        }

        if (attachBtn && fileInput) {
            attachBtn.addEventListener('click', () => fileInput.click());
        }

        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                if (!file.type.startsWith('image/')) {
                    this.addMessage('bot', 'Só consigo anexar imagens neste chat.');
                    this.removeAttachedImage();
                    return;
                }

                const reader = new FileReader();
                reader.onload = () => {
                    this._pendingImageBase64 = reader.result;
                    const previewEl = document.getElementById('chatbot-image-preview');
                    const previewImg = document.getElementById('chatbot-preview-img');
                    if (previewEl && previewImg) {
                        previewImg.src = reader.result;
                        previewEl.style.display = 'flex';
                    }
                };
                reader.readAsDataURL(file);
            });
        }

        if (removeBtn) {
            removeBtn.addEventListener('click', () => this.removeAttachedImage());
        }

        if (this.container) {
            this.container.addEventListener('click', (e) => {
                const newConversationBtn = e.target.closest('[data-new-conversation]');
                if (newConversationBtn) {
                    onNewConversation?.();
                    return;
                }

                const conversationBtn = e.target.closest('[data-conversation-id]');
                if (conversationBtn) {
                    onSelectConversation?.(conversationBtn.getAttribute('data-conversation-id'));
                    return;
                }

                const suggestedBtn = e.target.closest('[data-suggested-topic]');
                if (suggestedBtn) {
                    onSuggestion?.(suggestedBtn.getAttribute('data-suggested-topic') || '');
                }
            });
        }
    }

    _renderMarkdown(text) {
        const escaped = String(text || '')
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;');

        return escaped
            .split('\n')
            .map(line => {
                line = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
                if (/^[-*]\s/.test(line)) {
                    return `<li>${line.slice(2)}</li>`;
                }
                if (line.trim() === '') return '<br>';
                return `<p>${line}</p>`;
            })
            .join('');
    }

    _truncate(text, maxLength) {
        const value = String(text || '');
        return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;
    }

    _formatDate(value) {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '';

        return date.toLocaleDateString('pt-PT', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    escapeHtml(text) {
        return String(text || '')
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#39;');
    }
}

export default ChatbotView;
