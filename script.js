/* NAV TOGGLE */
const toggle = document.getElementById("toggle");
const nav = document.getElementById("nav");

toggle.addEventListener("click", ()=>{
nav.classList.toggle("open");
});

/* SCROLL ANIMATION */
const observer = new IntersectionObserver(entries=>{
entries.forEach(entry=>{
if(entry.isIntersecting){
entry.target.classList.add("show");
}
});
});

document.querySelectorAll(".fade").forEach(el=>{
observer.observe(el);
});
