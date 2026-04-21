/**
 * script.js  —  Methsani Yowinma Portfolio
 * Theme: White Glass · Electric Blue
 * Features:
 *   1. Custom cursor
 *   2. Canvas particle network (hero)
 *   3. Sticky nav + active link tracking
 *   4. Mobile hamburger
 *   5. Typewriter terminal
 *   6. IntersectionObserver scroll reveal
 *   7. Skill bar animations
 *   8. Project filter tabs
 *   9. Smooth anchor scrolling
 */

/* ─────────────────────────────────────────────────────────────
   1. CUSTOM CURSOR
───────────────────────────────────────────────────────────── */
const cursorDot  = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');

if (window.matchMedia('(pointer: fine)').matches) {
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .ftab, .proj-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorRing.style.width  = '48px';
      cursorRing.style.height = '48px';
      cursorRing.style.borderColor = 'rgba(37,99,235,0.6)';
    });
    el.addEventListener('mouseleave', () => {
      cursorRing.style.width  = '30px';
      cursorRing.style.height = '30px';
      cursorRing.style.borderColor = 'rgba(37,99,235,0.4)';
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   2. CANVAS PARTICLE NETWORK — blue on white
───────────────────────────────────────────────────────────── */
const canvas = document.getElementById('heroCanvas');
const ctx    = canvas.getContext('2d');

let particles = [];
const PARTICLE_COUNT = 65;
const MAX_DIST       = 130;
const COLOR          = '34,211,238'; /* cyan accent */

function resizeCanvas() {
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

function initParticles() {
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r:  Math.random() * 1.5 + 0.5,
    });
  }
}
initParticles();

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  /* Connections */
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MAX_DIST) {
        const alpha = (1 - dist / MAX_DIST) * 0.18;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${COLOR},${alpha})`;
        ctx.lineWidth   = 0.8;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  /* Dots */
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${COLOR},0.45)`;
    ctx.fill();
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
  });

  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ─────────────────────────────────────────────────────────────
   3. STICKY NAV + ACTIVE LINK
───────────────────────────────────────────────────────────── */
const nav     = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav__link');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

const sections = document.querySelectorAll('section[id]');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.4, rootMargin: `-${nav.offsetHeight}px 0px 0px 0px` });
sections.forEach(s => sectionObserver.observe(s));

/* ─────────────────────────────────────────────────────────────
   4. MOBILE HAMBURGER
───────────────────────────────────────────────────────────── */
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
  const [s1, s2, s3] = navToggle.querySelectorAll('span');
  if (isOpen) {
    s1.style.transform = 'translateY(7px) rotate(45deg)';
    s2.style.opacity   = '0';
    s3.style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    s1.style.transform = s3.style.transform = '';
    s2.style.opacity   = '';
  }
});

navMenu.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    const [s1, s2, s3] = navToggle.querySelectorAll('span');
    s1.style.transform = s3.style.transform = '';
    s2.style.opacity   = '';
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ─────────────────────────────────────────────────────────────
   5. TYPEWRITER TERMINAL
───────────────────────────────────────────────────────────── */
const terminalEl = document.getElementById('terminalText');
const phrases = [
  'analyze --target network-traffic.pcap',
  'running IS audit compliance check...',
  'export case-report --format PDF',
  'scan --type vulnerability --depth full',
  'study ccna module 4 — routing protocols',
  'git commit -m "forensics lab complete"',
];

let pIdx = 0, cIdx = 0, deleting = false;

function typewriter() {
  const phrase = phrases[pIdx];
  if (!deleting) {
    terminalEl.textContent = phrase.slice(0, ++cIdx);
    if (cIdx === phrase.length) {
      setTimeout(() => { deleting = true; typewriter(); }, 2000);
      return;
    }
  } else {
    terminalEl.textContent = phrase.slice(0, --cIdx);
    if (cIdx === 0) {
      deleting = false;
      pIdx = (pIdx + 1) % phrases.length;
    }
  }
  setTimeout(typewriter, deleting ? 35 : 72);
}
setTimeout(typewriter, 1400);

/* ─────────────────────────────────────────────────────────────
   6. SCROLL REVEAL
───────────────────────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const siblings = entry.target.parentElement.querySelectorAll('.reveal');
      const idx = [...siblings].indexOf(entry.target);
      entry.target.style.transitionDelay = `${idx * 0.08}s`;
      entry.target.classList.add('is-vis');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─────────────────────────────────────────────────────────────
   7. SKILL BAR ANIMATIONS
───────────────────────────────────────────────────────────── */
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.bar__fill').forEach((fill, i) => {
        setTimeout(() => { fill.style.width = fill.dataset.w + '%'; }, i * 130);
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-card').forEach(card => barObserver.observe(card));

/* ─────────────────────────────────────────────────────────────
   8. PROJECT FILTER TABS
───────────────────────────────────────────────────────────── */
document.querySelectorAll('.ftab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.ftab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    document.querySelectorAll('.proj-card').forEach(card => {
      const tags = card.dataset.tags || '';
      const show = filter === 'all' || tags.includes(filter);
      card.style.display = show ? '' : 'none';
      if (show) requestAnimationFrame(() => card.classList.add('is-vis'));
    });
  });
});

/* ─────────────────────────────────────────────────────────────
   9. SMOOTH ANCHOR SCROLLING
───────────────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - nav.offsetHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
