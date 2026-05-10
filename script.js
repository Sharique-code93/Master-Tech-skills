/* site script: accessible nav, reveal animations, hero effects, upcoming events sliding */

/* Utility helpers */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from((ctx || document).querySelectorAll(sel));
const isReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* NAVIGATION MODULE */
(function initNav() {
  const navToggle = $('.nav-toggle');
  const nav = $('.site-nav');
  const navList = nav?.querySelector('ul');
  if (!navToggle || !nav || !navList) return;

  const navId = navList.id || `site-nav-list`;
  navList.id = navId;
  navToggle.setAttribute('aria-controls', navId);
  navToggle.setAttribute('aria-expanded', navToggle.getAttribute('aria-expanded') || 'false');

  const focusableSelector = 'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const getFocusable = () => $$(focusableSelector, nav);

  function openNav() {
    nav.classList.add('open');
    navToggle.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.documentElement.classList.add('nav-open');
    const first = getFocusable()[0];
    if (first) first.focus();
    document.addEventListener('focus', trapFocus, true);
  }

  function closeNav(returnFocus = true) {
    nav.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('nav-open');
    document.removeEventListener('focus', trapFocus, true);
    if (returnFocus) navToggle.focus();
  }

  function trapFocus(e) {
    if (!nav.classList.contains('open')) return;
    if (!nav.contains(e.target) && e.target !== navToggle) {
      e.stopPropagation();
      const first = getFocusable()[0];
      if (first) first.focus();
    }
  }

  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    if (expanded) closeNav();
    else openNav();
  });

  navToggle.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      navToggle.click();
    } else if (ev.key === 'Escape') {
      closeNav();
    }
  });

  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && nav.classList.contains('open')) {
      closeNav();
    }
  });

  nav.addEventListener('click', (ev) => {
    const anchor = ev.target.closest('a');
    if (!anchor) return;
    if (nav.classList.contains('open')) {
      closeNav();
    }
  });

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 900 && nav.classList.contains('open')) {
        closeNav(false);
      }
    }, 150);
  }, { passive: true });
})();

/* INTERSECTION OBSERVER FOR FADE UP WITH STAGGER */
(function initFadeUp() {
  const fadeElements = $$('.fade-up');
  if (!fadeElements.length) return;

  if (isReducedMotion) {
    fadeElements.forEach(el => el.classList.add('show'));
    return;
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const parent = el.parentElement;
        if (parent) {
          const siblings = Array.from(parent.querySelectorAll('.fade-up'));
          const idx = siblings.indexOf(el);
          if (idx >= 0) el.classList.add(`stagger-${Math.min(6, idx + 1)}`);
        }
        el.classList.add('show');
        obs.unobserve(el);
      });
    }, { threshold: 0.12 });

    fadeElements.forEach(el => observer.observe(el));
  } else {
    fadeElements.forEach(el => el.classList.add('show'));
  }
})();

/* HERO EFFECTS MODULE */
(function heroEffects() {
  const heroRight = $('.hero-right');
  const heroImg = heroRight ? heroRight.querySelector('img') : null;
  const cta = $('.btn.primary');

  if (heroRight) {
    const heroObserver = ('IntersectionObserver' in window) ? new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          heroRight.classList.add('parallax', 'show');
        } else {
          heroRight.classList.remove('parallax', 'show');
        }
      });
    }, { threshold: 0.2 }) : null;

    if (heroObserver) heroObserver.observe(heroRight);
    else heroRight.classList.add('show');
  }

  if (heroImg && !isReducedMotion) {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const rect = heroImg.getBoundingClientRect();
        const viewportCenter = window.innerHeight / 2;
        const distance = rect.top + rect.height / 2 - viewportCenter;
        const maxShift = 12;
        const shift = Math.max(-maxShift, Math.min(maxShift, -distance * 0.02));
        heroImg.style.transform = `translateY(${shift}px) scale(${1 + Math.abs(shift) * 0.0008})`;
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  if (cta && !isReducedMotion) {
    const pulseDelay = 1200;
    const pulseTimeout = setTimeout(() => cta.classList.add('pulse'), pulseDelay);
    const removePulse = () => {
      cta.classList.remove('pulse');
      clearTimeout(pulseTimeout);
    };
    cta.addEventListener('mouseenter', removePulse, { once: true });
    cta.addEventListener('focus', removePulse, { once: true });
  }
})();

/* UPCOMING EVENTS: sliding reveal with stagger and alternating directions (DE-DUPED) */
(function initUpcomingEvents() {
  const eventCards = $$('.events-grid .event-card');
  if (!eventCards.length) return;

  if (isReducedMotion) {
    eventCards.forEach(el => el.classList.add('slide-in'));
    return;
  }

  // Assign alternating directions for visual variety
  eventCards.forEach((el, i) => {
    const dir = (i % 2 === 0) ? 'dir-left' : 'dir-right';
    el.classList.add(dir);
  });

  // IntersectionObserver to slide in cards with stagger
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const all = Array.from(document.querySelectorAll('.events-grid .event-card'));
        const idx = all.indexOf(el);
        const staggerIndex = Math.min(8, idx + 1);
        el.classList.add(`stagger-${staggerIndex}`);
        requestAnimationFrame(() => {
          el.classList.add('slide-in');
        });
        obs.unobserve(el);
      });
    }, { threshold: 0.12 });

    eventCards.forEach(el => observer.observe(el));
  } else {
    eventCards.forEach((el, i) => {
      el.classList.add(`stagger-${Math.min(8, i + 1)}`, 'slide-in');
    });
  }

  // keyboard: allow Enter to "activate" card (for accessibility)
  eventCards.forEach(card => {
    card.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        card.classList.add('focus-activated');
        setTimeout(() => card.classList.remove('focus-activated'), 600);
      }
    });
  });
})();

/* RESPECT REDUCED MOTION (fallback) */
if (isReducedMotion) {
  $$('.fade-up').forEach(el => {
    el.style.transition = 'none';
    el.classList.add('show');
  });
}

/* PREVENT HORIZONTAL OVERFLOW */
(function removeHorizontalOverflow() {
  document.documentElement.style.overflowX = 'hidden';
  document.body.style.overflowX = 'hidden';
})();
