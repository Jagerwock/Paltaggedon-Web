// ===== Parallax Hero =====
const parallaxHero = document.getElementById('parallaxHero');
window.addEventListener('scroll', () => {
  const offset = window.scrollY * 0.15;
  parallaxHero.style.transform = `translateY(${offset}px)`;
});

// ===== Intersection Reveals =====
const reveals = document.querySelectorAll('.reveal, .card, .feature');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeUp 0.9s ease forwards';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
reveals.forEach(el => observer.observe(el));

// ===== Modal Logic =====
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalSprite = document.getElementById('modalSprite');
const modalAbility = document.getElementById('modalAbility');
const closeBtn = modal.querySelector('.modal-close');

document.querySelectorAll('.enemy-card').forEach(card => {
  card.addEventListener('click', () => {
    modalTitle.textContent = card.dataset.name;
    modalDesc.textContent = card.dataset.desc;
    modalSprite.src = card.dataset.sprite;
    modalAbility.textContent = card.dataset.ability;
    modal.classList.add('active');
  });
});

const closeModal = () => modal.classList.remove('active');
closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

// ===== Hero Trailer Button (micro interaction) =====
document.getElementById('playTrailer').addEventListener('click', () => {
  const pulse = document.createElement('div');
  pulse.className = 'trailer-pulse';
  document.body.appendChild(pulse);
  setTimeout(() => pulse.remove(), 1000);
  alert('🎬 El trailer se reproducirá pronto. ¡Mantente atento!');
});

// ===== Floating logo bounce reset on scroll top =====
const logo = document.getElementById('logo');
window.addEventListener('scroll', () => {
  if (window.scrollY < 30) {
    logo.style.animation = 'none';
    void logo.offsetHeight; // restart
    logo.style.animation = 'squash 1.2s ease-out, bounce 2.4s ease-in-out infinite';
  }
});
