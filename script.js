/* ═══════════════════════════════════════════════════════
   PORTFOLIO - GAMING THEME JS
   Abdul Rafay | 2026
   ═══════════════════════════════════════════════════════ */

// ── Loader ──
(function initLoader() {
    const loader = document.getElementById('loader');
    const progress = loader.querySelector('.loader-progress');
    const percent = loader.querySelector('.loader-percent');
    let p = 0;
    const interval = setInterval(() => {
        p += Math.random() * 12 + 3;
        if (p >= 100) {
            p = 100;
            clearInterval(interval);
            setTimeout(() => loader.classList.add('hidden'), 400);
        }
        progress.style.width = p + '%';
        percent.textContent = Math.floor(p) + '%';
    }, 120);
})();

// ── Three.js 3D Background ──
(function initThreeJS() {
    const canvas = document.getElementById('bg-canvas');
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    // Floating geometry particles
    const geometries = [];
    const materials = [
        new THREE.MeshPhongMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.6, wireframe: true }),
        new THREE.MeshPhongMaterial({ color: 0xff00aa, transparent: true, opacity: 0.5, wireframe: true }),
        new THREE.MeshPhongMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.5, wireframe: true }),
    ];

    // Create floating shapes
    const shapes = [];
    const shapeCount = 40;
    for (let i = 0; i < shapeCount; i++) {
        let geo;
        const r = Math.random();
        if (r < 0.33) geo = new THREE.IcosahedronGeometry(Math.random() * 0.8 + 0.3, 0);
        else if (r < 0.66) geo = new THREE.OctahedronGeometry(Math.random() * 0.7 + 0.3, 0);
        else geo = new THREE.TetrahedronGeometry(Math.random() * 0.8 + 0.3, 0);

        const mat = materials[Math.floor(Math.random() * materials.length)];
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(
            (Math.random() - 0.5) * 60,
            (Math.random() - 0.5) * 60,
            (Math.random() - 0.5) * 40
        );
        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        mesh.userData = {
            speedX: (Math.random() - 0.5) * 0.008,
            speedY: (Math.random() - 0.5) * 0.008,
            speedZ: (Math.random() - 0.5) * 0.005,
            rotSpeed: (Math.random() - 0.5) * 0.015,
            originalY: mesh.position.y
        };
        scene.add(mesh);
        shapes.push(mesh);
    }

    // Particle field
    const particleCount = 600;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const colorOptions = [
        [0, 0.94, 1],    // cyan
        [1, 0, 0.67],    // magenta
        [0.55, 0.36, 0.96] // purple
    ];
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
        const c = colorOptions[Math.floor(Math.random() * colorOptions.length)];
        colors[i * 3] = c[0]; colors[i * 3 + 1] = c[1]; colors[i * 3 + 2] = c[2];
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const particleMat = new THREE.PointsMaterial({ size: 0.12, vertexColors: true, transparent: true, opacity: 0.7 });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Grid floor
    const gridHelper = new THREE.GridHelper(80, 40, 0x00f0ff, 0x1a1a2e);
    gridHelper.position.y = -15;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.15;
    scene.add(gridHelper);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x222244, 0.5);
    scene.add(ambientLight);
    const pointLight1 = new THREE.PointLight(0x00f0ff, 1.5, 60);
    pointLight1.position.set(10, 10, 15);
    scene.add(pointLight1);
    const pointLight2 = new THREE.PointLight(0xff00aa, 1.2, 60);
    pointLight2.position.set(-10, -5, 15);
    scene.add(pointLight2);
    const pointLight3 = new THREE.PointLight(0x8b5cf6, 1, 50);
    pointLight3.position.set(0, 15, 5);
    scene.add(pointLight3);

    // Mouse interaction
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Animation loop
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

        shapes.forEach(s => {
            s.rotation.x += s.userData.rotSpeed;
            s.rotation.y += s.userData.rotSpeed * 0.7;
            s.position.x += s.userData.speedX;
            s.position.y = s.userData.originalY + Math.sin(time + s.position.x * 0.1) * 1.5;
            s.position.z += s.userData.speedZ;

            // Wrap around
            if (s.position.x > 35) s.position.x = -35;
            if (s.position.x < -35) s.position.x = 35;
            if (s.position.z > 20) s.position.z = -20;
            if (s.position.z < -20) s.position.z = 20;
        });

        // Rotate particles slowly
        particles.rotation.y += 0.0003;
        particles.rotation.x += 0.0001;

        // Grid movement
        gridHelper.position.z = (time * 0.5) % 2;

        // Camera follows mouse subtly
        camera.position.x += (mouseX * 3 - camera.position.x) * 0.03;
        camera.position.y += (-mouseY * 2 - camera.position.y) * 0.03;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();

// ── Custom Cursor ──
(function initCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    if (!cursor || !follower) return;
    let cx = 0, cy = 0, fx = 0, fy = 0;

    document.addEventListener('mousemove', (e) => {
        cx = e.clientX; cy = e.clientY;
        cursor.style.left = cx + 'px';
        cursor.style.top = cy + 'px';
    });

    function followCursor() {
        fx += (cx - fx) * 0.12;
        fy += (cy - fy) * 0.12;
        follower.style.left = fx - 18 + 'px';
        follower.style.top = fy - 18 + 'px';
        requestAnimationFrame(followCursor);
    }
    followCursor();

    document.querySelectorAll('a, button, .btn, .project-card, .info-card, .skill-item, .achievement-card, .contact-link, .nav-toggle').forEach(el => {
        el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); follower.classList.add('hover'); });
        el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); follower.classList.remove('hover'); });
    });
})();

// ── Typewriter Effect ──
(function initTypewriter() {
    const el = document.getElementById('typewriter-text');
    if (!el) return;
    const phrases = [
        'AI-Powered Developer',
        'Founder & CEO @ Ravexa AI',
        'Frontend AI Engineer @ FlyRank',
        'Computer Science Student',
        'Hackathon Champion',
        'Published Author',
        'IEEE Co-Director',
        'React.js Specialist',
        'Full-Stack Builder'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const current = phrases[phraseIndex];
        if (isDeleting) {
            el.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            el.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 30 : 60;

        if (!isDeleting && charIndex === current.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            speed = 400;
        }

        setTimeout(type, speed);
    }
    setTimeout(type, 1500);
})();

// ── Counter Animation ──
(function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.count);
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 40));
        const interval = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(interval);
            }
            counter.textContent = current + '+';
        }, 50);
    });
})();

// ── Navbar Scroll ──
(function initNavbar() {
    const navbar = document.getElementById('navbar');
    const links = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section, #hero');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);

        // Active link
        let current = '';
        sections.forEach(s => {
            const top = s.offsetTop - 200;
            if (window.scrollY >= top) current = s.id;
        });
        links.forEach(l => {
            l.classList.remove('active');
            if (l.getAttribute('href') === '#' + current) l.classList.add('active');
        });
    });

    // Mobile nav
    const toggle = document.getElementById('nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    if (toggle && mobileNav) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });
        document.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                mobileNav.classList.remove('active');
            });
        });
    }
})();

// ── GSAP ScrollTrigger Animations ──
(function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP not loaded — skipping animations');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);
    document.body.classList.add('gsap-ready'); // lifts CSS fallback visibility

    // Helper: safe fromTo that won't hide elements if trigger never fires
    function reveal(targets, vars, triggerEl, start) {
        if (!document.querySelector(typeof targets === 'string' ? targets : null)) return;
        gsap.fromTo(targets,
            { y: vars.y || 0, x: vars.x || 0, opacity: 0, scale: vars.scale || 1 },
            {
                y: 0, x: 0, opacity: 1, scale: 1,
                duration: vars.duration || 0.8,
                stagger: vars.stagger || 0,
                ease: vars.ease || 'power2.out',
                scrollTrigger: {
                    trigger: triggerEl || targets,
                    start: start || 'top 85%',
                    toggleActions: 'play none none none',
                    once: true
                }
            }
        );
    }

    // Section headers
    reveal('.section-header', { y: 40, duration: 1 });

    // About
    reveal('.about-avatar-wrapper', { x: -50, duration: 1 }, '.about-grid');
    reveal('.about-terminal',       { y: 50,  duration: 1 });
    reveal('.info-card',            { y: 30,  duration: 0.6, stagger: 0.12 }, '.about-info-cards');

    // Education
    reveal('.edu-card', { y: 50, duration: 0.8, stagger: 0.2 }, '.education-cards');

    // Skills
    reveal('.skill-category', { y: 50, duration: 0.8, stagger: 0.2 }, '.skills-grid');
    reveal('.domain-badge',   { y: 20, duration: 0.5, stagger: 0.1, scale: 0.9 }, '.skills-domains');

    // Skill bars
    gsap.utils.toArray('.skill-fill').forEach(bar => {
        const skill = bar.dataset.skill;
        gsap.fromTo(bar,
            { width: '0%' },
            { width: skill + '%', duration: 1.5, ease: 'power2.out',
              scrollTrigger: { trigger: bar, start: 'top 92%', once: true } }
        );
    });

    // Education progress bars
    gsap.utils.toArray('.edu-progress-bar').forEach(bar => {
        const progress = bar.dataset.progress;
        gsap.fromTo(bar,
            { width: '0%' },
            { width: progress + '%', duration: 1.5, ease: 'power2.out',
              scrollTrigger: { trigger: bar, start: 'top 92%', once: true } }
        );
    });

    // Timeline items
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
        gsap.fromTo(item,
            { x: i % 2 === 0 ? -60 : 60, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
              scrollTrigger: { trigger: item, start: 'top 85%', once: true } }
        );
    });

    // Projects
    reveal('.project-card', { y: 60, duration: 0.8, stagger: 0.12 }, '.projects-grid');

    // Achievements
    reveal('.achievement-card', { y: 30, duration: 0.6, stagger: 0.08 }, '.achievements-grid');

    // Services
    reveal('.service-card', { y: 40, duration: 0.7, stagger: 0.15 }, '.services-grid');

    // Contact
    reveal('.contact-info',         { x: -50, duration: 1 }, '.contact-grid');
    reveal('.contact-form-wrapper', { x:  50, duration: 1 }, '.contact-grid');
})();

// ── Smooth Scroll for Nav Links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ── Form Submit ──
document.getElementById('contact-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = this.querySelector('.btn-submit');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> MESSAGE SENT!';
    btn.style.background = 'linear-gradient(135deg, #27c93f, #00aa44)';
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        this.reset();
    }, 3000);
});

// ── Parallax on Scroll ──
(function initParallax() {
    const overlay = document.getElementById('particles-overlay');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (overlay) {
            overlay.style.transform = `translateY(${scrollY * 0.1}px)`;
        }
    });
})();

// ── Glitch Effect on Name Hover ──
(function initGlitch() {
    const glitchEl = document.querySelector('.glitch');
    if (!glitchEl) return;
    glitchEl.addEventListener('mouseenter', () => {
        glitchEl.style.animation = 'glitchText 0.3s infinite';
        setTimeout(() => { glitchEl.style.animation = ''; }, 1500);
    });
})();

// ── Console Easter Egg ──
console.log('%c Abdul Rafay Portfolio ', 'background: linear-gradient(135deg, #00f0ff, #ff00aa); color: #0a0a0f; font-size: 20px; font-weight: bold; padding: 10px 20px; border-radius: 8px;');
console.log('%c Built with Three.js + GSAP + Pure CSS Gaming Theme ', 'color: #00f0ff; font-size: 12px;');

// ── 1. MATRIX RAIN (Loader) ──
(function initMatrixRain() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789アイウエオカキクケコサシスセソタチツ<>{}[]|/\\#@!%$&';
    const fontSize = 14;
    const cols = Math.floor(canvas.width / fontSize);
    const drops = Array(cols).fill(1);
    const statusMessages = [
        'LOADING ASSETS...',
        'INITIALIZING AI ENGINE...',
        'COMPILING SHADERS...',
        'BUILDING PORTFOLIO...',
        'POWERING UP...',
        'READY.'
    ];
    let msgIndex = 0;
    const statusEl = document.querySelector('.loader-status');

    const msgInterval = setInterval(() => {
        if (statusEl && msgIndex < statusMessages.length) {
            statusEl.textContent = statusMessages[msgIndex++];
        } else {
            clearInterval(msgInterval);
        }
    }, 400);

    function drawMatrix() {
        ctx.fillStyle = 'rgba(10,10,15,0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00f0ff';
        ctx.font = fontSize + 'px monospace';
        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillStyle = Math.random() > 0.95 ? '#ffffff' : (Math.random() > 0.5 ? '#00f0ff' : '#ff00aa');
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }
    const matrixInterval = setInterval(drawMatrix, 35);
    // Stop when loader hides
    const observer = new MutationObserver(() => {
        if (document.getElementById('loader').classList.contains('hidden')) {
            clearInterval(matrixInterval);
            observer.disconnect();
        }
    });
    observer.observe(document.getElementById('loader'), { attributes: true });
})();

// ── 2. HERO CODE RAIN ──
(function initHeroRain() {
    const canvas = document.getElementById('hero-rain-canvas');
    if (!canvas) return;
    const hero = document.getElementById('hero');
    const ctx = canvas.getContext('2d');
    function resize() { canvas.width = hero.offsetWidth; canvas.height = hero.offsetHeight; }
    resize();
    window.addEventListener('resize', resize);

    const chars = '01アイウエオカキクケコ<>{}ABCDEF';
    const fontSize = 13;
    const cols = Math.floor(canvas.width / fontSize);
    const drops = Array.from({length: cols}, () => Math.random() * -100);

    function draw() {
        ctx.fillStyle = 'rgba(10,10,15,0.06)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < drops.length; i++) {
            ctx.fillStyle = i % 3 === 0 ? '#ff00aa' : '#00f0ff';
            ctx.font = fontSize + 'px monospace';
            ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i] += 0.5;
        }
    }
    setInterval(draw, 50);
})();

// ── 3. CLICK PARTICLE EXPLOSION ──
(function initClickParticles() {
    const container = document.getElementById('click-particles');
    if (!container) return;
    const colors = ['#00f0ff', '#ff00aa', '#8b5cf6', '#ffd700', '#fff700', '#ff6b00'];

    document.addEventListener('click', (e) => {
        const count = 20;
        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.className = 'click-particle';
            const angle = (i / count) * 360;
            const dist = 60 + Math.random() * 80;
            const rad = angle * Math.PI / 180;
            const tx = Math.cos(rad) * dist;
            const ty = Math.sin(rad) * dist;
            const size = 4 + Math.random() * 8;
            p.style.cssText = `
                left: ${e.clientX - size/2}px;
                top:  ${e.clientY - size/2}px;
                width: ${size}px;
                height: ${size}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                box-shadow: 0 0 ${size * 2}px currentColor;
                --tx: ${tx}px;
                --ty: ${ty}px;
                animation-duration: ${0.5 + Math.random() * 0.5}s;
            `;
            container.appendChild(p);
            setTimeout(() => p.remove(), 1000);
        }
    });
})();

// ── 4. POWER LEVEL BAR ──
(function initPowerLevel() {
    const fill = document.getElementById('power-fill');
    if (!fill) return;
    // Set random heights for viz bars
    document.querySelectorAll('.viz-bar').forEach(b => {
        b.style.setProperty('--rnd', Math.floor(10 + Math.random() * 30) + 'px');
    });
    // Animate power bar after loader hides
    const tryFill = setInterval(() => {
        if (!document.getElementById('loader').classList.contains('hidden')) return;
        clearInterval(tryFill);
        setTimeout(() => { fill.style.width = '92%'; }, 800);
    }, 200);
})();

// ── 5. VANILLA TILT 3D CARDS ──
(function initTilt() {
    if (typeof VanillaTilt === 'undefined') return;
    VanillaTilt.init(document.querySelectorAll('.project-card'), {
        max: 10, speed: 400, glare: true, 'max-glare': 0.15,
        perspective: 800, scale: 1.02
    });
    VanillaTilt.init(document.querySelectorAll('.service-card'), {
        max: 8, speed: 400, glare: true, 'max-glare': 0.1,
        perspective: 900, scale: 1.02
    });
    VanillaTilt.init(document.querySelectorAll('.edu-card'), {
        max: 6, speed: 400, glare: false, scale: 1.01
    });
    VanillaTilt.init(document.querySelectorAll('.skill-category'), {
        max: 5, speed: 400, glare: false, scale: 1.01
    });
    VanillaTilt.init(document.querySelectorAll('.profile-card-inner'), {
        max: 12, speed: 600, glare: true, 'max-glare': 0.2,
        perspective: 700, scale: 1.03
    });
})();
