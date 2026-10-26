// ---------- 1. 定数 ----------
const CATCHER_SPEED = 360;
const MAX_FRAME_TIME = 0.05;
const ITEM_SIZE = 40;

const MAX_LIFE = 3;
const CATCH_SCORE = 10;
const ROTTEN_PENALTY = 20;

const SCORE_PER_LEVEL = 50;
const BASE_SPEED = 140;
const SPEED_PER_LEVEL = 25;
const MAX_SPEED = 360;
const BASE_SPAWN_INTERVAL = 1000;
const INTERVAL_PER_LEVEL = 80;
const MIN_SPAWN_INTERVAL = 350;
const BASE_BAD_RATE = 0.1;
const BAD_RATE_PER_LEVEL = 0.04;
const MAX_BAD_RATE = 0.35;

const BAD_ITEMS = [
  { type: "bomb", emoji: "💣" },
  { type: "rotten", emoji: "🤢" },
];

// ---------- 2. 要素の参照 ----------
const arena = document.getElementById("catch-arena");
const catcher = document.getElementById("catcher");
const scoreDisplay = document.getElementById("score-display");
const lifeDisplay = document.getElementById("life-display");

// LEVEL 表示欄を動的に作成する関数
function createLevelStat() {
  const stat = document.createElement("div");
  stat.classList.add("stat");

  const label = document.createElement("span");
  label.classList.add("stat-label");
  label.textContent = "LEVEL";

  const value = document.createElement("span");
  value.textContent = "1";

  stat.append(label, value);
  document.querySelector("#game2 .status-bar").appendChild(stat);
  return value;
}
const levelDisplay = createLevelStat();

// ---------- 3. ゲームの状態 ----------
const keys = { left: false, right: false };
let catcherX = 0;
let lastTime = null;
let score = 0;
let life = MAX_LIFE;
let fallingItems = [];
let isRunning = false;
let spawnTimerId = null;

// ---------- 4. キー入力 ----------
function handleKeyDown(event) {
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

// ---------- 5. 籠の位置 ----------
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

// ---------- 6. 難易度（スコアから計算する） ----------
function getLevel() {
  return Math.floor(score / SCORE_PER_LEVEL);
}

function getFallSpeed() {
  return Math.min(BASE_SPEED + getLevel() * SPEED_PER_LEVEL, MAX_SPEED);
}

function getSpawnInterval() {
  return Math.max(
    BASE_SPAWN_INTERVAL - getLevel() * INTERVAL_PER_LEVEL,
    MIN_SPAWN_INTERVAL
  );
}

function getBadRate() {
  return Math.min(
    BASE_BAD_RATE + getLevel() * BAD_RATE_PER_LEVEL,
    MAX_BAD_RATE
  );
}

// ---------- 7. 表示の更新 ----------
function updateScoreDisplay() {
  scoreDisplay.textContent = score;
  levelDisplay.textContent = getLevel() + 1;
}

function updateLifeDisplay() {
  lifeDisplay.textContent = "❤".repeat(life) + "♡".repeat(MAX_LIFE - life);
}

function flashArena() {
  arena.classList.add("hit");
  setTimeout(() => arena.classList.remove("hit"), 300);
}

// ---------- 8. 落ちてくるもの ----------
function renderItem(item) {
  item.el.style.left = `${item.x}px`;
  item.el.style.top = `${item.y}px`;
}

function chooseItemType() {
  if (Math.random() < getBadRate()) {
    return BAD_ITEMS[Math.floor(Math.random() * BAD_ITEMS.length)];
  }
  const fruit = FRUITS[Math.floor(Math.random() * FRUITS.length)];
  return { type: "fruit", emoji: fruit.emoji };
}

function spawnItem() {
  const kind = chooseItemType();

  const el = document.createElement("div");
  el.classList.add("falling-item");
  el.textContent = kind.emoji;

  const item = {
    el: el,
    type: kind.type,
    x: Math.random() * (arena.clientWidth - ITEM_SIZE),
    y: -ITEM_SIZE,
    speed: getFallSpeed() * (0.9 + Math.random() * 0.2), // 速度のゆらぎ
  };
  renderItem(item);
  arena.appendChild(el);
  fallingItems.push(item);
}

function removeItem(index) {
  fallingItems[index].el.remove();
  fallingItems.splice(index, 1);
}

// 再帰的な setTimeout を利用した動的な生成予約
function scheduleNextSpawn() {
  spawnTimerId = setTimeout(() => {
    spawnItem();
    scheduleNextSpawn();
  }, getSpawnInterval());
}

// ---------- 9. 当たり判定（AABB） ----------
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

// ---------- 10. キャッチ・ミス・ゲームオーバー ----------
function loseLife() {
  life--;
  updateLifeDisplay();
  flashArena();
  if (life <= 0) {
    endGame2();
  }
}

function handleCatch(item) {
  if (item.type === "fruit") {
    score += CATCH_SCORE;
  } else if (item.type === "rotten") {
    score = Math.max(0, score - ROTTEN_PENALTY);
    flashArena();
  } else if (item.type === "bomb") {
    loseLife();
  }
  updateScoreDisplay();
}

function handleMiss(item) {
  if (item.type === "fruit") {
    loseLife();
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

function updateItems(dt) {
  const catcherRect = getCatcherRect();
  for (let i = fallingItems.length - 1; i >= 0; i--) {
    const item = fallingItems[i];
    item.y += item.speed * dt; // 個別の速度で落下
    renderItem(item);

    if (isOverlapping(catcherRect, getItemRect(item))) {
      removeItem(i);
      handleCatch(item);
    } else if (item.y > arena.clientHeight) {
      removeItem(i);
      handleMiss(item);
    }
    if (!isRunning) break;
  }
}

// ---------- 11. ゲームループ ----------
function gameLoop(timestamp) {
  if (lastTime === null) lastTime = timestamp;
  const dt = Math.min((timestamp - lastTime) / 1000, MAX_FRAME_TIME);
  lastTime = timestamp;

  if (isRunning) {
    updateCatcher(dt);
    updateItems(dt);
  }

  requestAnimationFrame(gameLoop);
}

// ---------- 12. ゲーム開始 ----------
function startGame2() {
  score = 0;
  life = MAX_LIFE;
  isRunning = true;
  updateScoreDisplay();
  updateLifeDisplay();
  placeCatcherAtCenter();
  scheduleNextSpawn();
}

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);
window.addEventListener("blur", releaseAllKeys);
startGame2();
requestAnimationFrame(gameLoop);