const pickle = document.getElementById('pickle');
const scoreEl = document.getElementById('score');
const highscoreEl = document.getElementById('highscore');
const gameArea = document.getElementById('game-area');

let score = 0;
let highscore = localStorage.getItem('highscore') || 0;
highscoreEl.textContent = highscore;

let holding = false;
let pickleY = 20; // actual vertical position (logical)
let objects = []; // clouds and birds

document.addEventListener('keydown', e => {
  if (e.code === 'Space') holding = true;
});

document.addEventListener('keyup', e => {
  if (e.code === 'Space') {
    holding = false;
    score = 0;
    pickleY = 20;
    pickle.style.bottom = pickleY + 'px';

    // remove clouds and birds
    objects.forEach(obj => obj.remove());
    objects = [];

    scoreEl.textContent = score;
  }
});

// Spawn a cloud
function spawnCloud(y) {
  const cloud = document.createElement('div');
  cloud.className = 'cloud';
  cloud.style.bottom = y + 'px';
  cloud.style.left = Math.random() * 500 + 'px';
  gameArea.appendChild(cloud);
  objects.push(cloud);
}

// Spawn a bird
function spawnBird(y) {
  const bird = document.createElement('div');
  bird.className = 'bird';
  bird.style.bottom = y + 'px';
  bird.style.left = Math.random() * 500 + 'px';
  gameArea.appendChild(bird);
  objects.push(bird);
}

function gameLoop() {
  if (holding) {
    pickleY += 3;
    score += 1;
    scoreEl.textContent = score;

    // Keep pickle in middle of the game area
    const gameHeight = gameArea.clientHeight;
    let pickleScreenPos = gameHeight / 2 - 40; // half pickle height
    pickle.style.bottom = pickleScreenPos + 'px';

    // Move clouds and birds down to simulate upward movement
    objects.forEach(obj => {
      let currentBottom = parseFloat(obj.style.bottom);
      obj.style.bottom = currentBottom - 3 + 'px';
    });

    // Remove objects that are below screen
    objects = objects.filter(obj => {
      if (parseFloat(obj.style.bottom) + obj.offsetHeight < 0) {
        obj.remove();
        return false;
      }
      return true;
    });

    // Randomly spawn new clouds and birds above screen
    if (Math.random() < 0.02) spawnCloud(gameHeight + Math.random() * 200);
    if (Math.random() < 0.01) spawnBird(gameHeight + Math.random() * 200);

    // Update highscore
    if (score > highscore) {
      highscore = score;
      localStorage.setItem('highscore', highscore);
      highscoreEl.textContent = highscore;
    }
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
