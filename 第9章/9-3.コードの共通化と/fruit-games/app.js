// ---------- タブ切り替えとサウンドボタン ----------
const tabButtons = document.querySelectorAll(".tab");
const gamePanels = document.querySelectorAll(".game-panel");
const soundButton = document.getElementById("sound-toggle");
 
let activeGame = "game1";
 
function switchGame(gameId) {
  if (gameId === activeGame) return;
 
  if (activeGame === "game1") {
    Game1.pause();
  } else {
    Game2.pause();
  }
 
  gamePanels.forEach((panel) => {
    panel.hidden = panel.id !== gameId;
  });
  tabButtons.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.game === gameId);
  });
  activeGame = gameId;
 
  if (gameId === "game1") {
    Game1.resume();
  } else {
    Game2.enter();
  }
}
 
function updateSoundButton() {
  soundButton.textContent = isSoundOn ? "SOUND ON" : "SOUND OFF";
}
 
function handleSoundToggle() {
  isSoundOn = !isSoundOn;
  saveSoundSetting(isSoundOn);
  updateSoundButton();
  if (!isSoundOn) {
    stopBgm();
  } else if (activeGame === "game2" && Game2.isPlaying()) {
    startBgm();
  }
}
 
tabButtons.forEach((tab) => {
  tab.addEventListener("click", () => switchGame(tab.dataset.game));
});
soundButton.addEventListener("click", handleSoundToggle);
updateSoundButton();