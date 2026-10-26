const tabButtons = document.querySelectorAll(".tab");
const gamePanels = document.querySelectorAll(".game-panel");
 
let activeGame = "game1";
 
function switchGame(gameId) {
  if (gameId === activeGame) return;
 
  if (activeGame === "game1") {
    pauseGame1();
  } else {
    pauseGame2();
  }
 
  gamePanels.forEach((panel) => {
    panel.hidden = panel.id !== gameId;
  });
  tabButtons.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.game === gameId);
  });
  activeGame = gameId;
 
  if (gameId === "game1") {
    resumeGame1();
  } else {
    enterGame2();
  }
}
 
tabButtons.forEach((tab) => {
  tab.addEventListener("click", () => switchGame(tab.dataset.game));
});
