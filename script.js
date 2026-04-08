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

  gsap.set(cursorDot, { x: posX, y: posY });
  gsap.to(cursorHeart, {
    x: posX,
    y: posY,
    duration: 0.15,
    ease: "power2.out"
  });
});

// Cursor interaction on buttons
const updateCursorHover = () => {
  const hoverables = document.querySelectorAll('button, .cake, #escaping-heart, .puzzle-word');
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
};
updateCursorHover();

// ==========================================
// Audio Control & Unmuted Start
// ==========================================
const bgMusic = document.getElementById('bg-music');
const soundToggle = document.getElementById('sound-toggle');
const soundIcon = soundToggle.querySelector('i');
const startBtn = document.getElementById('start-journey');
let isPlaying = false;

// Function to start music (unmuted)
const startExperience = () => {
  bgMusic.play().then(() => {
    isPlaying = true;
    soundIcon.classList.replace('fa-volume-xmark', 'fa-volume-high');
    // Scroll to the next section
    gsap.to(window, { scrollTo: "#heart-game", duration: 1.5, ease: "power2.inOut" });
  }).catch(error => {
    console.log("Audio play failed:", error);
  });
};

// Try to autoplay on load
window.addEventListener('load', () => {
  bgMusic.play().then(() => {
    isPlaying = true;
    soundIcon.classList.replace('fa-volume-xmark', 'fa-volume-high');
  }).catch(() => {
    console.log("Autoplay blocked, waiting for interaction");
    // If blocked, any click on body will start it
    document.body.addEventListener('click', () => {
      if (!isPlaying) startExperience();
    }, { once: true });
  });
});

startBtn.addEventListener('click', startExperience);

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

  tl.to('.hero-title', { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" })
    .to('.hero-subtitle', { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, "-=0.8")
    .to('.start-btn', { opacity: 1, y: 0, duration: 1, ease: "back.out(1.7)" }, "-=0.5")
    .from('.scroll-indicator', { opacity: 0, y: -20, duration: 1, repeat: -1, yoyo: true });

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

    gsap.to(heartBtn, { x: x, y: y, duration: 0.2, ease: "power2.out" });
  } else {
    gsap.to(heartBtn, { x: 0, y: 0, scale: 1.5, duration: 0.5 });
    gameUnlocked.style.display = "block";
    gsap.to(window, { scrollTo: "#memory", duration: 1.5, delay: 1 });
  }
}

heartBtn.addEventListener('mouseenter', escapeHeart);
heartBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  escapeHeart();
});

// ==========================================
// Love Puzzle Game
// ==========================================
const puzzleContainer = document.getElementById('puzzle-container');
const puzzleStatus = document.getElementById('puzzle-status');
const secretMessage = ["You", "Are", "My", "Everything", "Sana"];
let shuffledMessage = [...secretMessage].sort(() => Math.random() - 0.5);

function initPuzzle() {
  puzzleContainer.innerHTML = '';
  shuffledMessage.forEach((word, index) => {
    const wordEl = document.createElement('div');
    wordEl.className = 'puzzle-word';
    wordEl.textContent = word;
    wordEl.setAttribute('data-word', word);
    puzzleContainer.appendChild(wordEl);
  });

  new Sortable(puzzleContainer, {
    animation: 150,
    ghostClass: 'sortable-ghost',
    onEnd: checkPuzzle
  });
  
  updateCursorHover();
}

function checkPuzzle() {
  const currentOrder = Array.from(puzzleContainer.children).map(el => el.textContent);
  if (JSON.stringify(currentOrder) === JSON.stringify(secretMessage)) {
    puzzleStatus.innerHTML = "You truly are my heart's only desire. <br> Every piece of my life fits perfectly only with you. ❤️";
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.8 } });
    setTimeout(() => {
      gsap.to(window, { scrollTo: "#cake-section", duration: 1.5 });
    }, 3500);
  } else {
    puzzleStatus.textContent = "Rearrange the words to reveal my heart...";
  }
}

initPuzzle();

// ==========================================
// Cake Cutting Logic
// ==========================================
const cake = document.getElementById('cake');
const flame = document.querySelector('.flame');

cake.addEventListener('click', () => {
  // Magic sound effect on click - using a more reliable URL
  const magicSfx = new Audio('https://www.soundjay.com/buttons/sounds/button-20.mp3');
  magicSfx.play().catch(e => console.log("SFX failed"));
  
  // Secondary chime sound
  const chimeSfx = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-01.mp3');
  setTimeout(() => chimeSfx.play().catch(e => {}), 200);

  gsap.to(flame, { opacity: 0, scale: 0, duration: 0.3 });
  
  // Confetti burst
  confetti({
    particleCount: 200,
    spread: 100,
    origin: { y: 0.6 },
    colors: ['#ff4b72', '#f4d03f', '#ffffff']
  });
  
  gsap.to('.birthday-reveal', {
    opacity: 1,
    scale: 1,
    duration: 1,
    ease: "back.out(1.7)"
  });

  setTimeout(() => {
    gsap.to(window, { scrollTo: "#finale", duration: 2 });
  }, 3000);
});

// ==========================================
// Love Letter Logic
// ==========================================
const openLetterBtn = document.getElementById('open-letter-btn');
const envelope = document.getElementById('envelope');

openLetterBtn.addEventListener('click', () => {
  envelope.classList.toggle('is-open');
  if (envelope.classList.contains('is-open')) {
    openLetterBtn.textContent = "Close Letter";
    // Play a paper sound if possible
    new Audio('https://www.soundjay.com/misc/sounds/paper-flip-1.mp3').play().catch(e => {});
  } else {
    openLetterBtn.textContent = "Open Love Letter";
  }
});

// ==========================================
// Scroll Animations
// ==========================================
gsap.from('.memory-frame', {
  scrollTrigger: { trigger: ".memory", start: "top 60%" },
  scale: 0.8, opacity: 0, rotation: -10, duration: 1.5, ease: "back.out(1.7)"
});

gsap.from('.finale-content h1', {
  scrollTrigger: { trigger: ".finale", start: "top 70%" },
  scale: 0.5, opacity: 0, duration: 1.5, ease: "elastic.out(1, 0.3)"
});
