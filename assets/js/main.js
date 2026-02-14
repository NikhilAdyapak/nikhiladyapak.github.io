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

/* --- Typewriter Effect --- */
const roles = [
    "Scalable ML Systems",
    "Cloud Infrastructure",
    "Distributed AI",
    "Production MLOps"
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typeSpeed = 100;
const deleteSpeed = 50;
const delayBetween = 2000;

function typeWriter() {
    const currentRole = roles[roleIndex];
    const element = document.querySelector('.typewriter');
    
    if (isDeleting) {
        element.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        element.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    let speed = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIndex === currentRole.length) {
        speed = delayBetween; // Pause at end
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        speed = 500; // Pause before next word
    }

    setTimeout(typeWriter, speed);
}

// Start the animation
document.addEventListener('DOMContentLoaded', typeWriter);