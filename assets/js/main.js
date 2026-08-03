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

/* --- Hero neural-network canvas: mouse-reactive nodes + links --- */
(function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas || reduceMotion) return;

    const ctx = canvas.getContext('2d');
    const hero = canvas.parentElement;
    let particles = [];
    let raf;
    const mouse = { x: null, y: null, active: false };

    function resize() {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
        const count = Math.min(Math.floor(canvas.width / 15), 110);
        particles = Array.from({ length: count }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            r: Math.random() * 1.7 + 0.6
        }));
    }

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = true;
    });
    hero.addEventListener('mouseleave', () => { mouse.active = false; });

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const linkDist = 130;
        const mouseDist = 180;

        for (const p of particles) {
            // gentle attraction toward cursor
            if (mouse.active) {
                const mdx = mouse.x - p.x, mdy = mouse.y - p.y;
                const md = Math.hypot(mdx, mdy);
                if (md < mouseDist && md > 0.5) {
                    const f = (1 - md / mouseDist) * 0.03;
                    p.vx += (mdx / md) * f;
                    p.vy += (mdy / md) * f;
                }
            }
            p.vx *= 0.99; p.vy *= 0.99;
            const sp = Math.hypot(p.vx, p.vy);
            if (sp > 1.1) { p.vx = (p.vx / sp) * 1.1; p.vy = (p.vy / sp) * 1.1; }
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(88, 166, 255, 0.6)';
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
            // link nodes to the cursor
            if (mouse.active) {
                const cdx = particles[i].x - mouse.x, cdy = particles[i].y - mouse.y;
                const cd = Math.hypot(cdx, cdy);
                if (cd < mouseDist) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(187, 134, 252, ${0.35 * (1 - cd / mouseDist)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        // glowing cursor node
        if (mouse.active) {
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(187, 134, 252, 0.9)';
            ctx.fill();
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

/* --- Magnetic buttons --- */
if (canHover && !reduceMotion) {
    document.querySelectorAll('.magnetic').forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const r = el.getBoundingClientRect();
            const x = e.clientX - (r.left + r.width / 2);
            const y = e.clientY - (r.top + r.height / 2);
            el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
        });
        el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
}

/* --- Command palette (Cmd/Ctrl+K) --- */
(function commandPalette() {
    const palette = document.getElementById('cmdk');
    if (!palette) return;
    const input = document.getElementById('cmdkInput');
    const list = document.getElementById('cmdkList');
    const items = Array.from(list.querySelectorAll('.cmdk-item'));
    let active = 0;

    function open() {
        palette.classList.add('open');
        input.value = '';
        filter('');
        setTimeout(() => input.focus(), 40);
    }
    function close() { palette.classList.remove('open'); }
    function toggle() { palette.classList.contains('open') ? close() : open(); }

    function filter(q) {
        q = q.toLowerCase();
        let firstVisible = -1;
        items.forEach((it, i) => {
            const match = it.dataset.keywords.toLowerCase().includes(q);
            it.style.display = match ? '' : 'none';
            if (match && firstVisible === -1) firstVisible = i;
        });
        active = firstVisible;
        highlight();
    }
    function highlight() {
        items.forEach((it, i) => it.classList.toggle('active', i === active));
    }
    function visibleItems() { return items.filter(it => it.style.display !== 'none'); }
    function move(dir) {
        const vis = visibleItems();
        if (!vis.length) return;
        let idx = vis.indexOf(items[active]);
        idx = (idx + dir + vis.length) % vis.length;
        active = items.indexOf(vis[idx]);
        highlight();
        vis[idx].scrollIntoView({ block: 'nearest' });
    }
    function run(it) {
        const action = it.dataset.action;
        close();
        if (action.startsWith('#')) {
            document.querySelector(action)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
        } else if (action === 'copy-email') {
            const b = document.getElementById('copyEmailBig') || document.getElementById('copyEmail');
            if (b) b.click();
        } else if (action === 'terminal') {
            document.getElementById('termFab')?.click();
        } else {
            window.open(action, action.startsWith('mailto') ? '_self' : '_blank');
        }
    }

    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); toggle(); return; }
        if (!palette.classList.contains('open')) return;
        if (e.key === 'Escape') close();
        else if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
        else if (e.key === 'Enter') { e.preventDefault(); if (items[active]) run(items[active]); }
    });
    input.addEventListener('input', () => filter(input.value));
    palette.addEventListener('click', (e) => { if (e.target === palette) close(); });
    items.forEach((it, i) => {
        it.addEventListener('click', () => run(it));
        it.addEventListener('mouseenter', () => { active = i; highlight(); });
    });
    const trigger = document.getElementById('cmdkTrigger');
    if (trigger) trigger.addEventListener('click', open);
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
    about: 'AI Intern @ Ciroos (SRE-agent evals across Kubernetes and multi-cloud).\nMS Data Science @ UW-Madison. Ex-Senior SWE @ Bosch ADAS:\nRay/AKS distributed training, 60M+ vector retrieval, MLOps platforms.',
    skills: 'Python · PyTorch · Ray · Kubernetes · MLflow · DVC · Terraform ·\nArgo · CLIP · ElasticSearch · FastAPI · Azure · AWS · GCP · Docker',
    projects: 'Sentinel-Edge AI (Qualcomm Track, air-gapped NPU security auditor)\nCode Runtime Complexity Prediction (Springer 2023, 96% accuracy)\nMLOps POC for Pedestrian Detection (DVC + MLflow + Detectron2)\nType "exit" and scroll to Projects for the full list.',
    contact: 'email    : nikhiladyapak31@gmail.com\nlinkedin : linkedin.com/in/nikhil-adyapak\ngithub   : github.com/NikhilAdyapak',
    hire: '🟢 Status: ACTIVELY INTERVIEWING\nSeeking 2027 full-time roles (available June 2027).\nMLE · ML Systems · Software · MLOps · Data Science.\nType "contact" for coordinates. Let\'s talk.',
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

/* --- Project detail modals --- */
(function projectModals() {
    const modal = document.getElementById('pmodal');
    const cards = Array.from(document.querySelectorAll('.project-card'));
    if (!modal || !cards.length) return;

    const catLabel = { edge: 'Edge AI', mlops: 'ML Systems', research: 'Research', speed: 'Speed Build' };
    const elCat = document.getElementById('pmodalCat');
    const elTitle = document.getElementById('pmodalTitle');
    const elBody = document.getElementById('pmodalBody');
    const elFoot = document.getElementById('pmodalFoot');
    const btnClose = document.getElementById('pmodalClose');

    // Detail content, grounded strictly in the on-card facts. Order matches DOM order.
    const DATA = [
        {
            title: 'Sentinel-Edge AI',
            problem: 'Audit code and legal documents for risk without ever sending sensitive data to the cloud.',
            approach: 'An air-gapped AI security auditor running 100% on-device on the Snapdragon X Elite NPU. Uses a local <strong>Llama 3.2</strong> model with <strong>RAG (ChromaDB)</strong>, orchestrated in <strong>LangChain</strong>, to detect legal risks and code vulnerabilities.',
            result: '<strong>Selected for the Qualcomm Track</strong> at the UW-Madison MadData 26 Hackathon (1 of 10 teams from 350+ registrants), with zero cloud data egress.',
            stack: ['Llama 3.2', 'Snapdragon NPU', 'RAG + ChromaDB', 'LangChain']
        },
        {
            title: 'Code Runtime Complexity Prediction',
            problem: 'Predict the Big-O runtime complexity of a program directly from its source code.',
            approach: 'Static analysis to build <strong>AST graph embeddings</strong>, then a <strong>BiLSTM</strong> over those embeddings, trained on the IBM CodeNet dataset across C, Java, and Python.',
            result: 'Reached <strong>96% accuracy</strong>. Published at <strong>Springer 2023</strong>.',
            stack: ['Python', 'TensorFlow', 'Scikit-Learn', 'NetworkX']
        },
        {
            title: 'MLOps POC for Pedestrian Detection',
            problem: 'A reproducible, on-premise MLOps starter template for object-detection models.',
            approach: 'End-to-end lifecycle with <strong>DVC + MLflow + Detectron2</strong>: versioned data, reproducible DAG pipelines, experiment tracking, and automated evaluation reports.',
            result: 'A reusable template covering the full ML lifecycle, from versioned data to evaluation.',
            stack: ['DVC', 'MLflow', 'PyTorch', 'Streamlit']
        },
        {
            title: 'Distributed ML Training System',
            problem: 'ADAS model retraining took ~4 weeks, creating a bottleneck for 30+ teams at Bosch.',
            approach: 'Designed a <strong>Ray Cluster</strong> for distributed training on <strong>Azure Kubernetes Service</strong>.',
            result: 'Cut retraining cycles by <strong>75% (4 weeks to 1 week)</strong> for 30+ ADAS teams.',
            stack: ['Ray', 'Kubernetes', 'Azure']
        },
        {
            title: 'Scene Understanding Pipeline',
            problem: 'Curate fine-grained datasets for rare ADAS corner cases from large image collections.',
            approach: 'An image-retrieval pipeline using foundation models (<strong>Mask2Former, Depth-Anything, OWL-ViT, CLIP</strong>) to generate scene graphs.',
            result: 'Fine-grained, corner-case datasets for autonomous-driving model development.',
            stack: ['Hugging Face', 'PyTorch', 'Transformers']
        },
        {
            title: 'Decrypting Transposition Ciphers',
            problem: 'Break columnar transposition ciphers without any prior knowledge of the encryption key.',
            approach: 'Optimization techniques using <strong>matrix permutations</strong> and <strong>dictionary matching</strong>.',
            result: 'Keyless decryption of columnar transposition ciphers. Published at <strong>IEEE SMARTGENCON 2022</strong>.',
            stack: ['Python', 'Cryptanalysis', 'IEEE']
        },
        {
            title: 'Big Talk',
            problem: 'Skip small talk by surfacing non-obvious shared interests between people in a room.',
            approach: 'A real-time matching app that analyzes user interests for thematic connections, built with <strong>Claude AI (Anthropic SDK)</strong> and <strong>FastAPI</strong>.',
            result: 'Built in <strong>under 1 hour</strong> at the UW-Madison Claude Hacks.',
            stack: ['Claude AI', 'FastAPI', 'Python']
        }
    ];

    let lastFocused = null;

    function openModal(i, card) {
        const d = DATA[i];
        if (!d) return;
        lastFocused = card;
        const cat = card.getAttribute('data-cat');
        elCat.textContent = catLabel[cat] || 'Project';
        elTitle.textContent = d.title;
        elBody.innerHTML =
            '<div class="pmodal-section"><h5>Problem</h5><p>' + d.problem + '</p></div>' +
            '<div class="pmodal-section"><h5>Approach</h5><p>' + d.approach + '</p></div>' +
            '<div class="pmodal-section pmodal-result"><h5>Result</h5><p>' + d.result + '</p></div>' +
            '<div class="pmodal-section"><h5>Stack</h5><div class="pmodal-stack">' +
                d.stack.map(s => '<span>' + s + '</span>').join('') + '</div></div>';
        // Reuse the card's own links so URLs live in one place.
        const links = card.querySelector('.links');
        elFoot.innerHTML = links ? links.innerHTML : '';
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        btnClose.focus();
    }

    function closeModal() {
        modal.classList.remove('open');
        document.body.style.overflow = '';
        if (lastFocused) lastFocused.focus();
    }

    cards.forEach((card, i) => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        const more = document.createElement('span');
        more.className = 'card-more';
        more.innerHTML = 'View details <i class="fas fa-arrow-right"></i>';
        card.appendChild(more);

        card.addEventListener('click', (e) => {
            if (e.target.closest('a')) return; // let real links work
            openModal(i, card);
        });
        card.addEventListener('keydown', (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('a')) {
                e.preventDefault();
                openModal(i, card);
            }
        });
    });

    btnClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });
})();

/* --- Section progress rail: highlight the section in the viewport --- */
(function sectionRail() {
    const rail = document.getElementById('sectionRail');
    if (!rail || !('IntersectionObserver' in window)) return;
    const links = Array.from(rail.querySelectorAll('a'));
    const byId = {};
    links.forEach(a => { byId[a.getAttribute('data-sec')] = a; });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                links.forEach(a => a.classList.remove('active'));
                const a = byId[entry.target.id];
                if (a) a.classList.add('active');
            }
        });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

    links.forEach(a => {
        const sec = document.getElementById(a.getAttribute('data-sec'));
        if (sec) observer.observe(sec);
    });
})();

/* --- Hero drift on scroll (subtle parallax) --- */
(function heroScrollParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const aurora = document.querySelector('.aurora');
    const profile = document.querySelector('.profile-wrapper');
    const heroText = document.querySelector('.hero-text');
    if (!aurora && !profile) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const y = window.scrollY;
            if (y < window.innerHeight) {
                if (aurora) aurora.style.transform = 'translateY(' + (y * 0.28).toFixed(1) + 'px)';
                if (profile) profile.style.transform = 'translateY(' + (y * 0.12).toFixed(1) + 'px)';
                if (heroText) heroText.style.transform = 'translateY(' + (y * 0.06).toFixed(1) + 'px)';
            }
            ticking = false;
        });
    }, { passive: true });
})();

/* --- Bento cards: cursor-tracked glow --- */
(function bentoGlow() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.querySelectorAll('.bento-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const r = card.getBoundingClientRect();
            card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
            card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
        });
    });
})();

/* --- A small hello for fellow engineers --- */
console.log(
    '%c👀 Inspecting the page? There\'s a terminal in the bottom-left corner.\n' +
    'Hand-built with vanilla HTML/CSS/JS, no frameworks.\n' +
    'Hiring for ML systems / MLOps? nikhiladyapak31@gmail.com',
    'color: #58a6ff; font-family: monospace; font-size: 12px; line-height: 1.7;'
);
