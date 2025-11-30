// Данные проектов
const projectsData = {
    1: {
        title: "Личный сайт + Портфолио",
        description: "Одностраничный сайт с разделами и портфолио",
        technologies: ["HTML", "CSS", "Bootstrap"],
        liveLink: "https://creature100.github.io/frontend-and-backend-practice/index.html",
        githubLink: "https://github.com/CreaTure100/frontend-and-backend-practice",
        screenshots: [
            "../assets/images/projects/portfolio/portfolio-1.png",
            "../assets/images/projects/portfolio/portfolio-2.png"
        ]
    },
    2: {
        title: "Система библиотеки (Python + SQL)",
        description: "Десктопное приложение для библиотеки на Python с базой данных (SQL)",
        technologies: ["Python", "SQL"],
        liveLink: "https://github.com/CreaTure100/BD_biblioteka_02",
        githubLink: "https://github.com/CreaTure100/BD_biblioteka_02",
        screenshots: [
            "../assets/images/projects/library/library-1.png",
            "../assets/images/projects/library/library-2.png"
        ]
    },
    3: {
        title: "Интернет‑магазин (страница товаров)",
        description: "Демо каталога товаров",
        technologies: ["JavaScript"],
        liveLink: "https://creature100.github.io/frontend-and-backend-practice/pages/goods.html",
        githubLink: "https://github.com/CreaTure100/frontend-and-backend-practice",
        screenshots: [
            "../assets/images/projects/goods/goods-1.png"
        ]
    },
    4: {
        title: "Шахматы (C++ курсовая)",
        description: "Приложение шахматы на C++ с ИИ в рамках курсовой работы",
        technologies: ["C++"],
        liveLink: "https://github.com/CreaTure100/Chess",
        githubLink: "https://github.com/CreaTure100/Chess",
        screenshots: [
            "../assets/images/projects/chess/chess-1.png", 
            "../assets/images/projects/chess/chess-2.png"
        ]
    },
};

let lastFocusedElement = null;
// Инициализация модального окна
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('projectModal');
    const closeBtn = document.querySelector('.close-modal');
    const projectCards = document.querySelectorAll('.project-card-large');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Открытие модального окна
    projectCards.forEach(card => {
        card.addEventListener('click', function () {
            const projectId = this.getAttribute('data-project');
            openModal(projectId);
        });
    });

    // Закрытие модального окна
    closeBtn.addEventListener('click', closeModal);
    closeBtn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            closeModal();
        }
    });

    window.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Фильтрация проектов
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const filter = this.getAttribute('data-filter');

            // Обновляем активную кнопку
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Фильтруем проекты
            filterProjects(filter);
        });
    });

    function openModal(projectId) {
        lastFocusedElement = document.activeElement;

        const project = projectsData[projectId];
        if (!project) return;

        const modal = document.getElementById('projectModal');
        const modalBody = document.querySelector('.modal-body');

        // Добавляем ARIA-атрибуты для доступности
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', 'modal-title');

        // Скрываем основной контент от скринридера
        document.querySelectorAll('body > *:not(.modal)')
            .forEach(el => el.setAttribute('aria-hidden', 'true'));

        // Скриншоты
        let screenshotsHtml;
        if (project.screenshots && project.screenshots.length > 0) {
            screenshotsHtml = project.screenshots.map((screenshot, index) => `
                <div class="screenshot-item">
                    <picture>
                        <source type="image/webp" 
                                srcset="${screenshot.replace('.png', '.webp')}">
                        <source type="image/avif" 
                                srcset="${screenshot.replace('.png', 'avif')}">
                        <img src="${screenshot}" 
                             srcset="${screenshot.replace('.png', '-150.png')} 150w,
                                     ${screenshot.replace('.png', '-300.png')} 300w,
                                     ${screenshot} 600w"
                             sizes="(max-width: 768px) 280px, 400px"
                             width="400" 
                             height="300"
                             alt="Скриншот ${project.title} ${index + 1}" 
                             class="project-screenshot"
                             loading="lazy">
                    </picture>
                </div>
            `).join('');
        }
        else {
            screenshotsHtml =
            `<div class="screenshot-item screenshot-placeholder">
                <div class="screenshot-content">
                    <p>Скриншоты пока не добавлены</p>
                    <div class="placeholder-icon">📷</div>
                </div>
            </div>`;
        }

        const techHtml = project.technologies.map(tech =>
            `<span class="tech-tag">${tech}</span>`
        ).join('');

        modalBody.innerHTML = `
            <h2>${project.title}</h2>
            <p class="project-description">${project.description}</p>
            
            <div class="project-tech">
                ${techHtml}
            </div>
            
            <h3>Скриншоты</h3>
            <div class="project-gallery">
                ${screenshotsHtml}
            </div>
            
            <div class="project-links">
                <a href="${project.liveLink}" target="_blank" class="project-link">
                    🌐 Онлайн версия
                </a>
                <a href="${project.githubLink}" target="_blank" class="project-link github">
                    💻 Исходный код
                </a>
            </div>
        `;

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        const modal = document.getElementById('projectModal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';

        // Возвращаем видимость основному контенту
        document.querySelectorAll('body > *:not(.modal)')
            .forEach(el => el.removeAttribute('aria-hidden'));

        // Возвращаем фокус на элемент, который открыл модалку
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }

        // Убираем обработчик Escape
        document.removeEventListener('keydown', handleEscape);
    }

    function filterProjects(filter) {
        projectCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Закрытие по ESC
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});
