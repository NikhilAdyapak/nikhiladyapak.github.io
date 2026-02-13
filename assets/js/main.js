const sr = ScrollReveal({
    origin: 'bottom',
    distance: '30px',
    duration: 800,
    delay: 100,
    reset: false
});

sr.reveal('.hero-content', {});
sr.reveal('.about-grid', { delay: 200 });
sr.reveal('.timeline-item', { interval: 100 });
sr.reveal('.project-card', { interval: 100 });
sr.reveal('.comm-card', { interval: 100 });