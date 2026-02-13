// 1. TYPING ANIMATION
var typed = new Typed(".typewriter", {
    strings: ["Scalable ML Systems", "MLOps Pipelines", "Distributed AI", "Cloud Infrastructure"],
    typeSpeed: 50,
    backSpeed: 30,
    loop: true
});

// 2. SCROLL REVEAL ANIMATION
const sr = ScrollReveal({
    origin: 'bottom',
    distance: '50px',
    duration: 1000,
    delay: 200,
    reset: false // Animations run only once for better performance
});

// Header
sr.reveal('.hero-content', {delay: 100});

// About
sr.reveal('.section-title', {});
sr.reveal('.about-content p', {delay: 200});
sr.reveal('.area-card', {interval: 200});

// Skills
sr.reveal('.skill-category', {interval: 100});

// Experience & Projects
sr.reveal('.timeline-item', {interval: 200});
sr.reveal('.project-card', {interval: 200});
sr.reveal('.vol-card', {interval: 200});

// 3. SMOOTH SCROLLING
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});