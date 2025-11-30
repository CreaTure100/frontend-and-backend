/* Утилиты */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* Тема */
(function initTheme(){
  const STORAGE_KEY = 'theme';
  const root = document.documentElement;
  const btn = document.getElementById('theme-toggle');

  const getSystemTheme = () =>
    window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';

  function setTheme(theme){
    if(theme === 'light' || theme === 'dark'){
      root.setAttribute('data-theme', theme);
    }else{
      root.removeAttribute('data-theme');
    }
    updateButton();
  }
  function currentTheme(){
    return root.getAttribute('data-theme') || getSystemTheme();
  }
  function updateButton(){
    if(!btn) return;
    const theme = currentTheme();
    const isDark = theme === 'dark';
    btn.setAttribute('aria-pressed', String(isDark));
    btn.title = isDark ? 'Светлая тема' : 'Тёмная тема';
    btn.innerHTML = isDark ? '<span aria-hidden="true">☀️</span>' : '<span aria-hidden="true">🌙</span>';
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  setTheme(saved || getSystemTheme());

  btn?.addEventListener('click', ()=>{
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  });

  try{
    const mql = window.matchMedia('(prefers-color-scheme: light)');
    mql.addEventListener?.('change', ()=>{
      if(!localStorage.getItem(STORAGE_KEY)){
        setTheme(getSystemTheme());
      }
    });
  }catch(_){}
})();

/* Активный пункт меню */
(function initActiveNav(){
  const page = document.documentElement.dataset.page;
  $$('.site-nav a').forEach(a => {
    const key = a.dataset.link;
    if(key === page){ a.setAttribute('aria-current','page'); }
  });
})();

/* Проекты: модалка project-modal — надёжная версия загрузки скринов */
(function initProjects(){
  // Если используется другая модалка (#projectModal из projects.js), не инициализируем этот блок
  if (document.getElementById('projectModal')) return;

  const grid = $('#projects-grid');
  const modal = $('#project-modal');
  if(!grid || !modal) return;

  const chips = $$('.filters .chip');
  chips.forEach(chip => chip.addEventListener('click', ()=>{
    chips.forEach(c=>{
      c.classList.remove('is-active');
      c.setAttribute('aria-selected','false');
    });
    chip.classList.add('is-active');
    chip.setAttribute('aria-selected','true');
    const f = chip.dataset.filter;
    $$('.project-card', grid).forEach(card=>{
      const cat = (card.dataset.category || 'misc').toLowerCase();
      const show = (f === 'all') || cat === f;
      card.style.display = show ? '' : 'none';
    });
  }));

  const title = $('#project-modal-title');
  const desc = $('#project-modal-desc');
  const aDemo = $('#project-modal-demo');
  const aCode = $('#project-modal-code');
  const gallery = $('#project-modal-gallery');

  // Пытаемся по очереди варианты URL, пока один не загрузится
  function tryLoadImage(imgEl, candidates, rawOriginal){
    let i = 0;
    function tryNext(){
      if(i >= candidates.length){
        // последний fallback — сырой оригинальный путь
        imgEl.removeAttribute('srcset');
        imgEl.removeAttribute('sizes');
        imgEl.src = rawOriginal;
        return;
      }
      const c = candidates[i++];
      imgEl.src = c.src;
      if (c.srcset) imgEl.srcset = c.srcset; else imgEl.removeAttribute('srcset');
      if (c.sizes) imgEl.sizes = c.sizes; else imgEl.removeAttribute('sizes');
    }
    imgEl.onerror = ()=>{
      // пробуем следующий кандидат
      tryNext();
    };
    // стартуем
    tryNext();
  }

  function buildPicture(stemNoExt, rawOriginal, altText){
    // Варианты для <img> — от самого качественного к базовому
    const sizes = '(max-width: 640px) 100vw, 320px';
    const candidates = [
      // AVIF 300 → AVIF 150
      { src: `${stemNoExt}-300.avif` },
      { src: `${stemNoExt}-150.avif` },
      // WebP 300 → WebP 150
      { src: `${stemNoExt}-300.webp` },
      { src: `${stemNoExt}-150.webp` },
      // PNG 300 + srcset → PNG 150
      { src: `${stemNoExt}-300.png`, srcset: `${stemNoExt}-150.png 150w, ${stemNoExt}-300.png 300w`, sizes },
      { src: `${stemNoExt}-150.png` },
    ];

    const picture = document.createElement('picture');
    const img = document.createElement('img');
    img.className = 'project-screenshot';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.alt = altText;
    img.width = 320;
    img.height = 180;

    tryLoadImage(img, candidates, rawOriginal);
    picture.appendChild(img);
    return picture;
  }

  function setGallery(fromCard, projectTitle){
    if(!gallery) return;
    gallery.innerHTML = '';

    // ВАЖНО: data-img* должны быть с реальными подпапками!
    // Примеры правильных путей:
    // ../assets/images/projects/portfolio/portfolio-1.png
    // ../assets/images/projects/library/library-1.png
    // ../assets/images/projects/goods/goods-1.png
    // ../assets/images/projects/chess/chess-1.png
    const raws = [fromCard.dataset.img1, fromCard.dataset.img2].filter(Boolean);

    if(!raws.length){
      gallery.hidden = true;
      return;
    }

    raws.forEach((raw, i)=>{
      const baseNoExt = raw.replace(/\.(png|jpg|jpeg|webp|avif)$/i,''); // убираем расширение
      const altText = `${projectTitle} — скриншот ${i+1}`;
      const picture = buildPicture(baseNoExt, raw, altText);
      gallery.appendChild(picture);
    });

    gallery.hidden = false;
  }

  function openModal(fromCard){
    const t = fromCard.dataset.title || 'Проект';
    title.textContent = t;
    desc.textContent = fromCard.dataset.desc || 'Описание появится позже.';
    aDemo.href = fromCard.dataset.demo || '#';
    aCode.href = fromCard.dataset.code || '#';
    setGallery(fromCard, t);

    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.modal__close')?.focus();
  }
  function closeModal(){
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }

  $$('.project-card', grid).forEach(card=>{
    card.addEventListener('click', ()=> openModal(card));
    card.addEventListener('keydown', (e)=>{
      if(e.key==='Enter' || e.key===' '){
        e.preventDefault();
        openModal(card);
      }
    });
  });

  modal.addEventListener('click', (e)=>{
    if(e.target.matches('[data-close-modal], .modal__backdrop')) closeModal();
  });
  document.addEventListener('keydown', (e)=>{
    if(e.key==='Escape' && modal.getAttribute('aria-hidden')==='false'){
      closeModal();
    }
  });
})();

/* Дневник */
(function initDiary(){
  const list = $('#diary-list');
  const btn = $('#add-entry');
  const modal = $('#task-modal');
  const form = $('#task-form');
  const input = $('#task-input');
  let lastFocus = null;

  if(!list || !btn) return;

  if(modal && form && input){
    function openTaskModal(){
      lastFocus = document.activeElement;
      input.value = '';
      const err = $('.error', form);
      if(err) err.textContent = '';
      modal.setAttribute('aria-hidden','false');
      document.body.style.overflow = 'hidden';
      setTimeout(()=> input.focus(), 0);
    }
    function closeTaskModal(){
      modal.setAttribute('aria-hidden','true');
      document.body.style.overflow = '';
      if(lastFocus) lastFocus.focus();
    }

    btn.addEventListener('click', openTaskModal);

    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const task = input.value.trim();
      const err = $('.error', form);
      if(!task){
        if(err) err.textContent = 'Введите текст задачи';
        input.focus();
        return;
      }
      const now = new Date();
      const dd = now.toLocaleDateString('ru-RU', { day:'2-digit', month:'short' }).replace('.', '');
      const iso = now.toISOString().split('T')[0];

      const li = document.createElement('li');
      li.className = 'is-progress';

      const timeEl = document.createElement('time');
      timeEl.dateTime = iso;
      timeEl.textContent = dd;
      li.appendChild(timeEl);

      li.appendChild(document.createTextNode(' — '));

      const taskSpan = document.createElement('span');
      taskSpan.className = 'task-text';
      taskSpan.textContent = task;
      li.appendChild(taskSpan);

      const statusSpan = document.createElement('span');
      statusSpan.className = 'status status--progress';
      statusSpan.setAttribute('aria-label','в процессе');
      statusSpan.title = 'в процессе';
      statusSpan.textContent = 'В процессе';
      li.appendChild(statusSpan);

      list.prepend(li);
      closeTaskModal();
    });

    modal.addEventListener('click', (e)=>{
      if(e.target.matches('[data-close-task], .modal__backdrop')) closeTaskModal();
    });
    document.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false'){
        closeTaskModal();
      }
    });
  }else{
    btn.addEventListener('click', ()=>{
      const raw = prompt('Введите текст новой задачи', '');
      if(raw === null) return;
      const task = raw.trim();
      if(!task) return;
      const now = new Date();
      const dd = now.toLocaleDateString('ru-RU', { day:'2-digit', month:'short' }).replace('.', '');
      const iso = now.toISOString().split('T')[0];
      const li = document.createElement('li');
      li.className = 'is-progress';
      li.innerHTML = `<time datetime="${iso}">${dd}</time> — <span class="task-text"></span> <span class="status status--progress" aria-label="в процессе" title="в процессе">В процессе</span>`;
      li.querySelector('.task-text').textContent = task;
      list.prepend(li);
    });
  }
})();

/* Контактная форма */
(function initContactForm(){
  const form = $('#contact-form');
  if(!form) return;

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    let ok = true;
    $$('input, textarea', form).forEach(el=>{
      const error = el.closest('.field').querySelector('.error');
      if(!el.checkValidity()){
        ok = false;
        error.textContent = el.validationMessage;
      }else{
        error.textContent = '';
      }
    });
    const status = $('.form-status', form);
    if(ok){
      status.textContent = 'Сообщение отправлено (демо).';
      form.reset();
      setTimeout(()=> status.textContent = '', 3000);
    }else{
      status.textContent = 'Исправьте ошибки в форме.';
    }
  });

  $$('input, textarea', form).forEach(el=>{
    el.addEventListener('input', ()=>{
      const error = el.closest('.field').querySelector('.error');
      if(el.checkValidity()) error.textContent = '';
    });
  });
})();