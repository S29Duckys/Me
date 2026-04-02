// ─── ANTIGRAVITY PARTICLE SYSTEM ───
(() => {
  const canvas = document.getElementById('antigravity-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  let mouseX = -9999, mouseY = -9999;
  const REPEL_RADIUS = 180;
  const REPEL_STRENGTH = 8000;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.homeX = Math.random() * W;
      this.homeY = Math.random() * H;
      this.x = this.homeX;
      this.y = this.homeY;
      this.vx = 0;
      this.vy = 0;
      this.size = Math.random() * 2.5 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.15;
      this.isAccent = Math.random() < 0.15;
    }
    update() {
      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < REPEL_RADIUS && dist > 0) {
        const force = REPEL_STRENGTH / (dist * dist);
        this.vx += (dx / dist) * force;
        this.vy += (dy / dist) * force;
      }

      this.vx += (this.homeX - this.x) * 0.01;
      this.vy += (this.homeY - this.y) * 0.01;
      this.vx *= 0.92;
      this.vy *= 0.92;
      this.x += this.vx;
      this.y += this.vy;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      if (this.isAccent) {
        ctx.fillStyle = `rgba(200, 255, 0, ${this.alpha * 2})`;
      } else {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
      }
      ctx.fill();
    }
  }

  let particles = [];

  function initParticles() {
    resize();
    const count = Math.min(Math.floor((W * H) / 8000), 350);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    for (const p of particles) {
      p.update();
      p.draw();
    }
    requestAnimationFrame(animate);
  }

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  window.addEventListener('resize', () => { initParticles(); });

  initParticles();
  animate();
})();

// ─── ANTIGRAVITY EFFECT ON DOM ELEMENTS ───
(() => {
  let mouseX = -9999, mouseY = -9999;
  const RADIUS = 200;
  const STRENGTH = 25;

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const targets = document.querySelectorAll('.antigravity-target');
  const states = new Map();
  targets.forEach(el => { states.set(el, { tx: 0, ty: 0 }); });

  function tick() {
    targets.forEach(el => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = cx - mouseX;
      const dy = cy - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const state = states.get(el);

      if (dist < RADIUS && dist > 0) {
        const force = ((RADIUS - dist) / RADIUS) * STRENGTH;
        state.tx += ((dx / dist) * force - state.tx) * 0.15;
        state.ty += ((dy / dist) * force - state.ty) * 0.15;
      } else {
        state.tx *= 0.9;
        state.ty *= 0.9;
      }

      if (Math.abs(state.tx) > 0.1 || Math.abs(state.ty) > 0.1) {
        el.style.transform = `translate(${state.tx}px, ${state.ty}px)`;
      } else {
        state.tx = 0;
        state.ty = 0;
        el.style.transform = '';
      }
    });
    requestAnimationFrame(tick);
  }
  tick();
})();

// ─── FULLPAGE SCROLL REVEAL & NAVIGATION ───
(() => {
  const wrapper = document.querySelector('.fullpage-wrapper');
  const sections = document.querySelectorAll('.fp-section');
  const dots = document.querySelectorAll('.page-dot');
  const navLinks = document.querySelectorAll('[data-section]');
  let currentIndex = 0;

  // Reveal elements in a section
  function revealSection(section) {
    section.querySelectorAll('.fp-reveal').forEach(el => {
      el.classList.remove('fp-leaving');
      el.classList.add('visible');
    });
  }

  // Animate out elements when leaving a section
  function hideSection(section) {
    section.querySelectorAll('.fp-reveal').forEach(el => {
      el.classList.remove('visible');
      el.classList.add('fp-leaving');
    });
    // Clean up leaving class after animation
    setTimeout(() => {
      section.querySelectorAll('.fp-reveal').forEach(el => {
        el.classList.remove('fp-leaving');
      });
    }, 700);
  }

  // Update active dot and nav link
  function updateIndicators(index) {
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    const activeId = sections[index]?.id;
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('data-section') === activeId);
    });
  }

  // Detect current section on scroll
  let scrollTimeout;
  function onScroll() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const scrollTop = wrapper.scrollTop;
      let newIndex = 0;
      sections.forEach((s, i) => {
        if (scrollTop >= s.offsetTop - window.innerHeight / 2) {
          newIndex = i;
        }
      });

      if (newIndex !== currentIndex) {
        hideSection(sections[currentIndex]);
        currentIndex = newIndex;
        // Delay reveal so exit animation plays first
        setTimeout(() => {
          revealSection(sections[currentIndex]);
        }, 300);
        updateIndicators(currentIndex);
      }
    }, 50);
  }

  wrapper.addEventListener('scroll', onScroll, { passive: true });

  // Navigate to section
  function goToSection(id) {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Dot click
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToSection(dot.getAttribute('data-section'));
    });
  });

  // Nav link click
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      goToSection(link.getAttribute('data-section'));
      // Close mobile menu if open
      document.querySelector('.mobile-menu')?.classList.remove('open');
    });
  });

  // Logo click
  document.querySelector('.nav-logo')?.addEventListener('click', (e) => {
    e.preventDefault();
    goToSection('hero');
  });

  // Init: reveal first section
  revealSection(sections[0]);
  updateIndicators(0);
})();

// ─── MOBILE MENU ───
(() => {
  const btn = document.querySelector('.nav-menu-btn');
  const menu = document.querySelector('.mobile-menu');
  const close = document.querySelector('.mobile-menu-close');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => menu.classList.add('open'));
  if (close) close.addEventListener('click', () => menu.classList.remove('open'));
})();
