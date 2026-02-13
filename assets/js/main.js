// Initialize ScrollReveal
const sr = ScrollReveal({
    origin: 'bottom',
    distance: '30px',
    duration: 800,
    delay: 100,
    reset: false // Animations happen once
});

// Hero Elements
sr.reveal('.profile-pic', { delay: 100 });
sr.reveal('.hero-text', { delay: 200 });

// Section Titles
sr.reveal('.section-title', { delay: 100 });

// About Grid
sr.reveal('.about-text', { delay: 200 });
sr.reveal('.area-card', { interval: 150 });

// Skills
sr.reveal('.skill-category', { interval: 100 });

// Experience Timeline
sr.reveal('.timeline-item', { interval: 100 });

// Projects & Awards
sr.reveal('.project-card', { interval: 100 });
sr.reveal('.award-card', { interval: 100 });