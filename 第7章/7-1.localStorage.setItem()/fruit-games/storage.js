function recordGame1Result(time, moves) {
  const scores = loadScores();
  const isNewBestTime =
    scores.game1.bestTime === null || time < scores.game1.bestTime;
  const isNewBestMoves =
    scores.game1.bestMoves === null || moves < scores.game1.bestMoves;
  if (isNewBestTime) scores.game1.bestTime = time;
  if (isNewBestMoves) scores.game1.bestMoves = moves;
  if (isNewBestTime || isNewBestMoves) saveScores(scores);
  return { isNewBestTime, isNewBestMoves };
}
 
function recordGame2Score(score) {
  const scores = loadScores();
  const isNewHighScore = score > scores.game2.highScore;
  if (isNewHighScore) {
    scores.game2.highScore = score;
    saveScores(scores);
  }
  return isNewHighScore;
}