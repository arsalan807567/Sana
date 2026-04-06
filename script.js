// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// ==========================================
// Custom Cursor
// ==========================================
const cursorDot = document.querySelector('.cursor-dot');
const cursorHeart = document.querySelector('.cursor-heart');

window.addEventListener('mousemove', (e) => {
  const posX = e.clientX;
  const posY = e.clientY;

  // Dot moves instantly
  gsap.set(cursorDot, { x: posX, y: posY });

  // Heart follows with a slight delay
  gsap.to(cursorHeart, {
    x: posX,
    y: posY,
    duration: 0.15,
    ease: "power2.out"
  });
});

// Cursor interaction on buttons
const hoverables = document.querySelectorAll('button, .cake, #escaping-heart');
hoverables.forEach(el => {
  el.addEventListener('mouseenter', () => {
    gsap.to(cursorDot, { scale: 3, backgroundColor: "var(--primary-color)", duration: 0.2 });
    gsap.to(cursorHeart, { scale: 1.5, duration: 0.2 });
  });
  el.addEventListener('mouseleave', () => {
    gsap.to(cursorDot, { scale: 1, backgroundColor: "var(--text-light)", duration: 0.2 });
    gsap.to(cursorHeart, { scale: 1, duration: 0.2 });
  });
});

// ==========================================
// Audio Control
// ==========================================
const bgMusic = document.getElementById('bg-music');
const soundToggle = document.getElementById('sound-toggle');
const soundIcon = soundToggle.querySelector('i');
let isPlaying = false;

soundToggle.addEventListener('click', () => {
  if (isPlaying) {
    bgMusic.pause();
    soundIcon.classList.replace('fa-volume-high', 'fa-volume-xmark');
  } else {
    bgMusic.play();
    soundIcon.classList.replace('fa-volume-xmark', 'fa-volume-high');
  }
  isPlaying = !isPlaying;
});

// ==========================================
// Hero Section Animations
// ==========================================
window.addEventListener('load', () => {
  const tl = gsap.timeline();

  tl.to('.hero-title', {
    opacity: 1,
    y: 0,
    duration: 1.5,
    ease: "power3.out"
  })
  .to('.hero-subtitle', {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power2.out"
  }, "-=0.8")
  .from('.scroll-indicator', {
    opacity: 0,
    y: -20,
    duration: 1,
    repeat: -1,
    yoyo: true
  });

  // Parallax background
  gsap.to('.hero-bg', {
    yPercent: 20,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });
});

// ==========================================
// Heart Game Logic
// ==========================================
const heartBtn = document.getElementById('escaping-heart');
const gameUnlocked = document.getElementById('game-unlocked');
const gameContainer = document.querySelector('.game-container');
let attempts = 0;

function escapeHeart() {
  if (attempts >= 4) return;
  attempts++;

  if (attempts < 4) {
    const rect = gameContainer.getBoundingClientRect();
    const x = (Math.random() - 0.5) * (rect.width - 100);
    const y = (Math.random() - 0.5) * (rect.height - 100);

    gsap.to(heartBtn, {
      x: x,
      y: y,
      duration: 0.2,
      ease: "power2.out"
    });
  } else {
    gsap.to(heartBtn, { x: 0, y: 0, scale: 1.5, duration: 0.5 });
    gameUnlocked.style.display = "block";
    gsap.to(window, { scrollTo: "#memory", duration: 1.5, delay: 1 });
  }
}

heartBtn.addEventListener('mouseenter', escapeHeart);

// ==========================================
// Memory Section Animation
// ==========================================
gsap.from('.memory-frame', {
  scrollTrigger: {
    trigger: ".memory",
    start: "top 60%",
  },
  scale: 0.8,
  opacity: 0,
  rotation: -10,
  duration: 1.5,
  ease: "back.out(1.7)"
});

// ==========================================
// Cake Cutting Logic
// ==========================================
const cake = document.getElementById('cake');
const flame = document.querySelector('.flame');

cake.addEventListener('click', () => {
  gsap.to(flame, { opacity: 0, scale: 0, duration: 0.3 });
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 }
  });
  
  gsap.to('.birthday-reveal', {
    opacity: 1,
    scale: 1,
    duration: 1,
    ease: "back.out(1.7)"
  });
});

// ==========================================
// Finale Animation
// ==========================================
gsap.from('.finale-content h1', {
  scrollTrigger: {
    trigger: ".finale",
    start: "top 70%",
  },
  scale: 0.5,
  opacity: 0,
  duration: 1.5,
  ease: "elastic.out(1, 0.3)"
});
