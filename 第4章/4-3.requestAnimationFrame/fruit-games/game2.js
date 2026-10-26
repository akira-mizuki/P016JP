// ---------- 1. 定数と要素の参照 ----------
const CATCHER_SPEED = 360;
const MAX_FRAME_TIME = 0.05;
 
const arena = document.getElementById("catch-arena");
const catcher = document.getElementById("catcher");
 
// ---------- 2. ゲームの状態 ----------
const keys = { left: false, right: false };
let catcherX = 0;
let lastTime = null;
 
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
 
// ---------- 5. ゲームループ ----------
function gameLoop(timestamp) {
  if (lastTime === null) lastTime = timestamp;
  const dt = Math.min((timestamp - lastTime) / 1000, MAX_FRAME_TIME);
  lastTime = timestamp;
 
  updateCatcher(dt);
 
  requestAnimationFrame(gameLoop);
}
 
// ---------- 6. ゲーム開始 ----------
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);
window.addEventListener("blur", releaseAllKeys);
placeCatcherAtCenter();
requestAnimationFrame(gameLoop);