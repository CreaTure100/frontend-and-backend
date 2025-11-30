// Структура файлов (как на скрине):
// assets/images/projects/
// ├─ portfolio/portfolio-1.png, portfolio-1-150.png, portfolio-1-300.png, portfolio-1.avif, portfolio-1.webp
// │              portfolio-2.png, portfolio-2-150.png, portfolio-2-300.png, portfolio-2.avif, portfolio-2.webp
// ├─ library/library-1.png, library-1-150.png, library-1-300.png, library-1.avif, library-1.webp
// │          library-2.png, library-2-150.png, library-2-300.png, library-2.avif, library-2.webp
// ├─ goods/goods-1.png, goods-1-150.png, goods-1-300.png, goods-1.avif, goods-1.webp
// └─ chess/chess-1.png, chess-1-150.png, chess-1-300.png, chess-1.avif, chess-1.webp
//             chess-2.png, chess-2-150.png, chess-2-300.png, chess-2.avif, chess-2.webp

const projectsData = {
  1: {
    title: "Личный сайт + Портфолио",
    description:
      "Одностраничный сайт‑визитка с разделами и портфолио. Акцент на верстку, семантику, адаптив и доступность.",
    technologies: ["HTML5", "CSS3", "Bootstrap"],
    liveLink: "https://creature100.github.io/frontend-and-backend-practice/index.html",
    githubLink: "https://github.com/CreaTure100/frontend-and-backend-practice",
    screenshots: [
      "../assets/images/projects/portfolio/portfolio-1.png",
      "../assets/images/projects/portfolio/portfolio-2.png",
    ],
  },
  2: {
    title: "Приложение‑библиотека (Python + SQL)",
    description:
      "Десктопное приложение для библиотеки на Python с базой данных (SQL): учет книг, читателей, выдач.",
    technologies: ["Python", "SQL"],
    liveLink: "https://github.com/CreaTure100/BD_biblioteka_02",
    githubLink: "https://github.com/CreaTure100/BD_biblioteka_02",
    screenshots: [
      "../assets/images/projects/library/library-1.png",
      "../assets/images/projects/library/library-2.png",
    ],
  },
  3: {
    title: "Интернет‑магазин (страница товаров)",
    description:
      "Демо каталога товаров: карточки, фильтры, интерактив. Фокус на работу с DOM и событиями.",
    technologies: ["JavaScript"],
    liveLink: "https://creature100.github.io/frontend-and-backend-practice/pages/goods.html",
    githubLink: "https://github.com/CreaTure100/frontend-and-backend-practice",
    screenshots: ["../assets/images/projects/goods/goods-1.png"],
  },
  4: {
    title: "Шахматы (C++ курсовая)",
    description:
      "Приложение «Шахматы» на C++ с логикой игры и ИИ в рамках курсовой работы.",
    technologies: ["C++"],
    liveLink: "https://github.com/CreaTure100/Chess",
    githubLink: "https://github.com/CreaTure100/Chess",
    screenshots: [
      "../assets/images/projects/chess/chess-1.png",
      "../assets/images/projects/chess/chess-2.png",
    ],
  },
};

let lastFocusedElement = null;

document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("projectModal");
  const closeBtn = document.querySelector(".close-modal");
  const modalBody = document.querySelector(".modal-body");
  const projectCards = document.querySelectorAll(".project-card-large, .project-card");
  const filterBtns = document.querySelectorAll(".filter-btn, .filters .chip");

  // Открытие модалки
  projectCards.forEach((card) => {
    card.addEventListener("click", () => {
      const projectId = card.getAttribute("data-project");
      openModal(projectId || inferIdByTitle(card));
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const projectId = card.getAttribute("data-project");
        openModal(projectId || inferIdByTitle(card));
      }
    });
  });

  // Фильтры
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const filter = this.getAttribute("data-filter");
      filterBtns.forEach((b) => {
        b.classList.remove("active", "is-active");
        b.setAttribute("aria-selected", "false");
      });
      this.classList.add("active", "is-active");
      this.setAttribute("aria-selected", "true");
      filterProjects(filter);
    });
  });

  function filterProjects(filter) {
    document.querySelectorAll(".project-card-large, .project-card").forEach((card) => {
      const cat = card.getAttribute("data-category");
      card.style.display = filter === "all" || cat === filter ? "" : "none";
    });
  }

  // Закрытие модалки
  closeBtn?.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
  modal?.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal__backdrop")) closeModal();
  });

  function inferIdByTitle(card) {
    const title = card.querySelector(".project-card__title")?.textContent.trim() || "";
    if (title.includes("Портфолио")) return "1";
    if (title.includes("библиотека")) return "2";
    if (title.includes("Интернет")) return "3";
    if (title.includes("Шахматы")) return "4";
    return null;
  }

  function buildScreenshotItem(screenshot, index, title) {
    const stem = screenshot.replace(/\.(png|jpg|jpeg|webp|avif)$/i, "");
    const avif150 = `${stem}-150.avif`;
    const avif300 = `${stem}-300.avif`;
    const webp150 = `${stem}-150.webp`;
    const webp300 = `${stem}-300.webp`;
    const png150 = `${stem}-150.png`;
    const png300 = `${stem}-300.png`;

    // Диагностика путей
    console.debug("Screenshot stem:", stem, {
      avif150, avif300, webp150, webp300, png150, png300, raw: screenshot,
    });

    return `
      <div class="screenshot-item">
        <picture>
          <source type="image/avif"
                  srcset="${avif150} 150w, ${avif300} 300w"
                  sizes="(max-width: 640px) 100vw, 320px">
          <source type="image/webp"
                  srcset="${webp150} 150w, ${webp300} 300w"
                  sizes="(max-width: 640px) 100vw, 320px">
          <img class="project-screenshot"
               src="${png300}"
               srcset="${png150} 150w, ${png300} 300w"
               sizes="(max-width: 640px) 100vw, 320px"
               width="320" height="180"
               alt="Скриншот «${title}» ${index + 1}"
               loading="lazy" decoding="async"
               onerror="console.warn('Image 404, fallback raw:', this.src, '→', '${screenshot}'); this.onerror=null; this.src='${screenshot}'; this.removeAttribute('srcset'); this.removeAttribute('sizes');">
        </picture>
      </div>`;
  }

  function openModal(projectId) {
    lastFocusedElement = document.activeElement;

    const project = projectsData[projectId];
    if (!project) return;

    // ARIA
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-labelledby", "modal-title");

    // Скрыть основной контент от скринридера
    document
      .querySelectorAll("body > *:not(.modal)")
      .forEach((el) => el.setAttribute("aria-hidden", "true"));

    // Технологии
    const techHtml = (project.technologies || [])
      .map((tech) => `<span class="tech-tag">${tech}</span>`)
      .join("");

    // Галерея
    const screenshotsHtml =
      (project.screenshots || []).length > 0
        ? project.screenshots.map((s, i) => buildScreenshotItem(s, i, project.title)).join("")
        : `<div class="screenshot-item screenshot-placeholder">
             <div class="screenshot-content">
               <p>Скриншоты пока не добавлены</p>
               <div class="placeholder-icon">📷</div>
             </div>
           </div>`;

    // Контент модалки
    const linksHtml = `
      <div class="modal__actions project-links">
        <a href="${project.liveLink}" target="_blank" rel="noopener" class="btn btn--ghost button project-link">Демо</a>
        <a href="${project.githubLink}" target="_blank" rel="noopener" class="btn button project-link github">Исходный код</a>
      </div>`;

    modalBody.innerHTML = `
      <h2 id="modal-title">${project.title}</h2>
      <p class="project-description">${project.description}</p>
      <div class="project-tech">${techHtml}</div>
      <h3>Скриншоты</h3>
      <div class="project-gallery modal__gallery">
        ${screenshotsHtml}
      </div>
      ${linksHtml}
    `;

    // Показ
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    modal.querySelector(".close-modal")?.focus();
  }

  function closeModal() {
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "auto";
    document
      .querySelectorAll("body > *:not(.modal)")
      .forEach((el) => el.removeAttribute("aria-hidden"));
    lastFocusedElement?.focus();
  }
});