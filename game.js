const GRID = 24;
const CELL = 10;
const HIGHSCORE_KEY = "pixelSnakeHighscore";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const highscoreEl = document.getElementById("highscore");
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlay-title");
const overlayText = document.getElementById("overlay-text");
const overlayBtn = document.getElementById("overlay-btn");

const COLORS = {
  bg: "#0d1117",
  grid: "#151c2b",
  snake: "#35e065",
  snakeDark: "#1fae4e",
  head: "#7dffa8",
  apple: "#ff4757",
  appleLight: "#ff8a94",
  leaf: "#2ed573",
  eye: "#0d1117"
};

let snake = [];
let dir = { x: 1, y: 0 };
let pendingDir = dir;
let apple = { x: 0, y: 0 };
let score = 0;
let highscore = Number(localStorage.getItem(HIGHSCORE_KEY)) || 0;
let state = "ready";
let paused = false;
let acc = 0;
let lastTime = 0;

function reset() {
  snake = [
    { x: 8, y: 12 },
    { x: 7, y: 12 },
    { x: 6, y: 12 }
  ];
  dir = { x: 1, y: 0 };
  pendingDir = dir;
  score = 0;
  paused = false;
  acc = 0;
  spawnApple();
  updateHud();
}

function spawnApple() {
  do {
    apple = {
      x: Math.floor(Math.random() * GRID),
      y: Math.floor(Math.random() * GRID)
    };
  } while (snake.some((s) => s.x === apple.x && s.y === apple.y));
}

function stepMs() {
  return Math.max(70, 150 - Math.floor(score / 10) * 6);
}

function tick() {
  dir = pendingDir;
  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

  const hitWall = head.x < 0 || head.y < 0 || head.x >= GRID || head.y >= GRID;
  const hitSelf = snake.some((s) => s.x === head.x && s.y === head.y);
  if (hitWall || hitSelf) {
    gameOver();
    return;
  }

  snake.unshift(head);
  if (head.x === apple.x && head.y === apple.y) {
    score += 10;
    spawnApple();
    updateHud();
  } else {
    snake.pop();
  }
}

function loop(t) {
  requestAnimationFrame(loop);
  if (state !== "playing" || paused) {
    lastTime = t;
    return;
  }
  if (!lastTime) lastTime = t;
  acc += t - lastTime;
  lastTime = t;
  const step = stepMs();
  while (acc >= step) {
    acc -= step;
    tick();
    if (state !== "playing") return;
  }
  draw();
}

function draw() {
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = COLORS.grid;
  for (let x = 0; x < GRID; x++) {
    for (let y = 0; y < GRID; y++) {
      ctx.fillRect(x * CELL + CELL / 2 - 1, y * CELL + CELL / 2 - 1, 2, 2);
    }
  }

  const ax = apple.x * CELL;
  const ay = apple.y * CELL;
  ctx.fillStyle = COLORS.apple;
  ctx.fillRect(ax + 1, ay + 3, CELL - 2, CELL - 4);
  ctx.fillStyle = COLORS.appleLight;
  ctx.fillRect(ax + 2, ay + 4, 3, 2);
  ctx.fillStyle = COLORS.leaf;
  ctx.fillRect(ax + CELL - 5, ay + 1, 3, 3);

  snake.forEach((s, i) => {
    const x = s.x * CELL;
    const y = s.y * CELL;
    ctx.fillStyle = i === 0 ? COLORS.head : i % 2 === 0 ? COLORS.snake : COLORS.snakeDark;
    ctx.fillRect(x + 1, y + 1, CELL - 2, CELL - 2);
  });

  const h = snake[0];
  const hx = h.x * CELL;
  const hy = h.y * CELL;
  ctx.fillStyle = COLORS.eye;
  const e = 2;
  if (dir.x === 1) {
    ctx.fillRect(hx + CELL - 4, hy + 2, e, e);
    ctx.fillRect(hx + CELL - 4, hy + CELL - 4, e, e);
  } else if (dir.x === -1) {
    ctx.fillRect(hx + 2, hy + 2, e, e);
    ctx.fillRect(hx + 2, hy + CELL - 4, e, e);
  } else if (dir.y === -1) {
    ctx.fillRect(hx + 2, hy + 2, e, e);
    ctx.fillRect(hx + CELL - 4, hy + 2, e, e);
  } else {
    ctx.fillRect(hx + 2, hy + CELL - 4, e, e);
    ctx.fillRect(hx + CELL - 4, hy + CELL - 4, e, e);
  }
}

function updateHud() {
  scoreEl.textContent = score;
  highscoreEl.textContent = highscore;
}

function showOverlay(title, text, btnText) {
  overlayTitle.textContent = title;
  overlayText.textContent = text;
  overlayBtn.textContent = btnText;
  overlay.classList.add("visible");
}

function hideOverlay() {
  overlay.classList.remove("visible");
}

function startGame() {
  reset();
  state = "playing";
  hideOverlay();
  draw();
}

function gameOver() {
  state = "over";
  if (score > highscore) {
    highscore = score;
    localStorage.setItem(HIGHSCORE_KEY, String(highscore));
  }
  updateHud();
  showOverlay("GAME OVER", `Punkte: ${score} · Rekord: ${highscore}`, "↻ Nochmal");
}

function togglePause() {
  paused = !paused;
  if (paused) {
    showOverlay("PAUSIERT", "Leertaste drücken zum Weitermachen", "▶ Weiter");
  } else {
    hideOverlay();
  }
}

const DIRS = {
  ArrowUp: { x: 0, y: -1 },
  KeyW: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  KeyS: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  KeyA: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  KeyD: { x: 1, y: 0 }
};

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    if (state === "playing") togglePause();
    else startGame();
    return;
  }
  if (e.code === "Enter" && (state === "ready" || state === "over")) {
    startGame();
    return;
  }
  const d = DIRS[e.code];
  if (!d) return;
  e.preventDefault();
  if (state !== "playing" || paused) return;
  if (d.x === -dir.x && d.y === -dir.y) return;
  pendingDir = d;
});

let touchStart = null;
canvas.addEventListener("touchstart", (e) => {
  touchStart = e.touches[0];
}, { passive: true });
canvas.addEventListener("touchend", (e) => {
  if (!touchStart) return;
  const t = e.changedTouches[0];
  const dx = t.clientX - touchStart.clientX;
  const dy = t.clientY - touchStart.clientY;
  touchStart = null;
  if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
  const d = Math.abs(dx) > Math.abs(dy)
    ? { x: Math.sign(dx), y: 0 }
    : { x: 0, y: Math.sign(dy) };
  if (state === "playing" && !paused && !(d.x === -dir.x && d.y === -dir.y)) {
    pendingDir = d;
  }
}, { passive: true });

overlayBtn.addEventListener("click", () => {
  if (state === "playing" && paused) togglePause();
  else startGame();
});

reset();
updateHud();
showOverlay("PIXEL SNAKE", "Iss die Äpfel und wachse! Gegen die Wand oder dich selbst verlierst du.", "▶ Start");
draw();
requestAnimationFrame(loop);
