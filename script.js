// SCROLL ANIMATION
const elements = document.querySelectorAll('.fade-up, .fade-left, .fade-right');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.classList.add('show');
        }
    });
}, {threshold: 0.2});

elements.forEach(el => observer.observe(el));


// NAVBAR SHADOW ON SCROLL
window.addEventListener("scroll", () => {
    const nav = document.getElementById("navbar");

    if (window.scrollY > 50) {
        nav.style.background = "rgba(0,0,0,0.7)";
    } else {
        nav.style.background = "rgba(0,0,0,0.3)";
    }
});
