// ---------- 1. 定数と初期データ ----------
const STORAGE_KEY = "fruitGames.vol2";

function createDefaultScores() {
  return {
    game1: { bestTime: null, bestMoves: null },
    game2: { highScore: 0 },
  };
}

// ---------- 2. データの読み込みと保存 ----------
function loadScores() {
  const defaults = createDefaultScores();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return defaults;
    const data = JSON.parse(raw);
    return {
      game1: { ...defaults.game1, ...data.game1 },
      game2: { ...defaults.game2, ...data.game2 },
    };
  } catch (error) {
    console.warn("スコアの読み込みに失敗しました：", error);
    return defaults;
  }
}

function saveScores(scores) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
    return true;
  } catch (error) {
    console.warn("スコアの保存に失敗しました：", error);
    return false;
  }
}

function clearScores() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn("スコアの削除に失敗しました：", error);
  }
}

// ---------- 3. 記録の更新判定 ----------
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