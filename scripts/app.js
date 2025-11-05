const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* Тема: переключатель светлая/тёмная с сохранением выбора */
(function initTheme(){
  const STORAGE_KEY = 'theme'; // 'light' | 'dark'
  const root = document.documentElement;
  const btn = document.getElementById('theme-toggle');

  const getSystemTheme = () =>
    window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';

  function setTheme(theme){ // 'light' | 'dark'
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
    btn.innerHTML = isDark ? '<span aria-hidden="true">☀️</span>'
                           : '<span aria-hidden="true">🌙</span>';
  }

  // Инициализация
  const saved = localStorage.getItem(STORAGE_KEY);
  setTheme(saved || getSystemTheme());

  // Клик по кнопке
  btn?.addEventListener('click', ()=>{
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  });

  // Если пользователь не выбирал явно, следуем за системой
  try{
    const mql = window.matchMedia('(prefers-color-scheme: light)');
    mql.addEventListener?.('change', ()=>{
      if(!localStorage.getItem(STORAGE_KEY)){
        setTheme(getSystemTheme());
      }
    });
  }catch(_){}
})();

// Подсветка активного пункта меню
(function initActiveNav(){
  const page = document.documentElement.dataset.page;
  $$('.site-nav a').forEach(a => {
    const key = a.dataset.link;
    if(key === page){ a.setAttribute('aria-current','page'); }
  });
})();

// Фильтры проектов и модалка (с галереей скринов)
(function initProjects(){
  const grid = $('#projects-grid');
  if(!grid) return;

  const chips = $$('.filters .chip');
  chips.forEach(chip => chip.addEventListener('click', ()=>{
    chips.forEach(c=>{ c.classList.remove('is-active'); c.setAttribute('aria-selected','false'); });
    chip.classList.add('is-active'); chip.setAttribute('aria-selected','true');
    const f = chip.dataset.filter;
    $$('.project-card', grid).forEach(card=>{
      const cat = card.dataset.category || 'misc';
      const show = (f === 'all') || cat.toLowerCase().includes(f);
      card.style.display = show ? '' : 'none';
    });
  }));

  const modal = $('#project-modal');
  const title = $('#project-modal-title');
  const desc = $('#project-modal-desc');
  const aDemo = $('#project-modal-demo');
  const aCode = $('#project-modal-code');
  const gallery = $('#project-modal-gallery');

  function setGallery(fromCard, projectTitle){
    if(!gallery) return;
    gallery.innerHTML = '';
    const imgs = [fromCard.dataset.img1, fromCard.dataset.img2].filter(Boolean);
    if(imgs.length){
      imgs.forEach((src, i)=>{
        const img = document.createElement('img');
        img.src = src;
        img.loading = 'lazy';
        img.alt = `${projectTitle} — скриншот ${i+1}`;
        gallery.appendChild(img);
      });
      gallery.hidden = false;
    } else {
      gallery.hidden = true;
    }
  }

  function openModal(fromCard){
    const t = fromCard.dataset.title || 'Проект';
    title.textContent = t;
    desc.textContent = fromCard.dataset.desc || 'Описание появится позже.';
    aDemo.href = fromCard.dataset.demo || '#';
    aCode.href = fromCard.dataset.code || '#';
    setGallery(fromCard, t);

    modal?.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(){
    modal?.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }

  $$('.project-card', grid).forEach(card=>{
    card.addEventListener('click', ()=> openModal(card));
    card.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); openModal(card); }});
  });

  modal?.addEventListener('click', (e)=>{
    if(e.target.matches('[data-close-modal], .modal__backdrop')) closeModal();
  });
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape' && modal?.getAttribute('aria-hidden')==='false'){ closeModal(); } });
})();

// Дневник: модалка ввода + добавление записи (статус — "В процессе")
(function initDiary(){
  const list = $('#diary-list');
  const btn = $('#add-entry');
  const modal = $('#task-modal');
  const form = $('#task-form');
  const input = $('#task-input');
  const cancelBtn = $('#task-cancel');
  let lastFocus = null;

  if(!list || !btn) return; // страница без дневника

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

    // submit
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
      const dd = now.toLocaleDateString('ru-RU', { day:'2-digit', month:'short' });

      const li = document.createElement('li');
      li.className = 'is-progress';

      const timeEl = document.createElement('time');
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

    // cancel / backdrop / Esc
    modal.addEventListener('click', (e)=>{
      if(e.target.matches('[data-close-task], .modal__backdrop')) closeTaskModal();
    });
    document.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false'){
        closeTaskModal();
      }
    });
  }else{
    // Страница без модалки — fallback на prompt
    btn.addEventListener('click', ()=>{
      const raw = prompt('Введите текст новой задачи', '');
      if(raw === null) return;
      const task = raw.trim();
      if(!task) return;
      const now = new Date();
      const dd = now.toLocaleDateString('ru-RU', { day:'2-digit', month:'short' });
      const li = document.createElement('li');
      li.className = 'is-progress';
      li.innerHTML = `<time>${dd}</time> — <span class="task-text"></span> <span class="status status--progress" aria-label="в процессе" title="в процессе">В процессе</span>`;
      li.querySelector('.task-text').textContent = task;
      list.prepend(li);
    });
  }
})();

// Контактная форма
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

  // Очистка ошибок по вводу
  $$('input, textarea', form).forEach(el=>{
    el.addEventListener('input', ()=>{
      const error = el.closest('.field').querySelector('.error');
      if(el.checkValidity()) error.textContent = '';
    });
  });
})();