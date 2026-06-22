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
  cur = cur >= maxIdx() ? 0 : cur + 1; updateCarousel();
});
document.getElementById('prevBtn').addEventListener('click', () => {
  cur = cur <= 0 ? maxIdx() : cur - 1; updateCarousel();
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
    updateCarousel();
  }
});

buildDots();
updateCarousel();

// Auto-advance
setInterval(() => {
  cur = cur >= maxIdx() ? 0 : cur + 1; updateCarousel();
}, 5000);

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObs.observe(el));
