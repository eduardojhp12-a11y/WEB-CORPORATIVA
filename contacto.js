/**
 * contacto.js - Lógica de validación en tiempo real para el formulario de contacto
 */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    
    if (!form) return;

    const inputName = document.getElementById('name');
    const inputEmail = document.getElementById('email');
    const inputPhone = document.getElementById('phone');
    const inputMessage = document.getElementById('message');
    const successMsg = document.getElementById('form-success');
    const submitBtn = document.getElementById('submit-btn');

    // Expresiones regulares para validación
    const regexName = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]{3,50}$/;
    const regexEmail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    const regexPhone = /^[\d\s+]{0,15}$/; // Opcional, pero si hay algo, debe ser válido

    // Función genérica de validación
    const validateField = (input, regex, isRequired = true, minLength = 0) => {
        const value = input.value.trim();
        let isValid = false;

        if (value === '') {
            isValid = !isRequired;
        } else if (regex) {
            isValid = regex.test(value);
        } else {
            isValid = value.length >= minLength;
        }

        if (isValid) {
            input.classList.remove('is-invalid');
        } else {
            input.classList.add('is-invalid');
        }

        return isValid;
    };

    // Eventos en tiempo real (input y blur)
    inputName.addEventListener('input', () => validateField(inputName, regexName));
    inputName.addEventListener('blur', () => validateField(inputName, regexName));

    inputEmail.addEventListener('input', () => validateField(inputEmail, regexEmail));
    inputEmail.addEventListener('blur', () => validateField(inputEmail, regexEmail));

    inputPhone.addEventListener('input', () => validateField(inputPhone, regexPhone, false));
    inputPhone.addEventListener('blur', () => validateField(inputPhone, regexPhone, false));

    inputMessage.addEventListener('input', () => validateField(inputMessage, null, true, 10));
    inputMessage.addEventListener('blur', () => validateField(inputMessage, null, true, 10));

    // Submit del formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validar todo al momento del submit
        const isNameValid = validateField(inputName, regexName);
        const isEmailValid = validateField(inputEmail, regexEmail);
        const isPhoneValid = validateField(inputPhone, regexPhone, false);
        const isMessageValid = validateField(inputMessage, null, true, 10);

        if (isNameValid && isEmailValid && isPhoneValid && isMessageValid) {
            // Simulamos el envío
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;

            setTimeout(() => {
                form.reset();
                submitBtn.textContent = 'Enviar Mensaje';
                submitBtn.disabled = false;
                successMsg.style.display = 'block';

                // Ocultar mensaje de éxito después de 5 segundos
                setTimeout(() => {
                    successMsg.style.display = 'none';
                }, 5000);

            }, 1500);
        }
    });
});
