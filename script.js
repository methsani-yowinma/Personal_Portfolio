/* ── DOM References ──────────────────────────────────────────── */
const nav        = document.getElementById('nav');
const navToggle  = document.getElementById('navToggle');
const navLinks   = document.getElementById('navLinks');
const terminal   = document.getElementById('terminalText');

/* ── 1. Sticky Nav: add shadow/bg on scroll ──────────────────── */
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    nav.classList.add('nav--scrolled');
  } else {
    nav.classList.remove('nav--scrolled');
  }
}, { passive: true });

/* ── 2. Mobile Nav Toggle ────────────────────────────────────── */
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('nav__links--open');
  navToggle.setAttribute('aria-expanded', isOpen);

  // Animate hamburger → X
  const spans = navToggle.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  }
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('nav__links--open');
    navToggle.setAttribute('aria-expanded', 'false');
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  });
});

/* ── 3. Terminal Typewriter Effect ───────────────────────────── */
const phrases = [
  'studying information systems...',
  'learning IS audit frameworks...',
  'exploring cybersecurity concepts...',
  'building real-world projects...',
  'pursuing CCNA & Security+...',
];

let phraseIndex = 0;
let charIndex   = 0;
let isDeleting  = false;
let typingTimer;

function typeWriter() {
  const currentPhrase = phrases[phraseIndex];

  if (!isDeleting) {
    // Typing forward
    terminal.textContent = currentPhrase.slice(0, charIndex + 1);
    charIndex++;

    if (charIndex === currentPhrase.length) {
      // Pause at end before deleting
      typingTimer = setTimeout(() => {
        isDeleting = true;
        typeWriter();
      }, 1800);
      return;
    }
  } else {
    // Deleting
    terminal.textContent = currentPhrase.slice(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }

  // Speed: faster when deleting, slower when typing
  const speed = isDeleting ? 45 : 80;
  typingTimer = setTimeout(typeWriter, speed);
}

// Start typewriter after hero animation settles
setTimeout(typeWriter, 1200);

/* ── 4. Scroll-Reveal (IntersectionObserver) ─────────────────── */
/**
 * Watches for .reveal and .reveal-stagger elements.
 * Adds .is-visible when they enter the viewport.
 */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Unobserve after reveal — no need to re-trigger
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,   // Trigger when 12% of element is visible
    rootMargin: '0px 0px -40px 0px',
  }
);

// Add .reveal to major sections/elements and observe them
function initReveal() {
  // Elements to animate individually
  const revealTargets = document.querySelectorAll(
    '.about__text, .about__path, .skill-card, .project-card, .cert-card, .contact-link, .contact__left'
  );

  revealTargets.forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  // Staggered grids
  const staggerTargets = document.querySelectorAll(
    '.skills__grid, .projects__grid, .certs__grid, .contact__links'
  );

  staggerTargets.forEach(el => {
    el.classList.add('reveal-stagger');
    revealObserver.observe(el);
  });
}

/* ── 5. Skill Bar Animation ──────────────────────────────────── */
/**
 * Animates skill bar widths to their data-width value
 * when the skills section scrolls into view.
 */
const skillBarObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fills = entry.target.querySelectorAll('.skill-item__fill');
        fills.forEach((fill, i) => {
          const targetWidth = fill.getAttribute('data-width');
          // Stagger each bar slightly
          setTimeout(() => {
            fill.style.width = targetWidth;
          }, i * 150);
        });
        skillBarObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

function initSkillBars() {
  const skillCards = document.querySelectorAll('.skill-card');
  skillCards.forEach(card => skillBarObserver.observe(card));
}

/* ── 6. Active Nav Link on Scroll ────────────────────────────── */
/**
 * Highlights the nav link corresponding to the current section.
 */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav__link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          links.forEach(link => {
            link.classList.toggle(
              'nav__link--active',
              link.getAttribute('href') === `#${id}`
            );
          });
        }
      });
    },
    {
      threshold: 0.4,
      rootMargin: `-${nav.offsetHeight}px 0px 0px 0px`,
    }
  );

  sections.forEach(section => sectionObserver.observe(section));
}

/* ── 7. Smooth-scroll for anchor links ───────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = nav.offsetHeight + 16;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── 8. Init everything on DOMContentLoaded ──────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initSkillBars();
  initActiveNav();

  // Add active nav style (CSS for this)
  const style = document.createElement('style');
  style.textContent = `.nav__link--active { color: var(--clr-cyan) !important; }
    .nav__link--active::after { width: 100% !important; }`;
  document.head.appendChild(style);
});
