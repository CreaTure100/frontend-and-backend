// Обработка формы обратной связи с полной доступностью
document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.querySelector('.contact-form');
    const submitBtn = contactForm?.querySelector('.submit-btn');

    if (contactForm && submitBtn) {
        // Динамически добавляем сообщения об ошибках
        const fields = ['name', 'email', 'message'];
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            const errorSpan = document.createElement('span');
            errorSpan.className = 'error-message';
            errorSpan.id = `${fieldId}-error`;
            errorSpan.setAttribute('aria-live', 'polite');
            field.parentNode.appendChild(errorSpan);
        });

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            let isValid = true;

            // Валидация имени
            const name = document.getElementById('name').value.trim();
            if (name === '') {
                showError('name', 'Пожалуйста, введите ваше имя');
                isValid = false;
            } else {
                clearError('name');
            }

            // Валидация email
            const email = document.getElementById('email').value.trim();
            if (email === '') {
                showError('email', 'Пожалуйста, введите email');
                isValid = false;
            } else if (!isValidEmail(email)) {
                showError('email', 'Пожалуйста, введите корректный email');
                isValid = false;
            } else {
                clearError('email');
            }

            // Валидация сообщения
            const message = document.getElementById('message').value.trim();
            if (message === '') {
                showError('message', 'Пожалуйста, введите сообщение');
                isValid = false;
            } else {
                clearError('message');
            }

            if (isValid) {
                // Имитация отправки с доступностью
                submitBtn.setAttribute('aria-busy', 'true');
                submitBtn.textContent = 'Отправка...';

                setTimeout(() => {
                    alert('Сообщение отправлено!');
                    contactForm.reset();
                    submitBtn.removeAttribute('aria-busy');
                    submitBtn.textContent = 'Отправить сообщение';

                    // Возвращаем фокус на первую поле для удобства
                    document.getElementById('name').focus();
                }, 1000);
            } else {
                // Фокус на первое поле с ошибкой
                const firstErrorField = contactForm.querySelector('[aria-invalid="true"]');
                if (firstErrorField) {
                    firstErrorField.focus();
                }
            }
        });

        // Обработка реальтного времени для улучшения UX
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            field.addEventListener('blur', function () {
                validateField(fieldId);
            });

            field.addEventListener('input', function () {
                if (this.getAttribute('aria-invalid') === 'true') {
                    validateField(fieldId);
                }
            });
        });

        function validateField(fieldId) {
            const field = document.getElementById(fieldId);
            const value = field.value.trim();

            switch (fieldId) {
                case 'name':
                    if (value !== '') clearError(fieldId);
                    break;
                case 'email':
                    if (value !== '' && isValidEmail(value)) clearError(fieldId);
                    break;
                case 'message':
                    if (value !== '') clearError(fieldId);
                    break;
            }
        }

        function showError(fieldId, message) {
            const field = document.getElementById(fieldId);
            const errorSpan = document.getElementById(`${fieldId}-error`);

            field.setAttribute('aria-invalid', 'true');
            field.setAttribute('aria-describedby', `${fieldId}-hint ${fieldId}-error`);
            errorSpan.textContent = message;
        }

        function clearError(fieldId) {
            const field = document.getElementById(fieldId);
            const errorSpan = document.getElementById(`${fieldId}-error`);

            field.removeAttribute('aria-invalid');
            field.setAttribute('aria-describedby', `${fieldId}-hint`);
            errorSpan.textContent = '';
        }

        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
    }
});