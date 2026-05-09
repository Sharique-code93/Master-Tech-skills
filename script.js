// SCROLL ANIMATION
const elements = document.querySelectorAll('.fade-up');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.classList.add('show');
        }
    });
});

elements.forEach(el => observer.observe(el));


<script>
  const header = document.querySelector('header');
  const navToggle = document.querySelector('.nav-toggle');

  if(navToggle){
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      header.classList.toggle('nav-open');
    });

    // close nav when a link is clicked (mobile)
    document.querySelectorAll('nav a').forEach(a => {
      a.addEventListener('click', () => {
        if(header.classList.contains('nav-open')){
          header.classList.remove('nav-open');
          navToggle.setAttribute('aria-expanded','false');
        }
      });
    });
  }

  // optional: close nav on Escape
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && header.classList.contains('nav-open')){
      header.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded','false');
    }
  });
</script>


<script>
  (function(){
    const header = document.querySelector('header');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelectorAll('nav a');

    if(!navToggle) return;

    navToggle.addEventListener('click', () => {
      const isOpen = header.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when a nav link is clicked (mobile)
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if(header.classList.contains('nav-open')){
          header.classList.remove('nav-open');
          navToggle.setAttribute('aria-expanded','false');
        }
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if(e.key === 'Escape' && header.classList.contains('nav-open')){
        header.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded','false');
      }
    });
  })();
</script>


