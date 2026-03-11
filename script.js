// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// ==========================================
// Custom Cursor
// ==========================================
const cursorDot = document.querySelector('.cursor-dot');
const cursorHeart = document.querySelector('.cursor-heart');

// Mouse movement listener
window.addEventListener('mousemove', (e) => {
  const posX = e.clientX;
  const posY = e.clientY;

  // Dot moves instantly
  cursorDot.style.left = `${posX}px`;
  cursorDot.style.top = `${posY}px`;

  // Heart follows with a slight delay using GSAP
  gsap.to(cursorHeart, {
    x: posX,
    y: posY,
    duration: 0.15,
    ease: "power2.out"
  });
});

// Cursor changes on hoverable elements
const hoverables = document.querySelectorAll('button, a');
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
    soundIcon.classList.remove('fa-volume-high');
    soundIcon.classList.add('fa-volume-xmark');
  } else {
    bgMusic.play();
    soundIcon.classList.remove('fa-volume-xmark');
    soundIcon.classList.add('fa-volume-high');
  }
  isPlaying = !isPlaying;
});

// Play music on first interaction if not playing
document.body.addEventListener('click', () => {
  if (!isPlaying) {
    // Uncomment this if you want auto-play after 1st click
    // bgMusic.play();
    // soundIcon.classList.remove('fa-volume-xmark');
    // soundIcon.classList.add('fa-volume-high');
    // isPlaying = true;
  }
}, { once: true });

// ==========================================
// Hero Animations
// ==========================================
window.addEventListener('load', () => {
  const tl = gsap.timeline();

  // Pulse the heart infinitely
  gsap.to('.hero .heart-icon', {
    scale: 1.2,
    duration: 0.8,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

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
  }, "-=0.5")
  .fromTo('.scroll-indicator', 
    { opacity: 0 }, 
    { opacity: 1, duration: 1 }
  );
});

// Hero Parallax on Scroll
gsap.to('.hero-bg', {
  yPercent: 30,
  ease: "none",
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: true
  }
});

// ==========================================
// Heart Game Logic
// ==========================================
const heartBtn = document.getElementById('escaping-heart');
const gameMessage = document.getElementById('game-message');
const gameUnlocked = document.getElementById('game-unlocked');
let attempts = 0;

const messages = [
  "Oops 😜 try again!",
  "Too slow! 🏃‍♂️💨",
  "Almost got it! 😂"
];

heartBtn.addEventListener('mouseenter', escapeHeart);
heartBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  escapeHeart();
});

function escapeHeart() {
  if (attempts >= 3) return; // Game over

  attempts++;
  
  if (attempts < 3) {
    // Escape logic
    const container = document.querySelector('.game-container');
    const containerRect = container.getBoundingClientRect();
    const btnRect = heartBtn.getBoundingClientRect();
    
    // Calculate safe boundaries within the container
    const padding = 20;
    const maxX = (containerRect.width / 2) - (btnRect.width / 2) - padding;
    const maxY = (containerRect.height / 2) - (btnRect.height / 2) - padding;
    
    const randomX = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * maxX * 0.8 + maxX * 0.2);
    const randomY = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * maxY * 0.8 + maxY * 0.2);
    
    gsap.to(heartBtn, {
      x: randomX,
      y: randomY,
      duration: attempts === 1 ? 0.25 : 0.15,
      ease: "power2.out"
    });
    
    gameMessage.innerText = messages[attempts - 1];
    
  } else {
    // Third attempt, stays and unlocks
    gsap.to(heartBtn, {
      x: 0,
      y: 0,
      scale: 1.2,
      duration: 0.5,
      ease: "elastic.out(1, 0.3)"
    });
    gameMessage.innerText = "";
    gameUnlocked.style.display = "block";
    gsap.to(window, {scrollTo: "#memory", duration: 1.5, delay: 2});
  }
}

// ==========================================
// Memory Section Animation
// ==========================================
gsap.to('.memory-frame', {
  scale: 1,
  opacity: 1,
  duration: 1.5,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".memory",
    start: "top 60%",
  }
});

gsap.to('.memory-caption', {
  y: 0,
  opacity: 1,
  duration: 1,
  delay: 0.5,
  scrollTrigger: {
    trigger: ".memory",
    start: "top 60%",
  }
});

// ==========================================
// Love Letter Logic
// ==========================================
const openLetterBtn = document.getElementById('open-letter-btn');
const envelope = document.getElementById('envelope');

openLetterBtn.addEventListener('click', () => {
  envelope.classList.toggle('is-open');
  if (envelope.classList.contains('is-open')) {
    openLetterBtn.innerText = "Close Letter";
  } else {
    openLetterBtn.innerText = "Open Letter";
  }
});

// ==========================================
// Cake Cutting Logic
// ==========================================
const cake = document.getElementById('cake');
const knife = document.getElementById('knife');
const birthdayReveal = document.getElementById('birthday-reveal');
const cakeInstructions = document.getElementById('cake-instructions');
let isCakeCut = false;

cake.addEventListener('click', () => {
  if (isCakeCut) return;
  isCakeCut = true;
  
  // Hide instructions
  gsap.to(cakeInstructions, { opacity: 0, duration: 0.3 });

  // Knife Animation Sequence
  const tl = gsap.timeline();
  
  tl.to(knife, {
    opacity: 1,
    right: 50,
    top: 100,
    duration: 0.5,
    ease: "power2.out"
  })
  .to(knife, {
    y: 80, // slice down
    rotation: -10,
    duration: 0.5,
    ease: "power1.in"
  })
  .call(() => {
    // Break the cake
    cake.classList.add('is-cut');
    
    // Fire confetti
    fireConfetti();
    
    // Show magical birthday reveal
    gsap.to(birthdayReveal, {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: "back.out(1.7)"
    });
  })
  .to(knife, {
    opacity: 0,
    y: 150,
    duration: 0.5
  });
});

function fireConfetti() {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    
    confetti(Object.assign({}, defaults, { 
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
    }));
    confetti(Object.assign({}, defaults, { 
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
    }));
  }, 250);
}

// ==========================================
// Finale Animation
// ==========================================
const finaleTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".finale",
    start: "top 50%"
  }
});

finaleTl.to('.finale-content h2', {
  opacity: 1,
  y: -20,
  duration: 1,
  ease: "power2.out"
})
.to('.finale-content h1', {
  opacity: 1,
  scale: 1.1,
  duration: 1.5,
  ease: "elastic.out(1, 0.3)"
}, "-=0.5")
.to('.finale-content p', {
  opacity: 1,
  duration: 1
}, "-=0.5");

// ==========================================
// Ambient Particles Logic
// ==========================================
const particlesRoot = document.getElementById('particles-root');
const colors = ['#ff4b72', '#ffe6eb', '#f4d03f', '#ffffff'];

function createParticle() {
  const particle = document.createElement('div');
  const size = Math.random() * 10 + 5;
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.background = color;
  particle.style.position = 'absolute';
  particle.style.borderRadius = '50%';
  particle.style.opacity = Math.random() * 0.5 + 0.2;
  particle.style.left = `${Math.random() * 100}vw`;
  particle.style.bottom = '-20px';
  particle.style.boxShadow = `0 0 ${size}px ${color}`;
  
  // Occasional heart shapes instead of dots
  if (Math.random() > 0.8) {
    particle.innerHTML = '<i class="fa-solid fa-heart"></i>';
    particle.style.background = 'transparent';
    particle.style.color = color;
    particle.style.fontSize = `${size * 2}px`;
    particle.style.display = 'flex';
    particle.style.justifyContent = 'center';
    particle.style.alignItems = 'center';
    particle.style.boxShadow = 'none';
  }

  particlesRoot.appendChild(particle);

  gsap.to(particle, {
    y: -(window.innerHeight + 100),
    x: `+=${Math.random() * 200 - 100}`,
    rotation: Math.random() * 360,
    duration: Math.random() * 10 + 10,
    ease: "none",
    onComplete: () => {
      particle.remove();
    }
  });
}

// Continuously spawn particles
setInterval(createParticle, 400);
