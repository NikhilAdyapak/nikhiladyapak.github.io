/* ==========================================================
   NIKHIL ADYAPAK - PORTFOLIO v8 interactions
   (vanilla JS, no libraries)
   ========================================================== */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* --- Background spotlight that follows the cursor --- */
const spotlight = document.getElementById('spotlight');

if (spotlight && canHover && !reduceMotion) {
    let pending = false;
    window.addEventListener('mousemove', (e) => {
        if (pending) return;
        pending = true;
        requestAnimationFrame(() => {
            spotlight.style.background =
                `radial-gradient(650px at ${e.clientX}px ${e.clientY}px, rgba(88, 166, 255, 0.08), transparent 80%)`;
            pending = false;
        });
    });
}

/* --- Hero depth parallax (photo and text drift at different rates) --- */
const heroEl = document.getElementById('hero');
const depth1 = document.querySelector('.depth-1');
const depth2 = document.querySelector('.depth-2');

if (heroEl && depth1 && depth2 && canHover && !reduceMotion) {
    heroEl.addEventListener('mousemove', (e) => {
        const r = heroEl.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        depth1.style.transform = `translate(${x * 18}px, ${y * 14}px)`;
        depth2.style.transform = `translate(${x * 8}px, ${y * 6}px)`;
    });
    heroEl.addEventListener('mouseleave', () => {
        depth1.style.transform = '';
        depth2.style.transform = '';
    });
}

/* --- Journey strip: career overview; click a stop to jump to that role --- */
const journeyNodes = document.querySelectorAll('.journey-node');
const journeyFill = document.getElementById('journeyFill');

function updateJourneyFill(activeNode) {
    if (!journeyFill || !activeNode) return;
    const journey = activeNode.parentElement;
    const jRect = journey.getBoundingClientRect();
    const nRect = activeNode.getBoundingClientRect();
    const center = nRect.left + nRect.width / 2 - jRect.left;
    const pct = Math.max(0, Math.min(100, (center / jRect.width) * 100));
    journeyFill.style.width = `${pct}%`;
}

journeyNodes.forEach(node => {
    node.addEventListener('click', () => {
        journeyNodes.forEach(n => n.classList.remove('active'));
        node.classList.add('active');
        updateJourneyFill(node);

        const card = document.querySelector(node.dataset.target);
        if (card) {
            card.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
            card.classList.remove('flash');
            void card.offsetWidth; // restart the highlight animation
            card.classList.add('flash');
        }
    });
});

window.addEventListener('resize', () => {
    updateJourneyFill(document.querySelector('.journey-node.active'));
});
window.addEventListener('load', () => {
    updateJourneyFill(document.querySelector('.journey-node.active'));
});

/* --- Project filters --- */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        projectCards.forEach(card => {
            const show = filter === 'all' || card.dataset.cat === filter;
            card.classList.toggle('hide', !show);
            if (show) {
                card.classList.remove('visible');
                requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add('visible')));
            }
        });
    });
});

/* --- Reveal on scroll --- */
const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                entry.target.style.transitionDelay = `${Math.min(i * 90, 360)}ms`;
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
} else {
    revealEls.forEach(el => el.classList.add('visible'));
}

/* --- Animated metric counters --- */
const counters = document.querySelectorAll('.count-up');

function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    if (reduceMotion) { el.textContent = target; return; }
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased);
        if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

if ('IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                countObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });
    counters.forEach(el => countObserver.observe(el));
} else {
    counters.forEach(el => el.textContent = el.dataset.count);
}

/* --- Copy email with toast feedback --- */
const EMAIL = 'nikhiladyapak31@gmail.com';
const toast = document.getElementById('toast');

function copyEmail(btn) {
    const write = navigator.clipboard
        ? navigator.clipboard.writeText(EMAIL)
        : Promise.reject();

    write.then(() => {
        btn.classList.add('copied');
        const label = btn.querySelector('span');
        const icon = btn.querySelector('i');
        const original = label ? label.textContent : '';
        if (label) label.textContent = 'Copied!';
        if (icon) icon.className = 'fas fa-check';

        if (toast) {
            toast.classList.add('show');
            clearTimeout(toast._timer);
            toast._timer = setTimeout(() => toast.classList.remove('show'), 2200);
        }

        setTimeout(() => {
            btn.classList.remove('copied');
            if (label) label.textContent = original;
            if (icon) icon.className = 'far fa-copy';
        }, 2200);
    }).catch(() => {
        window.location.href = `mailto:${EMAIL}`;
    });
}

['copyEmail', 'copyEmailBig', 'copyEmailContact'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', () => copyEmail(btn));
});

/* --- 3D tilt with cursor-tracked glare on cards --- */
if (canHover && !reduceMotion) {
    document.querySelectorAll('.tilt').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width;
            const py = (e.clientY - rect.top) / rect.height;
            card.style.transform =
                `perspective(900px) rotateX(${(py - 0.5) * -4}deg) rotateY(${(px - 0.5) * 4}deg) translateY(-4px)`;
            card.style.setProperty('--gx', `${px * 100}%`);
            card.style.setProperty('--gy', `${py * 100}%`);
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

/* --- Scroll progress + back-to-top + active nav --- */
const progressBar = document.getElementById('scrollProgress');
const backToTopBtn = document.getElementById('backToTop');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar && scrollable > 0) {
        progressBar.style.width = `${(window.scrollY / scrollable) * 100}%`;
    }
    if (backToTopBtn) {
        backToTopBtn.classList.toggle('visible', window.scrollY > 300);
    }

    let current = '';
    sections.forEach(section => {
        if (scrollY >= section.offsetTop - section.clientHeight / 3) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.toggle('active-link', !!current && link.getAttribute('href').includes(current));
    });
});

/* --- Hero particle constellation --- */
(function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas || reduceMotion) return;

    const ctx = canvas.getContext('2d');
    const hero = canvas.parentElement;
    let particles = [];
    let raf;

    function resize() {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
        const count = Math.min(Math.floor(canvas.width / 18), 90);
        particles = Array.from({ length: count }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            r: Math.random() * 1.6 + 0.6
        }));
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const linkDist = 130;

        for (const p of particles) {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(88, 166, 255, 0.55)';
            ctx.fill();
        }

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.hypot(dx, dy);
                if (dist < linkDist) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(88, 166, 255, ${0.16 * (1 - dist / linkDist)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
        raf = requestAnimationFrame(draw);
    }

    const heroObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
            if (!raf) raf = requestAnimationFrame(draw);
        } else {
            cancelAnimationFrame(raf);
            raf = null;
        }
    });
    heroObserver.observe(hero);

    window.addEventListener('resize', resize);
    resize();
})();

/* --- Typewriter --- */
const roles = [
    "Scalable ML Systems",
    "AI Agent Evaluations",
    "Production MLOps",
    "Distributed Training Pipelines",
    "Edge AI & On-Device Inference"
];

let roleIndex = 0, charIndex = 0, isDeleting = false;

function typeWriter() {
    const element = document.querySelector('.typewriter');
    if (!element) return;
    if (reduceMotion) { element.textContent = roles[0]; return; }

    const currentRole = roles[roleIndex];
    element.textContent = currentRole.substring(0, charIndex + (isDeleting ? -1 : 1));
    charIndex += isDeleting ? -1 : 1;

    let speed = isDeleting ? 50 : 100;
    if (!isDeleting && charIndex === currentRole.length) {
        speed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        speed = 500;
    }
    setTimeout(typeWriter, speed);
}

document.addEventListener('DOMContentLoaded', typeWriter);

/* --- Terminal easter egg --- */
const terminal = document.getElementById('terminal');
const termFab = document.getElementById('termFab');
const termClose = document.getElementById('termClose');
const termBody = document.getElementById('termBody');
const termInput = document.getElementById('termInput');

const TERM_COMMANDS = {
    help: [
        'Available commands:',
        '  about      : who is this guy?',
        '  skills     : the stack',
        '  projects   : what I\'ve built',
        '  contact    : reach me',
        '  resume     : open my resume',
        '  hire       : the important one',
        '  clear      : clear the screen',
        '  exit       : close terminal'
    ].join('\n'),
    about: 'AI Intern @ Ciroos (SRE-agent evals, multi-cloud fault simulation).\nMS Data Science @ UW-Madison. Ex-Senior SWE @ Bosch ADAS:\nRay/AKS distributed training, 60M+ vector retrieval, MLOps platforms.',
    skills: 'Python · PyTorch · Ray · Kubernetes · MLflow · DVC · Terraform ·\nArgo · CLIP · ElasticSearch · FastAPI · Azure · AWS · GCP · Docker',
    projects: 'Sentinel-Edge AI (Qualcomm Track, air-gapped NPU security auditor)\nCode Runtime Complexity Prediction (Springer 2023, 96% accuracy)\nMLOps POC for Pedestrian Detection (DVC + MLflow + Detectron2)\nType "exit" and scroll to Projects for the full list.',
    contact: 'email    : nikhiladyapak31@gmail.com\nlinkedin : linkedin.com/in/nikhil-adyapak\ngithub   : github.com/NikhilAdyapak',
    hire: '🟢 Status: ACTIVELY INTERVIEWING\nFall 2026 internships/co-ops (Aug to Dec) + 2027 full-time.\nMLE · ML Systems · MLOps · Data Science.\nType "contact" for coordinates. Let\'s talk.',
    sudo: 'Nice try. Permission granted anyway, I like the initiative. 😄',
    whoami: 'recruiter@dream-company (hopefully)',
    ls: 'about.md  experience/  projects/  skills.json  resume.pdf  hire-me.txt'
};

function termPrint(text, isCmd = false) {
    const line = document.createElement('div');
    line.className = 'term-line' + (isCmd ? ' cmd' : '');
    line.textContent = text;
    termBody.appendChild(line);
    termBody.scrollTop = termBody.scrollHeight;
}

function openTerminal() {
    terminal.classList.add('open');
    setTimeout(() => termInput.focus(), 250);
}
function closeTerminal() {
    terminal.classList.remove('open');
}

if (termFab && terminal && termInput) {
    termFab.addEventListener('click', () => {
        terminal.classList.contains('open') ? closeTerminal() : openTerminal();
    });
    termClose.addEventListener('click', closeTerminal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeTerminal();
    });

    termInput.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        const raw = termInput.value.trim();
        termInput.value = '';
        if (!raw) return;

        termPrint(`❯ ${raw}`, true);
        const cmd = raw.toLowerCase();

        if (cmd === 'clear') {
            termBody.innerHTML = '';
        } else if (cmd === 'exit') {
            closeTerminal();
        } else if (cmd === 'resume') {
            termPrint('Opening resume...');
            window.open('NIKHIL_ADYAPAK_resume.pdf', '_blank');
        } else if (TERM_COMMANDS[cmd]) {
            termPrint(TERM_COMMANDS[cmd]);
        } else {
            termPrint(`command not found: ${raw}. Try "help"`);
        }
    });
}

/* --- Dynamic year --- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* --- A small hello for fellow engineers --- */
console.log(
    '%c👀 Inspecting the page? There\'s a terminal in the bottom-left corner.\n' +
    'Hand-built with vanilla HTML/CSS/JS, no frameworks.\n' +
    'Hiring for ML systems / MLOps? nikhiladyapak31@gmail.com',
    'color: #58a6ff; font-family: monospace; font-size: 12px; line-height: 1.7;'
);
