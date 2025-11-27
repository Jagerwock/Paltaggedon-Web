const qs = (s, p = document) => p.querySelector(s);
const qsa = (s, p = document) => [...p.querySelectorAll(s)];
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const header = qs('.site-header');
const onScrollHeader = () => header?.setAttribute('data-scrolled', window.scrollY > 10);
onScrollHeader();
window.addEventListener('scroll', onScrollHeader);

const navToggle = qs('.nav-toggle');
const menu = qs('#menu');
if (navToggle && menu) {
  navToggle.addEventListener('click', () => {
    const open = menu.getAttribute('data-open') === 'true';
    menu.setAttribute('data-open', String(!open));
    navToggle.setAttribute('aria-expanded', String(!open));
  });
}

const parallaxHero = qs('#parallaxHero');
const parallax = () => {
  if (!parallaxHero || prefersReduced) return;
  const offset = window.scrollY * 0.15;
  parallaxHero.style.transform = `translateY(${offset}px)`;
};
window.addEventListener('scroll', parallax, { passive: true });

const reveals = qsa('.reveal, .card, .feature');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.animation = 'fadeUp .9s ease forwards';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  reveals.forEach(el => io.observe(el));
} else {
  reveals.forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}

const logo = qs('#logo .brand-word');
let logoPlayed = false;
const restartLogo = () => {
  if (!logo || logoPlayed) return;
  if (window.scrollY < 24) {
    logo.style.animation = 'none';
    void logo.offsetHeight;
    logo.style.animation = 'squash 1.1s ease-out .2s both, bounce 2.4s ease-in-out 1.2s infinite';
    logoPlayed = true;
  }
};
window.addEventListener('load', restartLogo);
window.addEventListener('scroll', restartLogo, { passive: true });

const openBackdrop = (backdrop) => {
  if (!backdrop) return;
  backdrop.classList.add('active');
  backdrop.setAttribute('aria-hidden', 'false');
  const focusable = qsa('button, [href], iframe, input, select, textarea, [tabindex]:not([tabindex="-1"])', backdrop);
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const keyHandler = (e) => {
    if (e.key === 'Escape') closeBackdrop(backdrop);
    if (e.key === 'Tab' && focusable.length > 1) {
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };
  backdrop.dataset.keyHandler = 'true';
  backdrop.addEventListener('keydown', keyHandler);
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeBackdrop(backdrop); });
  first?.focus();
};
const closeBackdrop = (backdrop) => {
  if (!backdrop) return;
  backdrop.classList.remove('active');
  backdrop.setAttribute('aria-hidden', 'true');
  const clone = backdrop.cloneNode(true);
  backdrop.parentNode.replaceChild(clone, backdrop);
};

const enemyModal = qs('#enemyModal');
const modalTitle = qs('#modalTitle', enemyModal);
const modalDesc = qs('#modalDesc', enemyModal);
const modalSprite = qs('#modalSprite', enemyModal);
const modalAbility = qs('#modalAbility', enemyModal);

qsa('.enemy-card').forEach(card => {
  card.addEventListener('click', () => {
    modalTitle.textContent = card.dataset.name || 'Enemigo';
    modalDesc.textContent = card.dataset.desc || '';
    modalSprite.src = card.dataset.sprite || '';
    modalSprite.alt = `Sprite de ${card.dataset.name || 'enemigo'}`;
    modalAbility.textContent = card.dataset.ability || '';
    openBackdrop(enemyModal);
  });
});

document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-close-modal]');
  if (!btn) return;
  const backdrop = btn.closest('.modal-backdrop');
  closeBackdrop(backdrop);
});

const trailerBtn = qs('#playTrailer');
const trailerModal = qs('#trailerModal');
const trailerFrame = qs('#trailerFrame');

if (trailerBtn) {
  trailerBtn.addEventListener('click', () => {
    const url = '';
    trailerFrame.src = url;
    openBackdrop(trailerModal);
  });
}

document.addEventListener('click', (e) => {
  const isClose = e.target.closest('[data-close-modal]');
  const backdrop = isClose?.closest('#trailerModal');
  if (backdrop) { trailerFrame.src = ''; }
});

const mkPulse = () => {
  if (prefersReduced) return;
  const pulse = document.createElement('div');
  pulse.className = 'trailer-pulse';
  document.body.appendChild(pulse);
  setTimeout(() => pulse.remove(), 900);
};
trailerBtn?.addEventListener('click', mkPulse);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') document.body.classList.add('user-is-tabbing');
});