// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('nav');

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navToggle.classList.toggle('open');
    nav.classList.toggle('open');
  });

  // Close mobile nav when a link is clicked
  document.querySelectorAll('nav a').forEach(a => {
    a.addEventListener('click', () => {
      if (nav.classList.contains('open')) {
        nav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

// Intersection Observer for fade-up elements
const elements = document.querySelectorAll('.fade-up');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
} else {
  // Fallback: reveal all
  elements.forEach(el => el.classList.add('show'));
}

// Respect reduced motion
if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.fade-up').forEach(el => {
    el.style.transition = 'none';
    el.classList.add('show');
  });
}

// Extra safety: prevent accidental horizontal scroll
(function removeHorizontalOverflow() {
  document.documentElement.style.overflowX = 'hidden';
  document.body.style.overflowX = 'hidden';
})();
