// ==========================================
// GSAP + Plugins
// ==========================================
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ==========================================
// LOADING SCREEN
// ==========================================
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loading-screen').classList.add('fade-out');
    gsap.to('#main-content', { opacity: 1, duration: 1, ease: 'power2.out' });
    initParticles();
    initHeroCanvas();
    spawnPetals();
    spawnHero3DHearts();
    initScrollAnimations();
    initReasonsObserver();
    initFinaleCanvas();
  }, 1800);
});

// ==========================================
// CUSTOM CURSOR
// ==========================================
const cursorRing = document.querySelector('.cursor-ring');
const cursorDot  = document.querySelector('.cursor-dot-inner');
let mx = -200, my = -200;
let trailThrottle = 0;

window.addEventListener('mousemove', (e) => {
  mx = e.clientX; my = e.clientY;
  gsap.to(cursorRing, { x: mx, y: my, duration: 0.18, ease: 'power2.out' });
  gsap.set(cursorDot, { x: mx, y: my });

  // Throttled trail hearts
  trailThrottle++;
  if (trailThrottle % 6 === 0) spawnTrailHeart(mx, my);
});

document.querySelectorAll('button, .cake-3d, .puzzle-word, .polaroid-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
});

function spawnTrailHeart(x, y) {
  const h = document.createElement('div');
  h.className = 'trail-heart';
  h.innerHTML = '❤';
  h.style.left = x + 'px';
  h.style.top  = y + 'px';
  document.getElementById('cursor-trail').appendChild(h);
  setTimeout(() => h.remove(), 800);
}

// ==========================================
// AMBIENT PARTICLES
// ==========================================
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.5,
    vx: (Math.random() - 0.5) * 0.3,
    vy: -Math.random() * 0.4 - 0.1,
    alpha: Math.random() * 0.5 + 0.1,
    color: Math.random() > 0.5 ? '255,75,114' : '244,200,66'
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ==========================================
// HERO CANVAS — Starfield + Nebula
// ==========================================
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const stars = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.2 + 0.2,
    twinkle: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.02 + 0.005,
    alpha: Math.random() * 0.8 + 0.2
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Nebula blobs
    const neb = [
      { x: canvas.width * 0.2, y: canvas.height * 0.3, r: 250, color: '255,75,114', a: 0.06 },
      { x: canvas.width * 0.8, y: canvas.height * 0.6, r: 200, color: '100,30,180', a: 0.05 },
      { x: canvas.width * 0.5, y: canvas.height * 0.5, r: 300, color: '255,75,114', a: 0.03 }
    ];
    neb.forEach(n => {
      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
      g.addColorStop(0, `rgba(${n.color},${n.a})`);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    });

    // Stars
    stars.forEach(s => {
      s.twinkle += s.speed;
      const alpha = s.alpha * (0.6 + 0.4 * Math.sin(s.twinkle));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,220,230,${alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ==========================================
// FLOATING PETALS
// ==========================================
function spawnPetals() {
  const container = document.getElementById('floating-petals');
  const symbols = ['❤', '♡', '✦', '✿', '❋'];
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    p.style.left = Math.random() * 100 + 'vw';
    p.style.fontSize = (Math.random() * 14 + 8) + 'px';
    p.style.color = Math.random() > 0.5 ? 'rgba(255,75,114,0.6)' : 'rgba(244,200,66,0.5)';
    p.style.animationDuration = (Math.random() * 8 + 6) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    container.appendChild(p);
  }
}

// ==========================================
// HERO 3D FLOATING HEARTS
// ==========================================
function spawnHero3DHearts() {
  const container = document.getElementById('hero3dHearts');
  for (let i = 0; i < 12; i++) {
    const h = document.createElement('div');
    h.className = 'h3d';
    h.textContent = Math.random() > 0.5 ? '❤' : '✦';
    h.style.left  = (Math.random() * 100) + '%';
    h.style.top   = (Math.random() * 100) + '%';
    h.style.fontSize = (Math.random() * 20 + 12) + 'px';
    h.style.color = Math.random() > 0.6 ? 'rgba(255,75,114,0.5)' : 'rgba(244,200,66,0.4)';
    h.style.animationDuration  = (Math.random() * 5 + 4) + 's';
    h.style.animationDelay     = (Math.random() * 6) + 's';
    container.appendChild(h);
  }
}

// ==========================================
// AUDIO
// ==========================================
const bgMusic    = document.getElementById('bg-music');
const sfxChime   = document.getElementById('sfx-chime');
const sfxPaper   = document.getElementById('sfx-paper');
const soundToggle = document.getElementById('sound-toggle');
const soundIcon  = soundToggle.querySelector('i');
let isPlaying = false;

function tryPlay(audio) {
  if (audio) audio.play().catch(() => {});
}

const unlockAudio = () => {
  if (!isPlaying) {
    bgMusic.volume = 0;
    bgMusic.play().then(() => {
      isPlaying = true;
      soundIcon.classList.replace('fa-volume-xmark', 'fa-volume-high');
      // Fade in
      let v = 0;
      const fadeIn = setInterval(() => {
        v = Math.min(v + 0.03, 0.55);
        bgMusic.volume = v;
        if (v >= 0.55) clearInterval(fadeIn);
      }, 100);
    }).catch(() => {});
  }
};

['click','touchstart','scroll'].forEach(ev =>
  document.body.addEventListener(ev, unlockAudio, { once: true })
);

soundToggle.addEventListener('click', () => {
  if (isPlaying) {
    bgMusic.pause();
    soundIcon.classList.replace('fa-volume-high', 'fa-volume-xmark');
  } else {
    bgMusic.play().catch(() => {});
    soundIcon.classList.replace('fa-volume-xmark', 'fa-volume-high');
  }
  isPlaying = !isPlaying;
});

// ==========================================
// START JOURNEY BUTTON
// ==========================================
document.getElementById('start-journey').addEventListener('click', () => {
  unlockAudio();
  gsap.to(window, { scrollTo: '#heart-game', duration: 1.5, ease: 'power2.inOut' });
});

// ==========================================
// HEART GAME
// ==========================================
const heartBtn     = document.getElementById('escaping-heart');
const gameUnlocked = document.getElementById('game-unlocked');
const heartArena   = document.getElementById('heart-arena');
let attempts = 0;

function playBounce() {
  gsap.to(heartBtn, { scale: 1.4, duration: 0.1, yoyo: true, repeat: 1 });
}

function escapeHeart() {
  if (attempts >= 4) return;
  attempts++;
  playBounce();

  if (attempts < 4) {
    const maxX = heartArena.offsetWidth  / 2 - 50;
    const maxY = heartArena.offsetHeight / 2 - 50;
    const x = (Math.random() - 0.5) * 2 * maxX;
    const y = (Math.random() - 0.5) * 2 * maxY;
    gsap.to(heartBtn, { x, y, duration: 0.25, ease: 'power3.out' });
  } else {
    gsap.to(heartBtn, { x: 0, y: 0, scale: 2, duration: 0.6, ease: 'elastic.out(1,0.4)',
      onComplete: () => {
        gsap.to(heartBtn, { scale: 1.5, duration: 0.3 });
        document.querySelector('.game-container').style.display = 'none';
        gameUnlocked.style.display = 'flex';
        // Heart burst confetti
        confetti({ particleCount: 80, spread: 120, origin: { y: 0.5 }, colors: ['#ff4b72','#d81b47','#f4c842','#fff'] });
        tryPlay(sfxChime);
        setTimeout(() => gsap.to(window, { scrollTo: '#memory', duration: 1.5 }), 2200);
      }
    });
  }
}

heartBtn.addEventListener('mouseenter', escapeHeart);
heartBtn.addEventListener('touchstart', (e) => { e.preventDefault(); escapeHeart(); });

// ==========================================
// POLAROID FLIP (MEMORY)
// ==========================================
const polaroid = document.getElementById('polaroid');
if (polaroid) {
  polaroid.addEventListener('click', () => {
    polaroid.classList.toggle('flipped');
    tryPlay(sfxPaper);
  });
}

// ==========================================
// LOVE LETTER (3D ENVELOPE)
// ==========================================
const envelope3d     = document.getElementById('envelope3d');
const openLetterBtn  = document.getElementById('open-letter-btn');
let letterOpen = false;

openLetterBtn.addEventListener('click', () => {
  letterOpen = !letterOpen;
  envelope3d.classList.toggle('is-open', letterOpen);
  openLetterBtn.querySelector('span').textContent = letterOpen ? 'Close Letter' : 'Open My Letter';
  if (letterOpen) {
    tryPlay(sfxPaper);
    // Ambient letter hearts
    spawnLetterHearts();
  }
});

function spawnLetterHearts() {
  const container = document.getElementById('letter-hearts');
  container.innerHTML = '';
  for (let i = 0; i < 12; i++) {
    const h = document.createElement('div');
    h.className = 'amb-heart';
    h.textContent = Math.random() > 0.5 ? '❤' : '♡';
    h.style.left   = Math.random() * 100 + '%';
    h.style.bottom = (Math.random() * 40) + '%';
    h.style.fontSize = (Math.random() * 20 + 10) + 'px';
    h.style.animationDuration = (Math.random() * 4 + 3) + 's';
    h.style.animationDelay    = (Math.random() * 3) + 's';
    container.appendChild(h);
  }
}

// ==========================================
// LOVE PUZZLE
// ==========================================
const puzzleContainer = document.getElementById('puzzle-container');
const puzzleStatus    = document.getElementById('puzzle-status');
const secretMessage   = ['You', 'Are', 'My', 'Everything', 'Sana'];
const shuffled = [...secretMessage].sort(() => Math.random() - 0.5);

function initPuzzle() {
  puzzleContainer.innerHTML = '';
  shuffled.forEach(word => {
    const el = document.createElement('div');
    el.className = 'puzzle-word';
    el.textContent = word;
    puzzleContainer.appendChild(el);
  });
  new Sortable(puzzleContainer, {
    animation: 200,
    ghostClass: 'sortable-ghost',
    onEnd: checkPuzzle
  });
}

function checkPuzzle() {
  const current = [...puzzleContainer.children].map(el => el.textContent);
  if (JSON.stringify(current) === JSON.stringify(secretMessage)) {
    puzzleStatus.innerHTML = '✦ You truly are my heart\'s only desire ✦<br>Every piece of my life fits perfectly with you. ❤️';
    tryPlay(sfxChime);
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.7 }, colors: ['#ff4b72','#f4c842','#ffffff'] });
    // Rainbow confetti
    setTimeout(() => confetti({ particleCount: 80, angle: 60, spread: 55, origin: { x: 0 } }), 400);
    setTimeout(() => confetti({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1 } }), 600);
    setTimeout(() => gsap.to(window, { scrollTo: '#reasons-section', duration: 1.5 }), 3500);
  } else {
    puzzleStatus.textContent = 'Rearrange to reveal my heart…';
  }
}
initPuzzle();

// ==========================================
// REASONS SECTION OBSERVER
// ==========================================
function initReasonsObserver() {
  const cards = document.querySelectorAll('.reason-card');
  cards.forEach(c => c.style.setProperty('--d', c.dataset.delay || '0'));

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.15 });

  cards.forEach(c => obs.observe(c));
}

// ==========================================
// CAKE SECTION
// ==========================================
const cake           = document.getElementById('cake');
const birthdayReveal = document.getElementById('birthday-reveal');
const flames         = document.querySelectorAll('.flame');
let candlesBlown = false;

cake.addEventListener('click', blowCandles);
cake.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') blowCandles(); });

function blowCandles() {
  if (candlesBlown) return;
  candlesBlown = true;
  tryPlay(sfxChime);

  // Stop spinning
  cake.style.animation = 'none';

  // Blow out flames with stagger
  flames.forEach((f, i) => {
    setTimeout(() => f.classList.add('out'), i * 150);
  });

  // Mega confetti
  setTimeout(() => {
    confetti({ particleCount: 250, spread: 120, origin: { y: 0.5 }, colors: ['#ff4b72','#f4c842','#ffffff','#d81b47','#ffb3c1'] });
    setTimeout(() => confetti({ particleCount: 100, angle: 60,  spread: 80, origin: { x: 0, y: 0.6 } }), 300);
    setTimeout(() => confetti({ particleCount: 100, angle: 120, spread: 80, origin: { x: 1, y: 0.6 } }), 500);

    birthdayReveal.classList.add('show');

    setTimeout(() => gsap.to(window, { scrollTo: '#finale', duration: 2, ease: 'power2.inOut' }), 3500);
  }, 600);
}

// ==========================================
// FINALE CANVAS — Fireworks
// ==========================================
function initFinaleCanvas() {
  const canvas = document.getElementById('finale-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Spawn finale hearts decoration
  const finHearts = document.getElementById('finale-hearts');
  for (let i = 0; i < 20; i++) {
    const h = document.createElement('div');
    h.className = 'fin-heart';
    h.textContent = Math.random() > 0.5 ? '❤' : '✦';
    h.style.left   = Math.random() * 100 + '%';
    h.style.bottom = Math.random() * 80 + '%';
    h.style.fontSize = (Math.random() * 18 + 8) + 'px';
    h.style.animationDuration = (Math.random() * 8 + 5) + 's';
    h.style.animationDelay    = (Math.random() * 6) + 's';
    finHearts.appendChild(h);
  }

  // Firework particles
  class Firework {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height * 0.7;
      this.particles = [];
      const count = 60;
      const colors = ['#ff4b72','#f4c842','#ffffff','#ffb3c1','#d81b47'];
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        this.particles.push({
          x: this.x, y: this.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          r: Math.random() * 2 + 1
        });
      }
      this.alive = true;
      this.delay = Math.random() * 180 + 60;
      this.timer = 0;
    }
    update() {
      this.timer++;
      if (this.timer < this.delay) return;
      this.particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.vy += 0.04;
        p.vx *= 0.97;
        p.alpha -= 0.018;
      });
      this.particles = this.particles.filter(p => p.alpha > 0);
      if (this.particles.length === 0) this.reset();
    }
    draw() {
      if (this.timer < this.delay) return;
      this.particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    }
  }

  const fireworks = Array.from({ length: 5 }, () => new Firework());

  // Only run when finale is visible
  let finaleRunning = false;
  const finObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !finaleRunning) {
      finaleRunning = true;
      loop();
      // Trigger confetti burst on enter
      confetti({ particleCount: 200, spread: 160, origin: { y: 0.4 }, colors: ['#ff4b72','#f4c842','#fff'] });
    }
  }, { threshold: 0.3 });
  finObs.observe(document.getElementById('finale'));

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fireworks.forEach(f => { f.update(); f.draw(); });
    if (finaleRunning) requestAnimationFrame(loop);
  }
}

// ==========================================
// SCROLL ANIMATIONS (GSAP)
// ==========================================
function initScrollAnimations() {
  // Memory polaroid entrance
  gsap.from('.memory-3d-frame', {
    scrollTrigger: { trigger: '#memory', start: 'top 65%' },
    opacity: 0, y: 60, rotateX: 20, duration: 1.4, ease: 'back.out(1.7)'
  });

  // Love letter section title
  gsap.from('.letter-scene > *', {
    scrollTrigger: { trigger: '#love-letter', start: 'top 65%' },
    opacity: 0, y: 40, stagger: 0.2, duration: 1, ease: 'power3.out'
  });

  // Puzzle card
  gsap.from('.game-card', {
    scrollTrigger: { trigger: '#romantic-game', start: 'top 65%' },
    opacity: 0, y: 50, scale: 0.95, duration: 1.2, ease: 'back.out(1.4)'
  });

  // Cake section
  gsap.from('.cake-wrapper', {
    scrollTrigger: { trigger: '#cake-section', start: 'top 65%' },
    opacity: 0, y: 60, scale: 0.85, duration: 1.4, ease: 'back.out(1.7)'
  });

  // Section headings parallax
  gsap.utils.toArray('.section-heading').forEach(h => {
    gsap.from(h, {
      scrollTrigger: { trigger: h, start: 'top 75%' },
      opacity: 0, y: 30, duration: 1, ease: 'power3.out'
    });
  });

  // Finale content stagger
  gsap.from('.finale-content > *', {
    scrollTrigger: { trigger: '#finale', start: 'top 70%' },
    opacity: 0, y: 40, stagger: 0.25, duration: 1.2, ease: 'power3.out'
  });
}

// ==========================================
// PARALLAX TILT on polaroid (mouse)
// ==========================================
document.addEventListener('mousemove', (e) => {
  const polar = document.querySelector('.polaroid-front');
  if (!polar) return;
  const rect = document.getElementById('memory').getBoundingClientRect();
  if (rect.top < window.innerHeight && rect.bottom > 0) {
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width  / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    if (!document.getElementById('polaroid').classList.contains('flipped')) {
      gsap.to('#polaroid', { rotateY: dx * 12, rotateX: -dy * 8, duration: 0.6, ease: 'power2.out', transformPerspective: 800 });
    }
  }
});
