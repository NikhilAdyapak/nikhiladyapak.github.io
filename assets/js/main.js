/* --- Scroll Reveal Animation --- */
const sr = ScrollReveal({
    origin: 'bottom',
    distance: '30px',
    duration: 1000,
    delay: 100,
    reset: false // Keeps element visible once revealed
});

sr.reveal('.hero-content');
sr.reveal('.about-grid', { delay: 200 });
sr.reveal('.timeline-item', { interval: 150 }); // Staggered
sr.reveal('.project-card', { interval: 150 });
sr.reveal('.comm-card', { interval: 150 });
sr.reveal('.badge-row', { interval: 100 });

/* --- Dynamic Year --- */
document.getElementById('year').textContent = new Date().getFullYear();

/* --- Back to Top Button --- */
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

/* --- Active Link Highlighter --- */
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active-link');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active-link');
        }
    });
});