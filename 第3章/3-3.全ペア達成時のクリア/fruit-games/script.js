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
 
// ---------- 11. クリア処理（第3章で追加） ----------
function showClearMessage() {
  const overlay = document.createElement("div");
  overlay.classList.add("overlay");
 
  const title = document.createElement("p");
  title.classList.add("overlay-title");
  title.textContent = "CLEAR!";
 
  const result = document.createElement("p");
  result.classList.add("overlay-text");
  result.textContent = `タイム ${formatTime(seconds)} ／ 手数 ${moves}`;
 
  overlay.appendChild(title);
  overlay.appendChild(result);
  board.appendChild(overlay);
}
 
function finishGame() {
  stopTimer();
  showClearMessage();
}
 
// ---------- 12. クリックの処理 ----------
function handleBoardClick(event) {
  const card = event.target.closest(".card");
  if (card === null) return;
  if (isLocked) return;
  if (card.classList.contains("flipped")) return;
 
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
 
// ---------- 13. ゲーム開始 ----------
board.addEventListener("click", handleBoardClick);
renderBoard();