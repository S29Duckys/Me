/* ============================================================
   LANGUAGE TOGGLE
   ============================================================ */
const langToggle = document.getElementById('langToggle');
const langLabel  = document.getElementById('langLabel');
let currentLang  = 'fr';

function switchLanguage(lang) {
  const elements = document.querySelectorAll('[data-fr][data-en]');

  elements.forEach(el => {
    el.classList.add('lang-fade');
  });

  setTimeout(() => {
    elements.forEach(el => {
      el.textContent = el.getAttribute(`data-${lang}`);
      el.classList.remove('lang-fade');
    });

    langLabel.textContent = lang === 'fr' ? 'EN' : 'FR';
    document.documentElement.lang = lang;
  }, 220);
}

langToggle.addEventListener('click', () => {
  currentLang = currentLang === 'fr' ? 'en' : 'fr';
  switchLanguage(currentLang);
});

/* ============================================================
   SCROLL FADE-IN (Intersection Observer)
   ============================================================ */
const fadeItems = document.querySelectorAll('.cv-section');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

fadeItems.forEach(item => observer.observe(item));

/* ============================================================
   NAVBAR — scroll shadow
   ============================================================ */
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    navbar.style.boxShadow = '0 4px 24px rgba(0,0,0,0.08)';
  } else {
    navbar.style.boxShadow = 'none';
  }
}, { passive: true });
