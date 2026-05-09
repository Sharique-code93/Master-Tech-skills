// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');

navToggle.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true' || false;
  navToggle.setAttribute('aria-expanded', !expanded);
  navToggle.classList.toggle('open');
  siteNav.classList.toggle('open');
});

// Close mobile nav when a link is clicked (good UX)
document.querySelectorAll('.site-nav a').forEach(a => {
  a.addEventListener('click', () => {
    if (siteNav.classList.contains('open')) {
      siteNav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

// Intersection Observer for fade-up elements
const elements = document.querySelectorAll('.fade-up');

const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

elements.forEach(el => observer.observe(el));

// Optional: reduce motion respect
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
if (prefersReduced.matches) {
  document.querySelectorAll('.fade-up').forEach(el => {
    el.style.transition = 'none';
    el.classList.add('show');
  });
}
