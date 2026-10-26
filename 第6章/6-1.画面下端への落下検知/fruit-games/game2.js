// ---------- 1. 定数と要素の参照 ----------
const CATCHER_SPEED = 360;
const MAX_FRAME_TIME = 0.05;
const ITEM_SIZE = 40;
const ITEM_SPEED = 160;
const SPAWN_INTERVAL = 900;
const CATCH_SCORE = 10;
const MAX_LIFE = 3;

const arena = document.getElementById("catch-arena");
const catcher = document.getElementById("catcher");
const scoreDisplay = document.getElementById("score-display");
const lifeDisplay = document.getElementById("life-display");

// ---------- 2. ゲームの状態 ----------
const keys = { left: false, right: false };
let catcherX = 0;
let lastTime = null;
let score = 0;
let life = MAX_LIFE;
let isRunning = true;
let spawnTimerId = null;
let fallingItems = [];

// ---------- 3. キー入力 ----------
function handleKeyDown(event) {
  if (!isRunning) return;
  if (event.key === "ArrowLeft") {
    keys.left = true;
    event.preventDefault();
  } else if (event.key === "ArrowRight") {
    keys.right = true;
    event.preventDefault();
  }
}

function handleKeyUp(event) {
  if (event.key === "ArrowLeft") {
    keys.left = false;
  } else if (event.key === "ArrowRight") {
    keys.right = false;
  }
}

function releaseAllKeys() {
  keys.left = false;
  keys.right = false;
}

// ---------- 4. 籠の位置 ----------
function clampCatcherX(x) {
  const maxX = arena.clientWidth - catcher.offsetWidth;
  return Math.max(0, Math.min(x, maxX));
}

function renderCatcher() {
  catcher.style.left = `${catcherX}px`;
}

function placeCatcherAtCenter() {
  catcherX = clampCatcherX((arena.clientWidth - catcher.offsetWidth) / 2);
  renderCatcher();
}

function updateCatcher(dt) {
  let direction = 0;
  if (keys.left) direction -= 1;
  if (keys.right) direction += 1;
  catcherX = clampCatcherX(catcherX + direction * CATCHER_SPEED * dt);
  renderCatcher();
}

// ---------- 5. ライフ・ダメージ演出・ゲームオーバー ----------
function updateScoreDisplay() {
  scoreDisplay.textContent = score;
}

function updateLifeDisplay() {
  lifeDisplay.textContent = "❤".repeat(life) + "♡".repeat(MAX_LIFE - life);
}

function flashArena() {
  arena.classList.add("hit");
  setTimeout(() => arena.classList.remove("hit"), 300);
}

function loseLife() {
  life--;
  updateLifeDisplay();
  flashArena();
  if (life <= 0) {
    endGame2();
  }
}

function showGameOverMessage() {
  const overlay = document.createElement("div");
  overlay.classList.add("overlay");

  const title = document.createElement("p");
  title.classList.add("overlay-title");
  title.textContent = "GAME OVER";

  const result = document.createElement("p");
  result.classList.add("overlay-text");
  result.textContent = `SCORE ${score}`;

  overlay.append(title, result);
  arena.appendChild(overlay);
}

function endGame2() {
  isRunning = false;
  clearTimeout(spawnTimerId);
  showGameOverMessage();
}

// ---------- 6. 果物（落ちてくるもの）とイベント処理 ----------
function renderItem(item) {
  item.el.style.left = `${item.x}px`;
  item.el.style.top = `${item.y}px`;
}

function spawnItem() {
  if (!isRunning) return;
  const fruit = FRUITS[Math.floor(Math.random() * FRUITS.length)];

  const el = document.createElement("div");
  el.classList.add("falling-item");
  el.textContent = fruit.emoji;

  const item = {
    el: el,
    x: Math.random() * (arena.clientWidth - ITEM_SIZE),
    y: -ITEM_SIZE,
    type: "fruit", // 6-1節 基準タイプ指定
  };
  renderItem(item);
  arena.appendChild(el);
  fallingItems.push(item);
}

function removeItem(index) {
  fallingItems[index].el.remove();
  fallingItems.splice(index, 1);
}

function handleCatch(item, index) {
  if (item.type === "fruit") {
    score += CATCH_SCORE;
    updateScoreDisplay();
  }
  removeItem(index);
}

function handleMiss(item) {
  if (item.type === "fruit") {
    loseLife();
  }
}

// ---------- 7. 当たり判定（AABB） ----------
function getCatcherRect() {
  return {
    x: catcherX,
    y: arena.clientHeight - catcher.offsetHeight,
    w: catcher.offsetWidth,
    h: catcher.offsetHeight,
  };
}

function getItemRect(item) {
  return { x: item.x, y: item.y, w: ITEM_SIZE, h: ITEM_SIZE };
}

function isOverlapping(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + b.h > b.y
  );
}

function updateItems(dt) {
  const catcherRect = getCatcherRect();
  for (let i = fallingItems.length - 1; i >= 0; i--) {
    const item = fallingItems[i];
    item.y += ITEM_SPEED * dt;
    renderItem(item);

    if (isOverlapping(catcherRect, getItemRect(item))) {
      handleCatch(item, i);
    } else if (item.y > arena.clientHeight) {
      handleMiss(item);
      removeItem(i);
    }
  }
}

// ---------- 8. ゲームループ ----------
function gameLoop(timestamp) {
  if (!isRunning) return;
  if (lastTime === null) lastTime = timestamp;
  const dt = Math.min((timestamp - lastTime) / 1000, MAX_FRAME_TIME);
  lastTime = timestamp;

  updateCatcher(dt);
  updateItems(dt);

  requestAnimationFrame(gameLoop);
}

// ---------- 9. ゲーム開始 ----------
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);
window.addEventListener("blur", releaseAllKeys);
placeCatcherAtCenter();
updateLifeDisplay(); // 初期ライフ表示の更新
spawnTimerId = setInterval(spawnItem, SPAWN_INTERVAL);
requestAnimationFrame(gameLoop);