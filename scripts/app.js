const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// Подсветка активного пункта меню
(function initActiveNav(){
  const page = document.documentElement.dataset.page;
  $$('.site-nav a').forEach(a => {
    const key = a.dataset.link;
    if(key === page){ a.setAttribute('aria-current','page'); }
  });
})();

// Фильтры проектов и модалка 
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

  function openModal(fromCard){
    title.textContent = fromCard.dataset.title || 'Проект';
    desc.textContent = fromCard.dataset.desc || 'Описание появится позже.';
    aDemo.href = fromCard.dataset.demo || '#';
    aCode.href = fromCard.dataset.code || '#';

    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(){
    modal.setAttribute('aria-hidden','true');
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

// Дневник: добавить запись 
(function initDiary(){
  const list = $('#diary-list');
  const btn = $('#add-entry');
  if(!list || !btn) return;

  btn.addEventListener('click', ()=>{
    const now = new Date();
    const dd = now.toLocaleDateString('ru-RU', { day:'2-digit', month:'short' });
    const li = document.createElement('li');
    li.className = 'is-progress';
    li.innerHTML = `<time>${dd}</time> — Новая запись <span class="status status--progress" aria-label="в процессе" title="в процессе">В процессе</span>`;
    list.prepend(li);
  });
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