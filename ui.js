function createText(className, text) {
  const p = document.createElement("p");
  p.classList.add(className);
  p.textContent = text;
  return p;
}
 
function showOverlay(parent, options) {
  const overlay = document.createElement("div");
  overlay.classList.add("overlay");
 
  overlay.appendChild(createText("overlay-title", options.title));
  overlay.appendChild(createText("overlay-text", options.text));
  if (options.badge) {
    overlay.appendChild(createText("overlay-badge", options.badge));
  }
 
  const button = document.createElement("button");
  button.classList.add("overlay-button");
  button.textContent = options.buttonText;
  button.addEventListener("click", options.onButtonClick);
  overlay.appendChild(button);
 
  parent.appendChild(overlay);
  button.focus();
  return overlay;
}
 
function removeOverlay(parent) {
  const overlay = parent.querySelector(".overlay");
  if (overlay !== null) overlay.remove();
}