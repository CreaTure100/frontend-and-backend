
document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            // ������� ���������
            if (name === '' || email === '' || message === '') {
                alert('����������, ��������� ��� ����');
                return;
            }

            if (!isValidEmail(email)) {
                alert('����������, ������� ���������� email');
                return;
            }

            // ���� ��� �������� ��������
            alert('��������� ����������!');
            contactForm.reset();
        });
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});