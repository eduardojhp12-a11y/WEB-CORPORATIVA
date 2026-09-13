/**
 * main.js - Lógica global de Cyberion
 * Incluye interacciones de navegación móvil, animaciones de scroll y cabecera dinámica.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       1. Nav Móvil & Header Dinámico
       ========================================================================== */
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    let isMenuOpen = false;

    // Toggle menú móvil
    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            if (isMenuOpen) {
                mobileMenu.classList.add('mobile-menu--open');
                navToggle.setAttribute('aria-expanded', 'true');
                // Cambiar ícono a "X" (Cerrar)
                navToggle.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                `;
            } else {
                mobileMenu.classList.remove('mobile-menu--open');
                navToggle.setAttribute('aria-expanded', 'false');
                // Restaurar ícono de Hamburguesa
                navToggle.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                `;
            }
        });
    }

    // Efecto de sombra al hacer scroll en la cabecera
    const handleScroll = () => {
        if (window.scrollY > 20) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    // Trigger inicial
    handleScroll();


    /* ==========================================================================
       2. Animaciones al Hacer Scroll (Intersection Observer)
       ========================================================================== */
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    // Configuración del Observer: 10% del elemento debe ser visible
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Dejamos de observar una vez que ya se animó
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        scrollObserver.observe(el);
    });
});
