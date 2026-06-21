 (function () {
    const API_URL = 'http://localhost:3000';
    const STORAGE_KEY = 'croma_color_blindness_type';

    const VARIABLE_NAMES = [
        '--color-primary-navy',
        '--color-primary-dark',
        '--color-primary-dark-variant',
        '--color-neutral-dark-pure',
        '--color-neutral-dark',
        '--color-neutral-dark-soft',
        '--color-neutral-muted-dark',
        '--color-neutral-muted',
        '--color-neutral-muted-light',
        '--color-neutral-gray-mid',
        '--color-accent-btn-gray',
        '--color-accent-btn-hover-gray',
        '--color-btn-gray-primary',
        '--color-btn-gray-primary-hover',
        '--color-border-gray-secondary',
        '--color-border-gray',
        '--color-bg-main',
        '--color-bg-card-alt',
        '--color-bg-blue-light',
        '--color-bg-white-pure',
        '--color-white',
        '--color-success',
        '--color-success-bright',
        '--color-warning',
        '--color-warning-bright',
        '--color-error',
        '--color-error-bright',
        '--color-error-dark',
        '--bg-color',
        '--text-main',
        '--text-muted',
        '--accent-btn',
        '--accent-hover',
        '--azul',
        '--cinza-bg',
        '--branco',
        '--texto',
        '--texto-suave'
    ];

    const PALETTES = {
        normal: {
            label: 'Paleta padrão',
            variables: {}
        },
        possible: {
            label: 'Paleta acessivel de alto contraste',
            variables: {
                '--color-primary-navy': '#1f2937',
                '--color-primary-dark': '#111827',
                '--color-primary-dark-variant': '#273154',
                '--color-accent-btn-gray': '#4b5563',
                '--color-accent-btn-hover-gray': '#374151',
                '--color-btn-gray-primary': '#4b5563',
                '--color-btn-gray-primary-hover': '#374151',
                '--color-bg-main': '#f3f4f6',
                '--color-bg-card-alt': '#ffffff',
                '--color-bg-blue-light': '#f8fafc',
                '--color-success': '#0072b2',
                '--color-success-bright': '#0072b2',
                '--color-warning': '#e69f00',
                '--color-warning-bright': '#e69f00',
                '--color-error': '#cc79a7',
                '--color-error-bright': '#cc79a7',
                '--color-error-dark': '#cc79a7',
                '--bg-color': '#f3f4f6',
                '--text-main': '#111827',
                '--text-muted': '#4b5563',
                '--accent-btn': '#4b5563',
                '--accent-hover': '#374151',
                '--azul': '#111827',
                '--cinza-bg': '#f3f4f6',
                '--branco': '#ffffff',
                '--texto': '#111827',
                '--texto-suave': '#4b5563'
            }
        },
        protanopia: {
            label: 'Paleta adaptada para Protanopia',
            variables: {
                '--color-primary-navy': '#003f5c',
                '--color-primary-dark': '#003f5c',
                '--color-primary-dark-variant': '#1f4e79',
                '--color-accent-btn-gray': '#2f4858',
                '--color-accent-btn-hover-gray': '#1f313d',
                '--color-btn-gray-primary': '#2f4858',
                '--color-btn-gray-primary-hover': '#1f313d',
                '--color-bg-main': '#f6f8fa',
                '--color-bg-card-alt': '#ffffff',
                '--color-bg-blue-light': '#eef6fb',
                '--color-success': '#0072b2',
                '--color-success-bright': '#0072b2',
                '--color-warning': '#e69f00',
                '--color-warning-bright': '#e69f00',
                '--color-error': '#8b2c8f',
                '--color-error-bright': '#8b2c8f',
                '--color-error-dark': '#8b2c8f',
                '--bg-color': '#f6f8fa',
                '--text-main': '#102a43',
                '--text-muted': '#486581',
                '--accent-btn': '#2f4858',
                '--accent-hover': '#1f313d',
                '--azul': '#003f5c',
                '--cinza-bg': '#f6f8fa',
                '--branco': '#ffffff',
                '--texto': '#102a43',
                '--texto-suave': '#486581'
            }
        },
        deuteranopia: {
            label: 'Paleta adaptada para Deuteranopia',
            variables: {
                '--color-primary-navy': '#332288',
                '--color-primary-dark': '#332288',
                '--color-primary-dark-variant': '#2f3a8f',
                '--color-accent-btn-gray': '#4b5563',
                '--color-accent-btn-hover-gray': '#374151',
                '--color-btn-gray-primary': '#4b5563',
                '--color-btn-gray-primary-hover': '#374151',
                '--color-bg-main': '#f7f7fb',
                '--color-bg-card-alt': '#ffffff',
                '--color-bg-blue-light': '#f0f1fb',
                '--color-success': '#0072b2',
                '--color-success-bright': '#0072b2',
                '--color-warning': '#d55e00',
                '--color-warning-bright': '#d55e00',
                '--color-error': '#cc79a7',
                '--color-error-bright': '#cc79a7',
                '--color-error-dark': '#cc79a7',
                '--bg-color': '#f7f7fb',
                '--text-main': '#111827',
                '--text-muted': '#4b5563',
                '--accent-btn': '#4b5563',
                '--accent-hover': '#374151',
                '--azul': '#332288',
                '--cinza-bg': '#f7f7fb',
                '--branco': '#ffffff',
                '--texto': '#111827',
                '--texto-suave': '#4b5563'
            }
        },
        tritanopia: {
            label: 'Paleta adaptada para Tritanopia',
            variables: {
                '--color-primary-navy': '#2b2d42',
                '--color-primary-dark': '#2b2d42',
                '--color-primary-dark-variant': '#3d405b',
                '--color-accent-btn-gray': '#4a4e69',
                '--color-accent-btn-hover-gray': '#22223b',
                '--color-btn-gray-primary': '#4a4e69',
                '--color-btn-gray-primary-hover': '#22223b',
                '--color-bg-main': '#f8f7f4',
                '--color-bg-card-alt': '#ffffff',
                '--color-bg-blue-light': '#f6f5f2',
                '--color-success': '#009e73',
                '--color-success-bright': '#009e73',
                '--color-warning': '#d55e00',
                '--color-warning-bright': '#d55e00',
                '--color-error': '#ca3e72',
                '--color-error-bright': '#ca3e72',
                '--color-error-dark': '#ca3e72',
                '--bg-color': '#f8f7f4',
                '--text-main': '#22223b',
                '--text-muted': '#4a4e69',
                '--accent-btn': '#4a4e69',
                '--accent-hover': '#22223b',
                '--azul': '#2b2d42',
                '--cinza-bg': '#f8f7f4',
                '--branco': '#ffffff',
                '--texto': '#22223b',
                '--texto-suave': '#4a4e69'
            }
        },
        mixed: {
            label: 'Paleta neutra para daltonismo misto',
            variables: {
                '--color-primary-navy': '#111827',
                '--color-primary-dark': '#111827',
                '--color-primary-dark-variant': '#1f2937',
                '--color-accent-btn-gray': '#374151',
                '--color-accent-btn-hover-gray': '#111827',
                '--color-btn-gray-primary': '#374151',
                '--color-btn-gray-primary-hover': '#111827',
                '--color-bg-main': '#f3f4f6',
                '--color-bg-card-alt': '#ffffff',
                '--color-bg-blue-light': '#f9fafb',
                '--color-success': '#0072b2',
                '--color-success-bright': '#0072b2',
                '--color-warning': '#e69f00',
                '--color-warning-bright': '#e69f00',
                '--color-error': '#000000',
                '--color-error-bright': '#000000',
                '--color-error-dark': '#000000',
                '--bg-color': '#f3f4f6',
                '--text-main': '#111827',
                '--text-muted': '#374151',
                '--accent-btn': '#374151',
                '--accent-hover': '#111827',
                '--azul': '#111827',
                '--cinza-bg': '#f3f4f6',
                '--branco': '#ffffff',
                '--texto': '#111827',
                '--texto-suave': '#374151'
            }
        }
    };

    function normalizeType(value) {
        const raw = String(value || '').trim().toLowerCase();
        if (!raw) return 'normal';
        if (raw.includes('protan')) return 'protanopia';
        if (raw.includes('deuter')) return 'deuteranopia';
        if (raw.includes('tritan')) return 'tritanopia';
        if (raw.includes('mist') || raw.includes('mixed')) return 'mixed';
        if (raw.includes('ligeir') || raw.includes('dificuldade') || raw.includes('dificuld') || raw === 'possible') return 'possible';
        if (raw.includes('normal') || raw.includes('tricromata')) return 'normal';
        return PALETTES[raw] ? raw : 'possible';
    }

    function normalizeDiagnosisType(diagnosis) {
        return normalizeType(diagnosis);
    }


    function ensureGlobalAdaptationStyles() {
        const existing = document.getElementById('croma-color-adaptation-style');
        if (existing) existing.remove();

        const style = document.createElement('style');
        style.id = 'croma-color-adaptation-style';
        style.textContent = `
            /* Fundo e texto base da página */
            html[data-daltonism]:not([data-daltonism="normal"]) body {
                background-color: var(--cinza-bg, var(--color-bg-main)) !important;
                color: var(--texto, var(--color-neutral-dark)) !important;
            }

            /* Containers de fundo CLARO conhecidos: usar a cor de texto escura da
               paleta. NOTA: "section" e ".card" foram retirados desta lista de
               propósito — são seletores genéricos usados em vários sítios da app
               com fundos diferentes (ex.: .chatbot-panel é uma <section> de fundo
               escuro; o .card do Bootstrap em About.html tem fundo claro). Aplicar
               uma regra cega a esses seletores cria fundos brancos indevidos ou
               texto invisível. Em vez disso, cada container é tratado de forma
               explícita mais abaixo. */
            html[data-daltonism]:not([data-daltonism="normal"]) .navbar,
            html[data-daltonism]:not([data-daltonism="normal"]) .info-card,
            html[data-daltonism]:not([data-daltonism="normal"]) .table-container,
            html[data-daltonism]:not([data-daltonism="normal"]) .result-details,
            html[data-daltonism]:not([data-daltonism="normal"]) .modal-content,
            html[data-daltonism]:not([data-daltonism="normal"]) .modal,
            html[data-daltonism]:not([data-daltonism="normal"]) .modal-card,
            html[data-daltonism]:not([data-daltonism="normal"]) .tests-white-panel,
            html[data-daltonism]:not([data-daltonism="normal"]) .profile-top-header,
            html[data-daltonism]:not([data-daltonism="normal"]) .points-card,
            html[data-daltonism]:not([data-daltonism="normal"]) .info-status-card,
            html[data-daltonism]:not([data-daltonism="normal"]) .card,
            html[data-daltonism]:not([data-daltonism="normal"]) .form-grid,
            html[data-daltonism]:not([data-daltonism="normal"]) .field {
                background-color: var(--branco, var(--color-white)) !important;
                color: var(--texto, var(--color-neutral-dark)) !important;
            }

            /* O texto destes containers claros adapta-se à paleta, mas sem tocar
               em elementos que já têm o seu próprio fundo fixo (letras de opção
               do quiz, teclados do teste de Ishihara), para não criar texto
               escuro sobre fundo escuro dentro de um container claro. */
            html[data-daltonism]:not([data-daltonism="normal"]) .navbar *:not(.quiz-option-letter):not(.key-btn):not(.key-btn.active):not(.opt-btn):not(.opt-btn.active),
            html[data-daltonism]:not([data-daltonism="normal"]) .info-card *,
            html[data-daltonism]:not([data-daltonism="normal"]) .table-container *,
            html[data-daltonism]:not([data-daltonism="normal"]) .result-details *,
            html[data-daltonism]:not([data-daltonism="normal"]) .modal-content *:not(.quiz-option-letter):not(.key-btn):not(.key-btn.active):not(.opt-btn):not(.opt-btn.active),
            html[data-daltonism]:not([data-daltonism="normal"]) .modal *:not(.quiz-option-letter):not(.key-btn):not(.key-btn.active):not(.opt-btn):not(.opt-btn.active),
            html[data-daltonism]:not([data-daltonism="normal"]) .modal-card *,
            html[data-daltonism]:not([data-daltonism="normal"]) .tests-white-panel *,
            html[data-daltonism]:not([data-daltonism="normal"]) .profile-top-header *,
            html[data-daltonism]:not([data-daltonism="normal"]) .points-card *,
            html[data-daltonism]:not([data-daltonism="normal"]) .info-status-card *,
            html[data-daltonism]:not([data-daltonism="normal"]) .card *,
            html[data-daltonism]:not([data-daltonism="normal"]) .form-grid *,
            html[data-daltonism]:not([data-daltonism="normal"]) .field * {
                color: var(--texto, var(--color-neutral-dark));
            }

            /* O círculo de letra (A/B/C/D) das opções do quiz tem fundo fixo
               escuro por design — o texto dentro dele tem de continuar branco
               mesmo dentro de um modal/container "claro". */
            html[data-daltonism]:not([data-daltonism="normal"]) .quiz-option-letter {
                background-color: var(--accent-btn, var(--color-accent-btn-gray)) !important;
                color: var(--branco, var(--color-white)) !important;
            }

            /* Containers de fundo ESCURO conhecidos: o texto tem de continuar claro,
               mesmo com uma paleta adaptada ativa. Sem isto, títulos e parágrafos
               dentro destes cartões ficam ilegíveis (texto escuro sobre fundo escuro). */
            html[data-daltonism]:not([data-daltonism="normal"]) .home-hero,
            html[data-daltonism]:not([data-daltonism="normal"]) #eye-progress,
            html[data-daltonism]:not([data-daltonism="normal"]) .smart-training-item,
            html[data-daltonism]:not([data-daltonism="normal"]) .chatbot-home-card,
            html[data-daltonism]:not([data-daltonism="normal"]) .chatbot-panel,
            html[data-daltonism]:not([data-daltonism="normal"]) .recent-item-card,
            html[data-daltonism]:not([data-daltonism="normal"]) .test-item-card,
            html[data-daltonism]:not([data-daltonism="normal"]) .footer,
            html[data-daltonism]:not([data-daltonism="normal"]) .modal-level-badge,
            html[data-daltonism]:not([data-daltonism="normal"]) .navbar .badge {
                color: var(--branco, var(--color-white)) !important;
            }

            html[data-daltonism]:not([data-daltonism="normal"]) .home-hero *,
            html[data-daltonism]:not([data-daltonism="normal"]) #eye-progress *:not(canvas),
            html[data-daltonism]:not([data-daltonism="normal"]) .smart-training-item *,
            html[data-daltonism]:not([data-daltonism="normal"]) .chatbot-home-card *,
            html[data-daltonism]:not([data-daltonism="normal"]) .chatbot-panel *:not(.chatbot-message-bot):not(.chatbot-message-bot *),
            html[data-daltonism]:not([data-daltonism="normal"]) .recent-item-card *,
            html[data-daltonism]:not([data-daltonism="normal"]) .test-item-card *,
            html[data-daltonism]:not([data-daltonism="normal"]) .footer *,
            html[data-daltonism]:not([data-daltonism="normal"]) .navbar .badge * {
                color: var(--branco, var(--color-white)) !important;
            }

            /* A bolha de mensagem do bot tem fundo quase-branco fixo por
               design — o texto dentro dela tem de continuar escuro mesmo
               dentro do painel escuro do chatbot (.chatbot-panel). */
            html[data-daltonism]:not([data-daltonism="normal"]) .chatbot-message-bot,
            html[data-daltonism]:not([data-daltonism="normal"]) .chatbot-message-bot * {
                color: var(--texto, var(--color-neutral-dark)) !important;
            }

            /* Barra lateral do histórico do chatbot: fundo neutro claro fixo,
               com itens semi-transparentes. O texto tem de seguir a cor de
               texto escura da paleta, e o botão "Nova" mantém-se com a cor de
               acento e texto branco para continuar legível. */
            html[data-daltonism]:not([data-daltonism="normal"]) .chatbot-sidebar {
                color: var(--texto, var(--color-neutral-dark)) !important;
            }

            html[data-daltonism]:not([data-daltonism="normal"]) .chatbot-sidebar-header h2,
            html[data-daltonism]:not([data-daltonism="normal"]) .chatbot-recent-title,
            html[data-daltonism]:not([data-daltonism="normal"]) .chatbot-recent-snippet,
            html[data-daltonism]:not([data-daltonism="normal"]) .chatbot-recent-date {
                color: var(--texto, var(--color-neutral-dark)) !important;
            }

            html[data-daltonism]:not([data-daltonism="normal"]) .chatbot-new-chat {
                background-color: var(--accent-btn, var(--color-accent-btn-gray)) !important;
                color: var(--branco, var(--color-white)) !important;
            }

            /* Botão "Log In" do rodapé global: fundo branco fixo com texto
               cinza-claro fixo, ilegível com qualquer fundo. Passa a usar a
               cor de texto escura da paleta sobre o seu fundo branco fixo. */
            html[data-daltonism]:not([data-daltonism="normal"]) .text-2 {
                color: var(--texto, var(--color-neutral-dark)) !important;
            }

            /* Botões genéricos da aplicação adaptam-se à paleta. Excluem-se
               explicitamente os botões de quizzes/jogos, cujo feedback de
               certo/errado (verde/vermelho) não deve ser substituído pela
               cor de acento da paleta de daltonismo, e os itens de histórico
               do chatbot, que têm o seu próprio fundo semi-transparente. */
            html[data-daltonism]:not([data-daltonism="normal"]) button:not(.key-btn):not(.opt-btn):not(.quiz-option-btn):not(.color-btn):not(.chatbot-new-chat):not(.chatbot-recent-item),
            html[data-daltonism]:not([data-daltonism="normal"]) .btn-primary,
            html[data-daltonism]:not([data-daltonism="normal"]) .btn-secondary,
            html[data-daltonism]:not([data-daltonism="normal"]) .btn-start,
            html[data-daltonism]:not([data-daltonism="normal"]) .btn-next,
            html[data-daltonism]:not([data-daltonism="normal"]) .btn-improve,
            html[data-daltonism]:not([data-daltonism="normal"]) .btn-jogar,
            html[data-daltonism]:not([data-daltonism="normal"]) .button-principal,
            html[data-daltonism]:not([data-daltonism="normal"]) .game-submit-btn {
                background-color: var(--accent-btn, var(--color-accent-btn-gray)) !important;
                border-color: var(--accent-btn, var(--color-accent-btn-gray)) !important;
                color: var(--branco, var(--color-white)) !important;
            }

            /* Item de histórico do chatbot: mantém o seu fundo semi-transparente
               próprio (não escurece como um botão genérico), e o texto segue a
               cor de texto escura da paleta para continuar legível. */
            html[data-daltonism]:not([data-daltonism="normal"]) .chatbot-recent-item {
                background: rgba(255, 255, 255, 0.38) !important;
                color: var(--texto, var(--color-neutral-dark)) !important;
            }

            html[data-daltonism]:not([data-daltonism="normal"]) .chatbot-recent-item:hover,
            html[data-daltonism]:not([data-daltonism="normal"]) .chatbot-recent-item:focus-visible,
            html[data-daltonism]:not([data-daltonism="normal"]) .chatbot-recent-item.is-active {
                background: rgba(255, 255, 255, 0.72) !important;
                color: var(--texto, var(--color-neutral-dark)) !important;
            }

            html[data-daltonism]:not([data-daltonism="normal"]) .opt-btn.active,
            html[data-daltonism]:not([data-daltonism="normal"]) .key-btn.active {
                background-color: var(--accent-btn, var(--color-accent-btn-gray)) !important;
                border-color: var(--accent-btn, var(--color-accent-btn-gray)) !important;
                color: var(--branco, var(--color-white)) !important;
            }

            /* Feedback de certo/errado nos quizzes e jogos: garante que estes
               indicadores se mantêm visíveis e legíveis com qualquer paleta. */
            html[data-daltonism]:not([data-daltonism="normal"]) .quiz-option-btn.correct,
            html[data-daltonism]:not([data-daltonism="normal"]) .sort-bin.correct,
            html[data-daltonism]:not([data-daltonism="normal"]) .drop-zone.filled,
            html[data-daltonism]:not([data-daltonism="normal"]) .matching-card.matched,
            html[data-daltonism]:not([data-daltonism="normal"]) .memory-card.matched {
                background-color: var(--color-success, #dcfce7) !important;
                border-color: var(--color-success-bright, #16a34a) !important;
                color: var(--texto, var(--color-neutral-dark)) !important;
            }

            html[data-daltonism]:not([data-daltonism="normal"]) .quiz-option-btn.incorrect,
            html[data-daltonism]:not([data-daltonism="normal"]) .sort-bin.incorrect {
                background-color: var(--color-error, #fee2e2) !important;
                border-color: var(--color-error-bright, #dc2626) !important;
                color: var(--texto, var(--color-neutral-dark)) !important;
            }

            html[data-daltonism]:not([data-daltonism="normal"]) .quiz-option-btn.selected {
                border-color: var(--accent-btn, var(--color-accent-btn-gray)) !important;
                background-color: var(--color-bg-blue-light, #e0ebff) !important;
                color: var(--texto, var(--color-neutral-dark)) !important;
            }
        `;
        document.head.appendChild(style);
    }

    function clearInlinePalette() {
        VARIABLE_NAMES.forEach((name) => document.documentElement.style.removeProperty(name));
    }

    function apply(type, options = {}) {
        const normalizedType = normalizeType(type);
        const palette = PALETTES[normalizedType] || PALETTES.possible;
        const persist = options.persist !== false;

        ensureGlobalAdaptationStyles();
        clearInlinePalette();
        Object.entries(palette.variables).forEach(([name, value]) => {
            document.documentElement.style.setProperty(name, value);
        });

        document.documentElement.dataset.daltonism = normalizedType;
        document.documentElement.dataset.daltonismPalette = palette.label;

        if (persist) {
            localStorage.setItem(STORAGE_KEY, normalizedType);
        }

        return { type: normalizedType, label: palette.label };
    }

    function reset(options = {}) {
        const persist = options.persist !== false;
        ensureGlobalAdaptationStyles();
        clearInlinePalette();
        document.documentElement.dataset.daltonism = 'normal';
        document.documentElement.dataset.daltonismPalette = PALETTES.normal.label;

        if (persist) {
            localStorage.setItem(STORAGE_KEY, 'normal');
        }

        return { type: 'normal', label: PALETTES.normal.label };
    }

    function applyFromDiagnosis(metricsOrDiagnosis, options = {}) {
        const diagnosis = typeof metricsOrDiagnosis === 'string'
            ? metricsOrDiagnosis
            : metricsOrDiagnosis?.type || metricsOrDiagnosis?.diagnosis;
        const type = normalizeDiagnosisType(diagnosis);
        return type === 'normal' ? reset(options) : apply(type, options);
    }

    async function getCurrentUser() {
        const sessionId = localStorage.getItem('croma_session_id');
        if (!sessionId) return null;

        try {
            const sessionResponse = await fetch(`${API_URL}/sessions/${encodeURIComponent(sessionId)}`);
            if (!sessionResponse.ok) return null;

            const session = await sessionResponse.json();
            if (!session?.userId) return null;
            if (session.expiresAt && new Date(session.expiresAt) < new Date()) return null;

            const userResponse = await fetch(`${API_URL}/users/${encodeURIComponent(session.userId)}`);
            if (!userResponse.ok) return null;

            return await userResponse.json();
        } catch (error) {
            console.warn('Nao foi possivel obter o utilizador para adaptar cores:', error);
            return null;
        }
    }

    async function applyFromCurrentUser() {
        const user = await getCurrentUser();
        const savedType = user?.colorBlindnessType || localStorage.getItem(STORAGE_KEY);

        if (!savedType) {
            return null;
        }

        return apply(savedType, { persist: true });
    }

    window.CromaColorAdapter = {
        apply,
        reset,
        applyFromDiagnosis,
        applyFromCurrentUser,
        normalizeType,
        normalizeDiagnosisType,
        palettes: PALETTES
    };

    // Aplicar a preferencia guardada assim que o ficheiro e carregado.
    const localType = localStorage.getItem(STORAGE_KEY);
    if (localType) {
        apply(localType, { persist: false });
    }

    // Depois do DOM estar pronto, tenta substituir pelo valor persistido no utilizador.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => applyFromCurrentUser());
    } else {
        applyFromCurrentUser();
    }
})();