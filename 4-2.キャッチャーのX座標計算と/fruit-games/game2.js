const keys = { left: false, right: false };
 
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
 
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

function releaseAllKeys() {
  keys.left = false;
  keys.right = false;
}
 
window.addEventListener("blur", releaseAllKeys);

const arena = document.getElementById("catch-arena");
const catcher = document.getElementById("catcher");
 
let catcherX = 0;
 
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
 
placeCatcherAtCenter();