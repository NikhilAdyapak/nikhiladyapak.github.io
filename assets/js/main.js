// Simple Scroll Reveal
const sr = ScrollReveal({
    origin: 'bottom',
    distance: '30px',
    duration: 800,
    delay: 100,
    reset: false
});

sr.reveal('.hero-text', {});
sr.reveal('.profile-pic', { delay: 200 });
sr.reveal('.about-grid', { delay: 200 });
sr.reveal('.timeline-item', { interval: 100 });
sr.reveal('.project-card', { interval: 100 });
sr.reveal('.badges-grid', { delay: 100 });