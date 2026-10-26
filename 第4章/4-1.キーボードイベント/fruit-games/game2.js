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