const sr = ScrollReveal({
    origin: 'bottom',
    distance: '20px',
    duration: 1000,
    delay: 100,
    reset: false
});

sr.reveal('.hero-content');
sr.reveal('.about-grid', { delay: 200 });
sr.reveal('.timeline-item', { interval: 100 });
sr.reveal('.project-card', { interval: 100 });
sr.reveal('.comm-card', { interval: 100 });
sr.reveal('.badge-row', { interval: 100 });

document.getElementById('year').textContent = new Date().getFullYear();