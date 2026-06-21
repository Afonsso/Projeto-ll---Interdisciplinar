/**
 * navbarMobile.js
 * Transforma a navbar global (.navbar > .menu-3) num menu hambúrguer que
 * abre como um modal/drawer em ecrãs de telemóvel, sem precisar de alterar
 * o HTML de cada página individualmente. O botão é injetado via JS e só é
 * visível em ecrãs estreitos (controlado pelo CSS em mobile.css).
 */
(function () {
    function setupMobileNavbar(navbar) {
        if (!navbar || navbar.dataset.mobileNavReady === 'true') return;
        navbar.dataset.mobileNavReady = 'true';

        const menu = navbar.querySelector('.menu-3');
        if (!menu) return;

        // Botão hambúrguer (3 barras), injetado antes do menu.
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'navbar-hamburger';
        toggleBtn.setAttribute('aria-label', 'Abrir menu de navegação');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.innerHTML = '<span></span><span></span><span></span>';
        navbar.appendChild(toggleBtn);

        // Camada de fundo (overlay) usada para fechar o menu ao clicar fora.
        const overlay = document.createElement('div');
        overlay.className = 'navbar-mobile-overlay';
        document.body.appendChild(overlay);

        function openMenu() {
            menu.classList.add('navbar-mobile-open');
            overlay.classList.add('is-visible');
            toggleBtn.classList.add('is-active');
            toggleBtn.setAttribute('aria-expanded', 'true');
            document.body.classList.add('navbar-mobile-locked');
        }

        function closeMenu() {
            menu.classList.remove('navbar-mobile-open');
            overlay.classList.remove('is-visible');
            toggleBtn.classList.remove('is-active');
            toggleBtn.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('navbar-mobile-locked');
        }

        toggleBtn.addEventListener('click', () => {
            const isOpen = menu.classList.contains('navbar-mobile-open');
            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        overlay.addEventListener('click', closeMenu);

        // Fechar o menu ao escolher uma página, e ao redimensionar para desktop.
        menu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', closeMenu);
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 900) closeMenu();
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') closeMenu();
        });
    }

    function init() {
        document.querySelectorAll('nav.navbar, .navbar').forEach(setupMobileNavbar);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
