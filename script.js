// Cursor
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animCursor() {
  cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
  rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
  cursorRing.style.left = rx + 'px'; cursorRing.style.top = ry + 'px';
  requestAnimationFrame(animCursor);
}
animCursor();

// Nav show on scroll past hero
const mainNav = document.getElementById('mainNav');
const heroEl = document.getElementById('hero');
const navObs = new IntersectionObserver(entries => {
  if (!entries[0].isIntersecting) {
    mainNav.style.opacity = '1'; mainNav.style.pointerEvents = 'auto';
  } else {
    mainNav.style.opacity = '0'; mainNav.style.pointerEvents = 'none';
  }
}, { threshold: 0.05 });
navObs.observe(heroEl);

// Carousel
const track = document.getElementById('carouselTrack');
const cards = track.querySelectorAll('.carousel-card');
const progressEl = document.getElementById('carouselProgress');
let cur = 0;

function visibleCount() { return window.innerWidth <= 768 ? 1 : 3; }
function maxIdx() { return Math.max(0, cards.length - visibleCount()); }

function buildDots() {
  progressEl.innerHTML = '';
  const total = maxIdx() + 1;
  for (let i = 0; i < total; i++) {
    const d = document.createElement('div');
    d.className = 'carousel-dot' + (i === cur ? ' active' : '');
    progressEl.appendChild(d);
  }
}

function updateCarousel() {
  const cardW = cards[0].getBoundingClientRect().width;
  const gap = 20;
  track.style.transform = `translateX(-${cur * (cardW + gap)}px)`;
  buildDots();
}

document.getElementById('nextBtn').addEventListener('click', () => {
  cur = cur >= maxIdx() ? 0 : cur + 1; updateCarousel(); pauseAuto();
});
document.getElementById('prevBtn').addEventListener('click', () => {
  cur = cur <= 0 ? maxIdx() : cur - 1; updateCarousel(); pauseAuto();
});
window.addEventListener('resize', () => {
  cur = Math.min(cur, maxIdx()); updateCarousel();
});

// Touch
let startX = 0;
track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend', e => {
  const diff = startX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) {
    if (diff > 0) { cur = cur >= maxIdx() ? 0 : cur + 1; }
    else { cur = cur <= 0 ? maxIdx() : cur - 1; }
    updateCarousel(); pauseAuto();
  }
});

// Mouse drag
const carouselOuter = document.querySelector('.carousel-outer');
let dragStartX = 0, dragDeltaX = 0, isDragging = false, hasDragged = false;

function baseTranslate() {
  return cur * (cards[0].getBoundingClientRect().width + 20);
}

carouselOuter.addEventListener('mousedown', e => {
  isDragging = true;
  hasDragged = false;
  dragStartX = e.clientX;
  dragDeltaX = 0;
  track.style.transition = 'none';
  e.preventDefault();
});

window.addEventListener('mousemove', e => {
  if (!isDragging) return;
  dragDeltaX = e.clientX - dragStartX;
  if (Math.abs(dragDeltaX) > 5) hasDragged = true;
  track.style.transform = `translateX(${-(baseTranslate() - dragDeltaX)}px)`;
});

window.addEventListener('mouseup', () => {
  if (!isDragging) return;
  isDragging = false;
  track.style.transition = 'transform 0.55s cubic-bezier(0.77,0,0.18,1)';
  if (Math.abs(dragDeltaX) > 40) {
    if (dragDeltaX < 0) { cur = cur >= maxIdx() ? 0 : cur + 1; }
    else                { cur = cur <= 0 ? maxIdx() : cur - 1; }
  }
  updateCarousel(); pauseAuto();
  dragDeltaX = 0;
});

// Bloqueia o click no card se foi um drag (não um clique)
track.addEventListener('click', e => {
  if (hasDragged) { e.stopPropagation(); hasDragged = false; }
}, true);

buildDots();
updateCarousel();

// Auto-advance (7s, pausa 3s após interação)
let autoTimer = null;
let pauseTimer = null;

function startAuto() {
  autoTimer = setInterval(() => {
    cur = cur >= maxIdx() ? 0 : cur + 1; updateCarousel();
  }, 7000);
}

function pauseAuto() {
  clearInterval(autoTimer);
  clearTimeout(pauseTimer);
  pauseTimer = setTimeout(startAuto, 3000);
}

startAuto();

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObs.observe(el));

// ─── LIGHTBOX ───
const projectData = {
  chros: {
    title: 'Melhores CHROs do Brasil',
    tag: 'Forbes × Gupy',
    bg: 'linear-gradient(135deg,#1a1a2e,#0f3460)',
    slides: [
      { src: 'images/forbes/chros/01.jpg', label: 'Capa · CHROs do Brasil' },
      { src: 'images/forbes/chros/02.jpg', label: 'Patrocínio Principal · Gupy' },
      { src: 'images/forbes/chros/03.jpg', label: 'Destaque da Lista' },
      { src: 'images/forbes/chros/04.jpg', label: 'Infográfico de Mercado' },
      { src: 'images/forbes/chros/05.jpg', label: 'Contra-Capa Institucional' },
    ]
  },
  denza: {
    title: 'Technology Drives Elegance',
    tag: 'Forbes × Denza',
    bg: 'linear-gradient(135deg,#1a0a2e,#0d1b2a)',
    slides: [
      { src: 'images/forbes/denza/01.jpg', label: 'Capa · Denza' },
      { src: 'images/forbes/denza/02.jpg', label: 'Conceito de Marca' },
      { src: 'images/forbes/denza/03.jpg', label: 'Spread Editorial' },
      { src: 'images/forbes/denza/04.jpg', label: 'Destaque de Produto' },
      { src: 'images/forbes/denza/05.jpg', label: 'Encerramento Institucional' },
    ]
  },
  porto: {
    title: 'Evento Porto Seguro',
    tag: 'Forbes × Porto Seguro',
    bg: 'linear-gradient(135deg,#001A3A,#002D6A)',
    slides: [
      { src: 'images/forbes/porto/01.jpg', label: 'Convite do Evento' },
      { src: 'images/forbes/porto/02.jpg', label: 'Programação Editorial' },
      { src: 'images/forbes/porto/03.jpg', label: 'Palco e Cenografia' },
      { src: 'images/forbes/porto/04.jpg', label: 'Registro Fotográfico' },
      { src: 'images/forbes/porto/05.jpg', label: 'Pós-evento · Destaques' },
    ]
  },
  under30: {
    title: 'Under30 Styling da Lista',
    tag: 'Forbes × Oakley',
    bg: 'linear-gradient(135deg,#0d0d0d,#1a1a1a)',
    slides: [
      { src: 'images/forbes/under30/01.jpg', label: 'Capa Under 30' },
      { src: 'images/forbes/under30/02.jpg', label: 'Parceria Oakley' },
      { src: 'images/forbes/under30/03.jpg', label: 'Styling Editorial' },
      { src: 'images/forbes/under30/04.jpg', label: 'Spreads de Lista' },
      { src: 'images/forbes/under30/05.jpg', label: 'Ativação de Marca' },
    ]
  },
  mulheres: {
    title: 'Mulheres Poderosas do Brasil',
    tag: 'Forbes × Tanqueray',
    bg: 'linear-gradient(135deg,#3A0050,#6B1080)',
    slides: [
      { src: 'images/forbes/mulheres/01.jpg', label: 'Capa da Lista' },
      { src: 'images/forbes/mulheres/02.jpg', label: 'Patrocínio Tanqueray' },
      { src: 'images/forbes/mulheres/03.jpg', label: 'Perfis Editoriais' },
      { src: 'images/forbes/mulheres/04.jpg', label: 'Spreads de Destaque' },
      { src: 'images/forbes/mulheres/05.jpg', label: 'Ativação de Evento' },
    ]
  },
  gwm: {
    title: 'Anúncio de Capa Flap',
    tag: 'Forbes × GWM',
    bg: 'linear-gradient(135deg,#0A1628,#1C2E50)',
    slides: [
      { src: 'images/forbes/gwm/01.jpg', label: 'Flap Capa — Aberto' },
      { src: 'images/forbes/gwm/02.jpg', label: 'Flap Capa — Fechado' },
      { src: 'images/forbes/gwm/03.jpg', label: 'Layout Interior' },
      { src: 'images/forbes/gwm/04.jpg', label: 'Destaque de Produto' },
      { src: 'images/forbes/gwm/05.jpg', label: 'Especificações Técnicas' },
    ]
  },
  carmed: {
    title: 'Launch Coverage',
    tag: 'Forbes × Carmed',
    bg: 'linear-gradient(135deg,#B00020,#E8001A)',
    slides: [
      { src: 'images/forbes/carmed/01.jpg', label: 'Cobertura de Lançamento' },
      { src: 'images/forbes/carmed/02.jpg', label: 'Co-branding Coca-Cola' },
      { src: 'images/forbes/carmed/03.jpg', label: 'Spreads Editoriais' },
      { src: 'images/forbes/carmed/04.jpg', label: 'Ativação Digital' },
      { src: 'images/forbes/carmed/05.jpg', label: 'Campanha Integrada' },
    ]
  },
  topcreators: {
    title: 'Forbes Top Creators',
    tag: 'Forbes × Picpay',
    bg: 'linear-gradient(135deg,#0d0d1a,#1a1a2e)',
    slides: [
      { src: 'images/forbes/topcreators/01.jpg', label: 'Capa Top Creators' },
      { src: 'images/forbes/topcreators/02.jpg', label: 'Patrocínio Picpay' },
      { src: 'images/forbes/topcreators/03.jpg', label: 'Ranking Editorial' },
      { src: 'images/forbes/topcreators/04.jpg', label: 'Perfis de Destaque' },
      { src: 'images/forbes/topcreators/05.jpg', label: 'Conteúdo Digital' },
    ]
  },
  radio: {
    title: 'CEO Insights — Forbes Rádio',
    tag: 'Forbes × Range Rover',
    bg: 'linear-gradient(135deg,#1a0505,#3A0A0A)',
    slides: [
      { src: 'images/forbes/radio/01.jpg', label: 'Identidade do Programa' },
      { src: 'images/forbes/radio/02.jpg', label: 'Parceria Range Rover' },
      { src: 'images/forbes/radio/03.jpg', label: 'Arte de Episódio' },
      { src: 'images/forbes/radio/04.jpg', label: 'Publicidade Integrada' },
      { src: 'images/forbes/radio/05.jpg', label: 'Campanha de Mídia' },
    ]
  },
};

const lightbox   = document.getElementById('lightbox');
const lbTrack    = document.getElementById('lbTrack');
const lbTitle    = document.getElementById('lbTitle');
const lbTag      = document.getElementById('lbTag');
const lbDots     = document.getElementById('lbDots');
const lbCounter  = document.getElementById('lbCounter');
const pageWrap   = document.getElementById('page-wrap');

let lbCur = 0;
let lbTotal = 0;

function openLightbox(key) {
  const data = projectData[key];
  if (!data) return;
  lbCur = 0;
  lbTotal = data.slides.length;
  lbTitle.textContent = data.title;
  lbTag.textContent = data.tag;

  lbTrack.innerHTML = '';
  data.slides.forEach((slide, i) => {
    const s = document.createElement('div');
    s.className = 'lightbox-slide';
    s.style.background = data.bg;
    s.innerHTML = `<div class="lightbox-slide-placeholder"><span class="lb-ph-label">${slide.label}</span><span class="lb-ph-sub">${data.tag} · ${i + 1} / ${lbTotal}</span></div>`;
    const img = document.createElement('img');
    img.src = slide.src;
    img.alt = slide.label;
    img.onload = () => { s.innerHTML = ''; s.appendChild(img); };
    lbTrack.appendChild(s);
  });

  buildLbDots();
  moveLb();
  lightbox.classList.add('open');
  pageWrap.classList.add('blurred');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  pageWrap.classList.remove('blurred');
  document.body.style.overflow = '';
}

function buildLbDots() {
  lbDots.innerHTML = '';
  for (let i = 0; i < lbTotal; i++) {
    const d = document.createElement('div');
    d.className = 'lightbox-dot' + (i === lbCur ? ' active' : '');
    lbDots.appendChild(d);
  }
}

function moveLb() {
  lbTrack.style.transform = `translateY(-${lbCur * 100}%)`;
  buildLbDots();
  lbCounter.textContent = `${lbCur + 1} / ${lbTotal}`;
}

document.getElementById('lbNext').addEventListener('click', () => {
  lbCur = lbCur >= lbTotal - 1 ? 0 : lbCur + 1;
  moveLb();
});
document.getElementById('lbPrev').addEventListener('click', () => {
  lbCur = lbCur <= 0 ? lbTotal - 1 : lbCur - 1;
  moveLb();
});
document.getElementById('lbClose').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowDown') { lbCur = lbCur >= lbTotal - 1 ? 0 : lbCur + 1; moveLb(); }
  if (e.key === 'ArrowUp')   { lbCur = lbCur <= 0 ? lbTotal - 1 : lbCur - 1; moveLb(); }
});

let lbTouchY = 0;
lbTrack.addEventListener('touchstart', e => { lbTouchY = e.touches[0].clientY; }, { passive: true });
lbTrack.addEventListener('touchend', e => {
  const diff = lbTouchY - e.changedTouches[0].clientY;
  if (Math.abs(diff) > 40) {
    if (diff > 0) { lbCur = lbCur >= lbTotal - 1 ? 0 : lbCur + 1; }
    else          { lbCur = lbCur <= 0 ? lbTotal - 1 : lbCur - 1; }
    moveLb();
  }
});

document.querySelectorAll('.carousel-card[data-project]').forEach(card => {
  card.addEventListener('click', () => openLightbox(card.dataset.project));
});
