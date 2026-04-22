import './style.css'

/* ── Stars ── */
const canvas = document.getElementById('stars-canvas')
const ctx = canvas.getContext('2d')
let stars = []
let W, H

function resize() {
  W = canvas.width = window.innerWidth
  H = canvas.height = window.innerHeight
  buildStars()
}

function buildStars() {
  stars = []
  const count = Math.floor((W * H) / 5500)
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.1 + 0.15,
      base: Math.random() * 0.65 + 0.08,
      speed: Math.random() * 1.2 + 0.4,
      offset: Math.random() * Math.PI * 2,
    })
  }
}

function drawStars(t) {
  ctx.clearRect(0, 0, W, H)
  const ts = t * 0.001
  for (const s of stars) {
    const pulse = 0.65 + 0.35 * Math.sin(ts * s.speed + s.offset)
    ctx.globalAlpha = s.base * pulse
    ctx.beginPath()
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
    ctx.fillStyle = '#fff'
    ctx.fill()
  }
  ctx.globalAlpha = 1
  requestAnimationFrame(drawStars)
}

window.addEventListener('resize', resize)
resize()
requestAnimationFrame(drawStars)

/* ── Nav scroll ── */
const nav = document.getElementById('nav')
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40)
}, { passive: true })

/* ── Reveal on scroll ── */
const revealEls = document.querySelectorAll('.reveal')
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // stagger siblings slightly
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')]
        const delay = siblings.indexOf(entry.target) * 80
        setTimeout(() => {
          entry.target.classList.add('visible')
        }, delay)
        revealObserver.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.12 }
)
revealEls.forEach(el => revealObserver.observe(el))

/* ── Contact form ── */
const form = document.getElementById('contact-form')
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const btn = form.querySelector('#submit-btn')
    btn.disabled = true
    btn.textContent = 'Envoi en cours…'

    // Simulate async send
    setTimeout(() => {
      form.innerHTML = `
        <div class="form-success">
          <strong>Message envoyé ✓</strong>
          Merci ! Je vous répondrai sous 24h.
        </div>
      `
    }, 800)
  })
}
