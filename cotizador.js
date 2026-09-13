/**
 * cotizador.js - Lógica interactiva del asistente de cotización y persistencia
 */

document.addEventListener('DOMContentLoaded', () => {
    // Referencias del DOM
    const steps = document.querySelectorAll('.wizard-step');
    const indicators = document.querySelectorAll('.wizard-step-indicator');
    const btnNext = document.getElementById('btn-next');
    const btnPrev = document.getElementById('btn-prev');
    const stepTitle = document.getElementById('step-title');
    const budgetDisplay = document.getElementById('budget-display');
    const totalPriceEl = document.getElementById('total-price');
    const quoteForm = document.getElementById('quote-form');
    const quoteSuccess = document.getElementById('quote-success');

    // Estado del Cotizador
    let currentStep = 0;
    const totalSteps = steps.length;
    let budget = 0;

    // Objeto para almacenar selecciones (persistencia en LocalStorage)
    let userSelections = {
        projectType: null,
        pages: null,
        features: []
    };

    // Títulos de cada paso
    const titles = [
        "¿Qué tipo de proyecto necesitas?",
        "¿Cuántas vistas o páginas tendrá aproximadamente?",
        "Selecciona las funcionalidades adicionales:",
        "¡Casi listo! Déjanos tus datos"
    ];

    // Cargar datos previos de LocalStorage
    const loadState = () => {
        const savedData = localStorage.getItem('cyberion_quote_state');
        if (savedData) {
            try {
                userSelections = JSON.parse(savedData);
                restoreSelectionsUI();
            } catch (e) {
                console.error("Error parsing localstorage data");
            }
        }
    };

    // Guardar estado en LocalStorage
    const saveState = () => {
        localStorage.setItem('cyberion_quote_state', JSON.stringify(userSelections));
    };

    // Restaurar UI basada en estado guardado
    const restoreSelectionsUI = () => {
        document.querySelectorAll('.option-card').forEach(card => {
            const input = card.querySelector('input');
            const groupName = input.name;
            const value = input.value;

            if (input.type === 'radio') {
                if (userSelections[groupName] === value) {
                    input.checked = true;
                    card.classList.add('selected');
                }
            } else if (input.type === 'checkbox') {
                if (userSelections[groupName].includes(value)) {
                    input.checked = true;
                    card.classList.add('selected');
                }
            }
        });
        calculateBudget();
        validateStep();
    };

    // Calcular presupuesto sumando `data-price` de los inputs seleccionados
    const calculateBudget = () => {
        budget = 0;
        document.querySelectorAll('.option-card.selected').forEach(card => {
            const price = parseFloat(card.getAttribute('data-price')) || 0;
            budget += price;
        });

        // Animación de conteo (opcional, aquí lo hacemos directo para simplicidad)
        totalPriceEl.textContent = budget.toLocaleString('en-US');

        // Mostrar u ocultar bloque flotante
        if (budget > 0) {
            budgetDisplay.classList.add('visible');
        } else {
            budgetDisplay.classList.remove('visible');
        }
    };

    // Validar si se puede avanzar al siguiente paso
    const validateStep = () => {
        let canAdvance = false;

        if (currentStep === 0) {
            canAdvance = userSelections.projectType !== null;
        } else if (currentStep === 1) {
            canAdvance = userSelections.pages !== null;
        } else if (currentStep === 2) {
            // Checkboxes son opcionales, siempre puede avanzar
            canAdvance = true;
        } else if (currentStep === 3) {
            canAdvance = true; // El botón será "Enviar" y el form manejará validación HTML5
        }

        btnNext.disabled = !canAdvance;
    };

    // Lógica para actualizar la vista (Pasos)
    const updateView = () => {
        // Ocultar todos los pasos
        steps.forEach((step, index) => {
            step.classList.remove('active');
            if (index < indicators.length) {
                indicators[index].classList.remove('active', 'completed');
            }
        });

        // Mostrar paso actual
        steps[currentStep].classList.add('active');
        stepTitle.textContent = titles[currentStep];

        // Actualizar indicadores (progress bar)
        for (let i = 0; i <= currentStep; i++) {
            if (i < currentStep) {
                indicators[i].classList.add('completed');
            } else {
                indicators[i].classList.add('active');
            }
        }

        // Configurar botones Footer
        btnPrev.style.visibility = currentStep === 0 ? 'hidden' : 'visible';
        
        if (currentStep === totalSteps - 1) {
            btnNext.textContent = 'Solicitar Cotización';
        } else {
            btnNext.textContent = 'Siguiente Paso';
        }

        validateStep();
    };

    // Eventos Click en Botones Next/Prev
    btnNext.addEventListener('click', () => {
        if (currentStep < totalSteps - 1) {
            currentStep++;
            updateView();
        } else {
            // Intentar Submit si estamos en el último paso
            if (quoteForm.checkValidity()) {
                submitQuote();
            } else {
                quoteForm.reportValidity();
            }
        }
    });

    btnPrev.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            updateView();
        }
    });

    // Delegación de eventos para las opciones (Cards)
    document.querySelectorAll('.option-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const input = card.querySelector('input');
            const groupName = input.name;
            const value = input.value;

            if (input.type === 'radio') {
                // Remover 'selected' de todos los hermanos del mismo grupo
                document.querySelectorAll(`.option-card[data-group="${groupName}"]`).forEach(sibling => {
                    sibling.classList.remove('selected');
                });
                card.classList.add('selected');
                input.checked = true;
                userSelections[groupName] = value;
            } else if (input.type === 'checkbox') {
                // Toggle para checkboxes
                input.checked = !input.checked;
                card.classList.toggle('selected', input.checked);
                
                if (input.checked) {
                    if (!userSelections[groupName].includes(value)) {
                        userSelections[groupName].push(value);
                    }
                } else {
                    userSelections[groupName] = userSelections[groupName].filter(item => item !== value);
                }
            }

            saveState();
            calculateBudget();
            validateStep();
        });
    });

    // Simulación del envío de cotización
    const submitQuote = () => {
        btnNext.disabled = true;
        btnNext.textContent = 'Enviando...';
        
        setTimeout(() => {
            quoteSuccess.style.display = 'block';
            btnNext.style.display = 'none';
            btnPrev.style.display = 'none';
            
            // Limpiar LocalStorage después de éxito
            localStorage.removeItem('cyberion_quote_state');
            
            // Opcional: Ocultar el widget de presupuesto final
            budgetDisplay.classList.remove('visible');
        }, 1500);
    };

    // Evitar envío por defecto del form al presionar Enter
    quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        submitQuote();
    });

    // Inicialización
    loadState();
    updateView();
});
