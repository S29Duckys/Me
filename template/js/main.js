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
    H = canvas.height = document.documentElement.scrollHeight;
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
      const scrollY = window.scrollY;
      const mx = mouseX;
      const my = mouseY + scrollY;
      const dx = this.x - mx;
      const dy = this.y - my;
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
      const scrollY = window.scrollY;
      const screenY = this.y - scrollY;
      if (screenY < -50 || screenY > H + 50) return;
      ctx.beginPath();
      ctx.arc(this.x, screenY, this.size, 0, Math.PI * 2);
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

  let lastScrollHeight = 0;
  function checkHeight() {
    const sh = document.documentElement.scrollHeight;
    if (sh !== lastScrollHeight) {
      lastScrollHeight = sh;
      canvas.height = sh;
      H = sh;
    }
    requestAnimationFrame(checkHeight);
  }

  initParticles();
  animate();
  checkHeight();
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

// ─── SCROLL REVEAL ───
(() => {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

// ─── MOBILE MENU ───
(() => {
  const btn = document.querySelector('.nav-menu-btn');
  const menu = document.querySelector('.mobile-menu');
  const close = document.querySelector('.mobile-menu-close');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => menu.classList.add('open'));
  if (close) close.addEventListener('click', () => menu.classList.remove('open'));
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => menu.classList.remove('open'));
  });
})();
