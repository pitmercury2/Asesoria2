/* ============================================================
   SmartClass Academy — script.js
   Funcionalidades interactivas y animaciones
   ============================================================ */

/* ── Utilidades ── */
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

/* ============================================================
   1. LOADER
   Oculta el loader una vez que la página ha cargado
   ============================================================ */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = $('loader');
    if (loader) loader.classList.add('hidden');
    // Disparar animaciones del hero al terminar el loader
    $$('[data-reveal]').forEach(el => {
      if (isInViewport(el)) el.classList.add('revealed');
    });
  }, 1800);
});

/* ============================================================
   2. NAVBAR — efecto al hacer scroll + hamburguesa
   ============================================================ */
const navbar = $('navbar');
const hamburger = $('hamburger');
const navLinks = $('navLinks');

// Efecto scroll en navbar
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  // Botón volver arriba
  const backBtn = $('backToTop');
  if (window.scrollY > 400) {
    backBtn.classList.add('show');
  } else {
    backBtn.classList.remove('show');
  }
  // Reveal animations
  revealElements();
  // Contadores
  triggerCounters();
});

// Menú hamburguesa
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Cerrar menú al hacer click en un link
$$('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// Cerrar menú al hacer click fuera
document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  }
});

/* ============================================================
   3. MODO OSCURO / CLARO
   ============================================================ */
const themeToggle = $('themeToggle');
const themeIcon = $('themeIcon');
const html = document.documentElement;

// Cargar preferencia guardada
const savedTheme = localStorage.getItem('smartclass-theme') || 'light';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', next);
  localStorage.setItem('smartclass-theme', next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

/* ============================================================
   4. PARTÍCULAS FLOTANTES (Hero)
   Genera partículas aleatorias de fondo
   ============================================================ */
function createParticles() {
  const container = $('particles');
  if (!container) return;

  const count = 18;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 8 + 4;
    const x = Math.random() * 100;
    const duration = Math.random() * 12 + 8;
    const delay = Math.random() * 8;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}%;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;
    container.appendChild(p);
  }
}
createParticles();

/* ============================================================
   5. SCROLL REVEAL ANIMATIONS
   Anima elementos al entrar al viewport
   ============================================================ */
function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.88 && rect.bottom > 0;
}

function revealElements() {
  $$('[data-reveal]').forEach((el, i) => {
    if (isInViewport(el)) {
      // Delay escalonado por grupos
      const delay = (i % 6) * 80;
      setTimeout(() => el.classList.add('revealed'), delay);
    }
  });
}

// Inicial
setTimeout(revealElements, 100);
window.addEventListener('scroll', revealElements);

/* ============================================================
   6. CONTADORES ANIMADOS (Hero stats)
   Anima los números al llegar al viewport
   ============================================================ */
let countersTriggered = false;

function animateCounter(el, target, suffix) {
  let start = 0;
  const duration = 1800;
  const step = target / (duration / 16);

  function update() {
    start += step;
    if (start < target) {
      el.textContent = Math.floor(start);
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }
  update();
}

function triggerCounters() {
  if (countersTriggered) return;
  const section = document.querySelector('.hero-stats');
  if (!section) return;
  if (isInViewport(section)) {
    countersTriggered = true;
    $$('.stat-number').forEach(el => {
      const target = parseInt(el.getAttribute('data-target'));
      animateCounter(el, target);
    });
  }
}
// Intentar al cargar también
setTimeout(triggerCounters, 2000);

/* ============================================================
   7. CARRUSEL DE TESTIMONIOS
   Automático con pausa en hover, botones y dots
   ============================================================ */
(function initCarousel() {
  const track = $('testimonialsTrack');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  const totalCards = cards.length;
  const dotsContainer = $('carouselDots');
  const prevBtn = $('prevBtn');
  const nextBtn = $('nextBtn');

  let current = 0;
  let autoplay;
  let visibleCount = getVisibleCount();

  // Crear dots
  function createDots() {
    dotsContainer.innerHTML = '';
    const dotsCount = totalCards - visibleCount + 1;
    for (let i = 0; i <= dotsCount - 1; i++) {
      const dot = document.createElement('button');
      dot.className = `carousel-dot${i === 0 ? ' active' : ''}`;
      dot.setAttribute('aria-label', `Ir al testimonio ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function getVisibleCount() {
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 900) return 2;
    return 3;
  }

  function goTo(index) {
    visibleCount = getVisibleCount();
    const maxIndex = Math.max(0, totalCards - visibleCount);
    current = Math.min(Math.max(index, 0), maxIndex);

    // Calcular desplazamiento
    const cardWidth = cards[0].offsetWidth + 24; // 24 = gap
    track.style.transform = `translateX(-${current * cardWidth}px)`;

    // Actualizar dots
    $$('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAutoplay() {
    stopAutoplay();
    autoplay = setInterval(next, 4000);
  }

  function stopAutoplay() {
    clearInterval(autoplay);
  }

  prevBtn.addEventListener('click', () => { prev(); startAutoplay(); });
  nextBtn.addEventListener('click', () => { next(); startAutoplay(); });

  track.addEventListener('mouseenter', stopAutoplay);
  track.addEventListener('mouseleave', startAutoplay);

  // Touch/swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? next() : prev();
    }
    startAutoplay();
  });

  // Responsive
  window.addEventListener('resize', () => {
    visibleCount = getVisibleCount();
    createDots();
    goTo(current);
  });

  createDots();
  startAutoplay();
})();

/* ============================================================
   8. FAQ DESPLEGABLE
   Toggle de preguntas frecuentes con animación suave
   ============================================================ */
$$('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const answer = item.querySelector('.faq-answer');
    const isOpen = item.classList.contains('open');

    // Cerrar todos los demás
    $$('.faq-item.open').forEach(openItem => {
      if (openItem !== item) {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-answer').classList.remove('open');
      }
    });

    // Toggle el actual
    item.classList.toggle('open', !isOpen);
    answer.classList.toggle('open', !isOpen);
  });
});

/* ============================================================
   9. VALIDACIÓN DEL FORMULARIO
   Validación completa con mensajes de error específicos
   ============================================================ */
const form = $('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (validateForm()) {
      submitForm();
    }
  });

  // Limpiar errores en tiempo real
  ['name', 'email', 'phone', 'subject', 'message'].forEach(fieldId => {
    const field = $(fieldId);
    if (field) {
      field.addEventListener('input', () => clearError(fieldId));
      field.addEventListener('change', () => clearError(fieldId));
    }
  });
}

function validateForm() {
  let isValid = true;

  // Nombre
  const name = $('name').value.trim();
  if (!name || name.length < 3) {
    showError('name', 'Por favor ingresa tu nombre completo (mínimo 3 caracteres).');
    isValid = false;
  }

  // Email
  const email = $('email').value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    showError('email', 'Por favor ingresa un correo electrónico válido.');
    isValid = false;
  }

  // Teléfono
  const phone = $('phone').value.trim();
  const phoneRegex = /^[\d\s\+\-\(\)]{7,15}$/;
  if (!phone || !phoneRegex.test(phone)) {
    showError('phone', 'Por favor ingresa un número de teléfono válido.');
    isValid = false;
  }

  // Materia
  const subject = $('subject').value;
  if (!subject) {
    showError('subject', 'Por favor selecciona una materia.');
    isValid = false;
  }

  // Mensaje
  const message = $('message').value.trim();
  if (!message || message.length < 10) {
    showError('message', 'Por favor escribe un mensaje de al menos 10 caracteres.');
    isValid = false;
  }

  return isValid;
}

function showError(fieldId, msg) {
  const field = $(fieldId);
  const errorEl = $(`${fieldId}Error`);
  if (field) field.classList.add('error');
  if (errorEl) errorEl.textContent = msg;
}

function clearError(fieldId) {
  const field = $(fieldId);
  const errorEl = $(`${fieldId}Error`);
  if (field) field.classList.remove('error');
  if (errorEl) errorEl.textContent = '';
}

function submitForm() {
  const btn = $('submitBtn');
  const successMsg = $('formSuccess');

  // Deshabilitar botón y mostrar loading
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

  // Simular envío (en producción: conectar con backend o EmailJS)
  setTimeout(() => {
    btn.style.display = 'none';
    successMsg.classList.add('show');
    form.reset();

    // Resetear después de 6 segundos
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar mensaje';
      btn.style.display = 'flex';
      successMsg.classList.remove('show');
    }, 6000);
  }, 1500);
}

/* ============================================================
   10. SCROLL SUAVE
   Para todos los links internos con href="#..."
   ============================================================ */
$$('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});

/* ============================================================
   11. BOTÓN VOLVER ARRIBA
   ============================================================ */
const backToTop = $('backToTop');
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   12. NAVBAR ACTIVE LINK
   Resalta el link activo según la sección visible
   ============================================================ */
const sections = $$('section[id]');

function setActiveNavLink() {
  let currentSection = '';
  sections.forEach(section => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) {
      currentSection = section.getAttribute('id');
    }
  });

  $$('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', setActiveNavLink);

/* ── Estilo adicional para link activo ── */
const style = document.createElement('style');
style.textContent = `
  .nav-link.active {
    color: var(--blue) !important;
    background: var(--blue-light) !important;
  }
`;
document.head.appendChild(style);

/* ============================================================
   13. HOVER EFFECTS — Service cards glow
   Efecto de brillo dinámico en las tarjetas de servicios
   ============================================================ */
$$('.service-card, .about-card, .teacher-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPct = (x / rect.width) * 100;
    const yPct = (y / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${xPct}%`);
    card.style.setProperty('--mouse-y', `${yPct}%`);
  });
});

/* ============================================================
   14. INICIO: verificar elementos en viewport al cargar
   ============================================================ */
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    revealElements();
    triggerCounters();
  }, 2000);
});
