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
        if (document.getElementById('croma-color-adaptation-style')) return;

        const style = document.createElement('style');
        style.id = 'croma-color-adaptation-style';
        style.textContent = `
            html[data-daltonism]:not([data-daltonism="normal"]) body {
                background-color: var(--cinza-bg, var(--color-bg-main)) !important;
                color: var(--texto, var(--color-neutral-dark)) !important;
            }

            html[data-daltonism]:not([data-daltonism="normal"]) .navbar,
            html[data-daltonism]:not([data-daltonism="normal"]) .header,
            html[data-daltonism]:not([data-daltonism="normal"]) .info-card,
            html[data-daltonism]:not([data-daltonism="normal"]) .table-container,
            html[data-daltonism]:not([data-daltonism="normal"]) .result-details,
            html[data-daltonism]:not([data-daltonism="normal"]) .modal-content,
            html[data-daltonism]:not([data-daltonism="normal"]) .card,
            html[data-daltonism]:not([data-daltonism="normal"]) section {
                background-color: var(--branco, var(--color-white)) !important;
                color: var(--texto, var(--color-neutral-dark)) !important;
            }

            html[data-daltonism]:not([data-daltonism="normal"]) h1,
            html[data-daltonism]:not([data-daltonism="normal"]) h2,
            html[data-daltonism]:not([data-daltonism="normal"]) h3,
            html[data-daltonism]:not([data-daltonism="normal"]) h4,
            html[data-daltonism]:not([data-daltonism="normal"]) p,
            html[data-daltonism]:not([data-daltonism="normal"]) label,
            html[data-daltonism]:not([data-daltonism="normal"]) th,
            html[data-daltonism]:not([data-daltonism="normal"]) td,
            html[data-daltonism]:not([data-daltonism="normal"]) a {
                color: var(--texto, var(--color-neutral-dark)) !important;
            }

            html[data-daltonism]:not([data-daltonism="normal"]) button:not(.key-btn):not(.opt-btn),
            html[data-daltonism]:not([data-daltonism="normal"]) .btn-primary,
            html[data-daltonism]:not([data-daltonism="normal"]) .btn-secondary,
            html[data-daltonism]:not([data-daltonism="normal"]) .btn-start,
            html[data-daltonism]:not([data-daltonism="normal"]) .btn-next,
            html[data-daltonism]:not([data-daltonism="normal"]) .btn-improve {
                background-color: var(--accent-btn, var(--color-accent-btn-gray)) !important;
                border-color: var(--accent-btn, var(--color-accent-btn-gray)) !important;
                color: var(--branco, var(--color-white)) !important;
            }

            html[data-daltonism]:not([data-daltonism="normal"]) .opt-btn.active,
            html[data-daltonism]:not([data-daltonism="normal"]) .key-btn.active {
                background-color: var(--accent-btn, var(--color-accent-btn-gray)) !important;
                border-color: var(--accent-btn, var(--color-accent-btn-gray)) !important;
                color: var(--branco, var(--color-white)) !important;
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