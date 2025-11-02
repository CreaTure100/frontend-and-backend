// �������� JavaScript ����
document.addEventListener('DOMContentLoaded', function () {
    // ���������� ��������
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // ������� �������� ����� � ���� ������
            filterBtns.forEach(b => b.classList.remove('active'));
            // ��������� �������� ����� ������� ������
            this.classList.add('active');

            // ����� ����� �������� ������ ���������� ��������
            console.log('������: ' + this.textContent);
        });
    });

    // �������� ��������-����� ��� �������
    const animateProgressBars = () => {
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    };

    // ��������� �������� ��� �������� ��������
    animateProgressBars();
});