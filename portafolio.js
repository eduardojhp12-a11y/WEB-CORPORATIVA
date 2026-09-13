/**
 * portafolio.js - Lógica de filtrado en Vanilla JS
 */

document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (!filterButtons.length || !portfolioItems.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 1. Actualizar estado visual de los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // 2. Obtener la categoría seleccionada
            const filterValue = button.getAttribute('data-filter');

            // 3. Filtrar los items
            portfolioItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');

                if (filterValue === 'todos' || itemCategory === filterValue) {
                    // Mostrar elemento
                    item.classList.remove('hidden');
                    // Reiniciar animaciones si deseamos un efecto visual
                    item.style.animation = 'none';
                    item.offsetHeight; /* trigger reflow */
                    item.style.animation = null;
                } else {
                    // Ocultar elemento
                    item.classList.add('hidden');
                }
            });
        });
    });
});
