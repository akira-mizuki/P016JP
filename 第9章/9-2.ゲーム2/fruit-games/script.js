// ---------- 1. 果物データ ----------
const FRUITS = [
  { id: "apple", name: "りんご", emoji: "🍎" },
  { id: "banana", name: "バナナ", emoji: "🍌" },
  { id: "grape", name: "ぶどう", emoji: "🍇" },
  { id: "strawberry", name: "いちご", emoji: "🍓" },
  { id: "orange", name: "オレンジ", emoji: "🍊" },
  { id: "watermelon", name: "すいか", emoji: "🍉" },
  { id: "cherry", name: "さくらんぼ", emoji: "🍒" },
  { id: "peach", name: "もも", emoji: "🍑" },
];
 
// ---------- 2. 16枚のデッキを作る（各果物を2枚ずつ） ----------
const deck = [...FRUITS, ...FRUITS];
 
// ---------- 3. 定数と要素の参照（第3章で拡張） ----------
const TOTAL_PAIRS = FRUITS.length;
const MISMATCH_DELAY = 1000;
 
const board = document.getElementById("board");
const timeDisplay = document.getElementById("time-display");
const movesDisplay = document.getElementById("moves-display");
const pairsDisplay = document.getElementById("pairs-display");
 
// ---------- 4. カード1枚分のDOMを組み立てる ----------
function createCard(fruit) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.fruitId = fruit.id;
 
  const inner = document.createElement("div");
  inner.classList.add("card-inner");
 
  const back = document.createElement("div");
  back.classList.add("card-face", "card-back");
  back.textContent = "?";
 
  const front = document.createElement("div");
  front.classList.add("card-face", "card-front");
  front.textContent = fruit.emoji;
 
  inner.appendChild(back);
  inner.appendChild(front);
  card.appendChild(inner);
  return card;
}
 
// ---------- 5. 配列をシャッフルする ----------
function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
 
// ---------- 6. シャッフルしたデッキをボードに並べる ----------
function renderBoard() {
  board.innerHTML = "";
  shuffle(deck).forEach((fruit) => {
    board.appendChild(createCard(fruit));
  });
}
 
// ---------- 7. ゲームの状態 ----------
let selectedCards = [];
let isLocked = false;
let moves = 0;
let matchedPairs = 0;
let seconds = 0;
let timerId = null;
let hasStarted = false;
 
// ---------- 8. 表示を更新する関数（第3章で追加） ----------
function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
 
function updateMovesDisplay() {
  movesDisplay.textContent = moves;
}
 
function updatePairsDisplay() {
  pairsDisplay.textContent = `${matchedPairs} / ${TOTAL_PAIRS}`;
}
 
// ---------- 9. タイマー（第3章で追加） ----------
function startTimer() {
  if (timerId !== null) return;
  timerId = setInterval(() => {
    seconds++;
    timeDisplay.textContent = formatTime(seconds);
  }, 1000);
}
 
function stopTimer() {
  clearInterval(timerId);
  timerId = null;
}
 
// ---------- 10. 照合ロジック（第3章で追加） ----------
function isMatch(cardA, cardB) {
  return cardA.dataset.fruitId === cardB.dataset.fruitId;
}
 
function resetSelection() {
  selectedCards = [];
  isLocked = false;
}
 
function handleMatch() {
  playSound("match");
  selectedCards.forEach((card) => card.classList.add("matched"));
  matchedPairs++;
  updatePairsDisplay();
  resetSelection();
  if (matchedPairs === TOTAL_PAIRS) {
    finishGame();
  }
}
 
function handleMismatch() {
  const [first, second] = selectedCards;
  setTimeout(() => {
    first.classList.remove("flipped");
    second.classList.remove("flipped");
    resetSelection();
  }, MISMATCH_DELAY);
}

// ---------- 11. クリア処理 ----------
function showClearMessage(record) {
  const isNewRecord = record.isNewBestTime || record.isNewBestMoves;
  showOverlay(board, {
    title: "CLEAR!",
    text: `タイム ${formatTime(seconds)} ／ 手数 ${moves}`,
    badge: isNewRecord ? "NEW RECORD!" : null,
    buttonText: "もう一度",
    onButtonClick: startGame1,
  });
}

function finishGame() {
  stopTimer();
  const record = recordGame1Result(seconds, moves);
  renderScoreboard(); // scoreboard.js에 선언된 함수 호출!
  showClearMessage(record);
}

// ---------- 12. ゲーム開始・リセット関数 ----------
function startGame1() {
  stopTimer();
  selectedCards = [];
  isLocked = false;
  moves = 0;
  matchedPairs = 0;
  seconds = 0;
  hasStarted = false;
  timeDisplay.textContent = formatTime(0);
  updateMovesDisplay();
  updatePairsDisplay();
  renderBoard();
}

// ---------- 13. クリックの処理 ----------
function handleBoardClick(event) {
  const card = event.target.closest(".card");
  if (card === null) return;
  if (isLocked) return;
  if (card.classList.contains("flipped")) return;
 
  hasStarted = true;
  startTimer();
  card.classList.add("flipped");
  selectedCards.push(card);
 
  if (selectedCards.length === 2) {
    isLocked = true;
    moves++;
    updateMovesDisplay();
    if (isMatch(selectedCards[0], selectedCards[1])) {
      handleMatch();
    } else {
      handleMismatch();
    }
  }
}
 
// ---------- 14. 実行のエントリーポイント ----------
board.addEventListener("click", handleBoardClick);
startGame1();
renderScoreboard(); // scoreboard.jsで宣言された関数を呼び出し！


function pauseGame1() {
  stopTimer();
}
 
function resumeGame1() {
  if (hasStarted && matchedPairs < TOTAL_PAIRS) {
    startTimer();
  }
}
