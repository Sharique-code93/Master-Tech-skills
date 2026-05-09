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

// Intersection Observer for fade-up elements with stagger
const fadeElements = document.querySelectorAll('.fade-up');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // add stagger classes based on index among siblings
        const el = entry.target;
        const parent = el.parentElement;
        if (parent) {
          const siblings = Array.from(parent.querySelectorAll('.fade-up'));
          const idx = siblings.indexOf(el);
          if (idx >= 0) {
            el.classList.add(`stagger-${Math.min(3, idx + 1)}`);
          }
        }
        el.classList.add('show');
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.12 });

  fadeElements.forEach(el => observer.observe(el));
} else {
  // Fallback: reveal all
  fadeElements.forEach(el => el.classList.add('show'));
}

// Hero parallax on scroll (subtle) and CTA pulse control
(function heroEffects() {
  const heroRight = document.querySelector('.hero-right');
  const heroImg = heroRight ? heroRight.querySelector('img') : null;
  const cta = document.querySelector('.btn.primary');

  // Add parallax class when hero enters viewport
  if (heroRight) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          heroRight.classList.add('parallax', 'show');
        } else {
          heroRight.classList.remove('parallax', 'show');
        }
      });
    }, { threshold: 0.2 });
    heroObserver.observe(heroRight);
  }

  // subtle parallax movement on scroll (only if prefers-reduced-motion is false)
  if (heroImg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = heroImg.getBoundingClientRect();
          // compute small translate based on viewport center
          const viewportCenter = window.innerHeight / 2;
          const distance = rect.top + rect.height / 2 - viewportCenter;
          const maxShift = 12; // px
          const shift = Math.max(-maxShift, Math.min(maxShift, -distance * 0.02));
          heroImg.style.transform = `translateY(${shift}px) scale(${1 + Math.abs(shift) * 0.0008})`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // Add pulse to CTA after hero fully shows (subtle attention)
  if (cta && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // add pulse class after a short delay so it doesn't distract immediately
    setTimeout(() => {
      cta.classList.add('pulse');
    }, 1200);

    // remove pulse when user interacts with CTA
    cta.addEventListener('mouseenter', () => cta.classList.remove('pulse'));
    cta.addEventListener('focus', () => cta.classList.remove('pulse'));
  }
})();

// Respect reduced motion: ensure animations disabled if user prefers
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
