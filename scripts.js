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

const enemyModal = document.getElementById('enemyModal');
const codexTitle = document.getElementById('codexTitle');
const codexScientific = document.getElementById('codexScientific');
const codexSummary = document.getElementById('codexSummary');
const codexAbility = document.getElementById('codexAbility');
const codexTraits = document.getElementById('codexTraits');
const codexSprite = document.getElementById('codexSprite');
const codexVariantLabel = document.getElementById('codexVariantLabel');

const variantButtons = Array.from(document.querySelectorAll('.variant-btn'));
const btnPrev = document.querySelector('.codex-prev');
const btnNext = document.querySelector('.codex-next');

const enemyCards = Array.from(document.querySelectorAll('.enemy-card'));
const ORDER = enemyCards.map(el => el.dataset.id);
let currentIndex = 0;
let currentVariant = 'base';

function populateCodex(id){
  const data = CODEX[id];
  if(!data) return;

  const v = data.variants[currentVariant] || data.variants.base;

  codexTitle.textContent = data.common;
  codexScientific.textContent = data.scientific;
  codexSummary.textContent = v.summary;
  codexAbility.textContent = v.ability;

  codexTraits.innerHTML = '';
  (v.traits || []).forEach(t => {
    const li = document.createElement('li');
    li.textContent = t;
    codexTraits.appendChild(li);
  });

  codexSprite.src = v.sprite;
  codexSprite.alt = `Sprite de ${data.common} (${v.label})`;
  codexVariantLabel.textContent = v.label;

  variantButtons.forEach(b => b.setAttribute('aria-selected', String(b.dataset.variant === currentVariant)));
}

function openCodexAt(index){
  currentIndex = (index + ORDER.length) % ORDER.length;
  currentVariant = 'base';
  populateCodex(ORDER[currentIndex]);
  openBackdrop(enemyModal);
}

function nextEnemy(){
  openCodexAt(currentIndex + 1);
}
function prevEnemy(){
  openCodexAt(currentIndex - 1);
}

enemyCards.forEach((card, i) => {
  card.addEventListener('click', () => openCodexAt(i));
});

variantButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    currentVariant = btn.dataset.variant;
    populateCodex(ORDER[currentIndex]);
  });
});

btnNext.addEventListener('click', nextEnemy);
btnPrev.addEventListener('click', prevEnemy);

enemyModal.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') { e.preventDefault(); nextEnemy(); }
  if (e.key === 'ArrowLeft')  { e.preventDefault(); prevEnemy(); }
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

const CODEX = {
  tomatello: {
    common: "Tomatello",
    scientific: "Solanum croonerii",
    variants: {
      base: {
        summary: "Hola que tal.",
        ability: "Hola que tal.",
        traits: ["Camina"],
        sprite: "assets/tomatello.gif",
        label: "Base"
      },
      elite: {
        summary: "Hola que tal.",
        ability: "Hola que tal.",
        traits: ["Camina"],
        sprite: "assets/tomatello_elite.gif",
        label: "Élite"
      },
      legendary: {
        summary: "Hola que tal.",
        ability: "Hola que tal.",
        traits: ["Camina"],
        sprite: "assets/tomatello_legend.gif",
        label: "Legendario"
      }
    }
  },
  limonion: {
    common: "Limoñón",
    scientific: "Citrus brassii",
    variants: {
      base: {
        summary: "Hola que tal.",
        ability: "Hola que tal.",
        traits: ["Camina"],
        sprite: "assets/limonion.gif",
        label: "Base"
      },
      elite: {
        summary: "Hola que tal.",
        ability: "Hola que tal.",
        traits: ["Camina"],
        sprite: "assets/limonion_elite.gif",
        label: "Élite"
      },
      legendary: {
        summary: "Hola que tal.",
        ability: "Hola que tal.",
        traits: ["Camina"],
        sprite: "assets/limonion_legend.gif",
        label: "Legendario"
      }
    }
  },
  uvarumba: {
    common: "UvaRumba",
    scientific: "Vitis choreae",
    variants: {
      base: {
        summary: "Hola que tal.",
        ability: "Hola que tal.",
        traits: ["Camina"],
        sprite: "assets/uvarumba.gif",
        label: "Base"
      },
      elite: {
        summary: "Hola que tal.",
        ability: "Hola que tal.",
        traits: ["Camina"],
        sprite: "assets/uvarumba_elite.gif",
        label: "Élite"
      },
      legendary: {
        summary: "Hola que tal.",
        ability: "Hola que tal.",
        traits: ["Camina"],
        sprite: "assets/uvarumba_legend.gif",
        label: "Legendario"
      }
    }
  },
  choclopop: {
    common: "ChocloPop",
    scientific: "Zea percussio",
    variants: {
      base: {
        summary: "Hola que tal.",
        ability: "Hola que tal.",
        traits: ["Camina"],
        sprite: "assets/choclopop.gif",
        label: "Base"
      },
      elite: {
        summary: "Hola que tal.",
        ability: "Hola que tal.",
        traits: ["Camina"],
        sprite: "assets/choclopop_elite.gif",
        label: "Élite"
      },
      legendary: {
        summary: "Hola que tal.",
        ability: "Hola que tal.",
        traits: ["Camina"],
        sprite: "assets/choclopop_legend.gif",
        label: "Legendario"
      }
    }
  },
  megapaya: {
    common: "Megapaya",
    scientific: "Carica colossi",
    variants: {
      base: {
        summary: "Hola que tal.",
        ability: "Hola que tal.",
        traits: ["Camina"],
        sprite: "assets/megapaya.gif",
        label: "Base"
      },
      elite: {
        summary: "Hola que tal.",
        ability: "Hola que tal.",
        traits: ["Camina"],
        sprite: "assets/megapaya_elite.gif",
        label: "Élite"
      },
      legendary: {
        summary: "Hola que tal.",
        ability: "Hola que tal.",
        traits: ["Camina"],
        sprite: "assets/megapaya_legend.gif",
        label: "Legendario"
      }
    }
  }
};