// ---------- 1. 定数と要素の参照 ----------
const CATCHER_SPEED = 360;
const MAX_FRAME_TIME = 0.05;

const ITEM_SIZE = 40;
const ITEM_SPEED = 160;
const SPAWN_INTERVAL = 900;
const CATCH_SCORE = 10;

const arena = document.getElementById("catch-arena");
const catcher = document.getElementById("catcher");
const scoreDisplay = document.getElementById("score-display");

// ---------- 2. ゲームの状態 ----------
const keys = { left: false, right: false };
let catcherX = 0;
let lastTime = null;

let score = 0;
let fallingItems = [];

// ---------- 3. キー入力 ----------
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

// ---------- 5. 落ちてくる果物の処理（第5章で追加） ----------
function renderItem(item) {
  item.el.style.left = `${item.x}px`;
  item.el.style.top = `${item.y}px`;
}

function spawnItem() {
  const fruit = FRUITS[Math.floor(Math.random() * FRUITS.length)];

  const el = document.createElement("div");
  el.classList.add("falling-item");
  el.textContent = fruit.emoji;

  const item = {
    el: el,
    x: Math.random() * (arena.clientWidth - ITEM_SIZE),
    y: -ITEM_SIZE,
  };
  renderItem(item);
  arena.appendChild(el);
  fallingItems.push(item);
}

function removeItem(index) {
  fallingItems[index].el.remove();
  fallingItems.splice(index, 1);
}

function updateItems(dt) {
  for (let i = fallingItems.length - 1; i >= 0; i--) {
    const item = fallingItems[i];
    item.y += ITEM_SPEED * dt;
    renderItem(item);

    if (item.y > arena.clientHeight) {
      removeItem(i);
    }
  }
}

// ---------- 6. ゲームループ ----------
function gameLoop(timestamp) {
  if (lastTime === null) lastTime = timestamp;
  const dt = Math.min((timestamp - lastTime) / 1000, MAX_FRAME_TIME);
  lastTime = timestamp;

  updateCatcher(dt);
  updateItems(dt); // ← 追記：果物を落とす処理を呼び出す

  requestAnimationFrame(gameLoop);
}

// ---------- 7. ゲーム開始 ----------
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);
window.addEventListener("blur", releaseAllKeys);

placeCatcherAtCenter();
setInterval(spawnItem, SPAWN_INTERVAL); // ← 追記：果物の生成を開始
requestAnimationFrame(gameLoop);