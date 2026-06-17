/**
 * Guest Guard - Protege páginas do acesso de convidados
 * Apenas About.html é permitida para convidados
 */

(function() {
    // Verificar se é convidado
    const isGuest = localStorage.getItem('croma_guest') === 'true';
    
    // Páginas permitidas para convidados
    const allowedForGuests = ['About.html', 'about.html', 'info_daltonismo.html'];
    
    if (isGuest) {
        const currentPage = window.location.pathname.split('/').pop();
        
        // Se a página não está na lista de permitidas, redirecionar
        if (!allowedForGuests.some(page => currentPage.includes(page))) {
            console.log('Guest redirect from:', currentPage);
            window.location.href = '../../html/About.html';
        }
    }
})();
