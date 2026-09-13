/**
 * precios.js - Lógica del toggle de facturación (Mensual/Anual)
 */

document.addEventListener('DOMContentLoaded', () => {
    const billingToggle = document.getElementById('billing-toggle');
    const priceElements = document.querySelectorAll('.price-value');
    
    const labelMonthly = document.getElementById('label-monthly');
    const labelAnnual = document.getElementById('label-annual');

    if (!billingToggle || !priceElements.length) return;

    billingToggle.addEventListener('change', (e) => {
        const isAnnual = e.target.checked;

        // Actualizar visualmente las etiquetas del toggle
        if (isAnnual) {
            labelMonthly.classList.remove('font-bold');
            labelMonthly.classList.add('text-secondary');
            labelAnnual.classList.add('font-bold');
            labelAnnual.classList.remove('text-secondary');
        } else {
            labelAnnual.classList.remove('font-bold');
            labelAnnual.classList.add('text-secondary');
            labelMonthly.classList.add('font-bold');
            labelMonthly.classList.remove('text-secondary');
        }

        // Animar y actualizar los precios
        priceElements.forEach(el => {
            // Breve animación de opacidad para la transición
            el.style.opacity = 0;
            
            setTimeout(() => {
                if (isAnnual) {
                    el.textContent = el.getAttribute('data-annual');
                } else {
                    el.textContent = el.getAttribute('data-monthly');
                }
                el.style.opacity = 1;
            }, 200); // 200ms de transición
        });
    });
});
