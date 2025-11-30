// Главный JavaScript файл
document.addEventListener('DOMContentLoaded', function () {
  // Фильтрация проектов
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      // Снимаем активный класс со всех кнопок
      filterBtns.forEach(b => b.classList.remove('active'));
      // Добавляем активный класс на текущую кнопку
      this.classList.add('active');

      // Здесь можно вызвать функцию фильтрации карточек проектов
      console.log('Фильтр:', this.textContent);
    });
  });

  // Анимация прогресс-баров для навыков
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

  animateProgressBars();
});