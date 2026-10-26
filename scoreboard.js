// ---------- スコアボードの表示制御（第7章で追加） ----------
const sbTime = document.getElementById("sb-time");
const sbMoves = document.getElementById("sb-moves");
const sbScore = document.getElementById("sb-score");
const resetButton = document.getElementById("reset-scores");

function renderScoreboard() {
  const scores = loadScores();
  sbTime.textContent =
    scores.game1.bestTime === null ? "--" : formatTime(scores.game1.bestTime);
  sbMoves.textContent =
    scores.game1.bestMoves === null ? "--" : `${scores.game1.bestMoves}手`;
  sbScore.textContent = scores.game2.highScore;
}

function handleResetClick() {
  if (!confirm("保存した記録を、すべて消します。よろしいですか？")) return;
  clearScores();
  renderScoreboard();
}

resetButton.addEventListener("click", handleResetClick);