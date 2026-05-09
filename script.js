// ===== PARTICLE CANVAS =====
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createParticle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 1.5 + 0.3,
    speedX: (Math.random() - 0.5) * 0.3,
    speedY: (Math.random() - 0.5) * 0.3,
    opacity: Math.random() * 0.6 + 0.1,
    color: Math.random() > 0.5 ? '201,168,76' : '79,142,247'
  };
}

for (let i = 0; i < 120; i++) particles.push(createParticle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.x += p.speedX; p.y += p.speedY;
    if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
    if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color},${p.opacity})`;
    ctx.fill();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  document.getElementById('backToTop').classList.toggle('show', window.scrollY > 400);
});

hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');
function updateActiveNav() {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navItems.forEach(n => {
    n.classList.remove('active');
    if (n.getAttribute('href') === '#' + current) n.classList.add('active');
  });
}
window.addEventListener('scroll', updateActiveNav);

// ===== TYPEWRITER =====
const phrases = [
  'Java Developer',
  'DSA Enthusiast',
  'Backend Engineer',
  'Problem Solver',
  'CS Engineering Student'
];
let phraseIdx = 0, charIdx = 0, deleting = false;
const typeEl = document.getElementById('typewriter-text');

function type() {
  const phrase = phrases[phraseIdx];
  if (deleting) {
    typeEl.textContent = phrase.substring(0, charIdx--);
    if (charIdx < 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; setTimeout(type, 400); return; }
  } else {
    typeEl.textContent = phrase.substring(0, charIdx++);
    if (charIdx > phrase.length) { deleting = true; setTimeout(type, 1500); return; }
  }
  setTimeout(type, deleting ? 60 : 100);
}
setTimeout(type, 800);

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const isFloat = target % 1 !== 0;
  const duration = 1800;
  const start = performance.now();
  function update(now) {
    const elapsed = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - elapsed, 3);
    const val = eased * target;
    el.textContent = isFloat ? val.toFixed(1) : Math.floor(val);
    if (elapsed < 1) requestAnimationFrame(update);
    else el.textContent = isFloat ? target.toFixed(1) : target;
  }
  requestAnimationFrame(update);
}

// ===== INTERSECTION OBSERVER =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
      // animate skill bars
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));

// Counter observer for hero stats
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(animateCounter);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statObserver.observe(heroStats);



// ===== BACK TO TOP =====
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== SKILL BARS (for initial load if already visible) =====
window.addEventListener('load', () => {
  document.querySelectorAll('.skill-fill').forEach(bar => {
    const rect = bar.getBoundingClientRect();
    if (rect.top < window.innerHeight) bar.style.width = bar.dataset.width + '%';
  });
});

// ===== TILT EFFECT ON PROJECT CARDS =====
document.querySelectorAll('.project-card, .achievement-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    card.style.transform = `translateY(-8px) rotateX(${-y / 30}deg) rotateY(${x / 30}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ===== GOLDEN CURSOR TRAIL =====
const trail = [];
document.addEventListener('mousemove', (e) => {
  trail.push({ x: e.clientX, y: e.clientY });
  if (trail.length > 10) trail.shift();
  const dot = document.createElement('div');
  dot.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:5px;height:5px;border-radius:50%;background:rgba(201,168,76,0.5);pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:opacity 0.5s`;
  document.body.appendChild(dot);
  setTimeout(() => { dot.style.opacity = '0'; setTimeout(() => dot.remove(), 500); }, 100);
});
