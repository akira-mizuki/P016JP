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

// ---------- 3. 要素の参照を取得（第3章で拡張） ----------
const TOTAL_PAIRS = FRUITS.length;
const MISMATCH_DELAY = 1000;

const board = document.getElementById("board");
const timeDisplay = document.getElementById("time-display");
const movesDisplay = document.getElementById("moves-display");
const pairsDisplay = document.getElementById("pairs-display");

// ---------- 4. カード1枚分のDOMを組み立てる ----------
function createCard(fruit) {
  // 4-1. いちばん外側：カード本体
  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.fruitId = fruit.id;

  // 4-2. 回転する中身（裏面と表面を包む）
  const inner = document.createElement("div");
  inner.classList.add("card-inner");

  // 4-3. 裏面（最初に見える面）
  const back = document.createElement("div");
  back.classList.add("card-face", "card-back");
  back.textContent = "?";

  // 4-4. 表面（果物の絵柄）
  const front = document.createElement("div");
  front.classList.add("card-face", "card-front");
  front.textContent = fruit.emoji;

  // 4-5. 組み立てて、完成したカードを返す
  inner.appendChild(back);
  inner.appendChild(front);
  card.appendChild(inner);
  return card;
}

// ---------- 5. 配列をシャッフルする（第2章で追加） ----------
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
  const shuffled = shuffle(deck); // deck をシャッフルしてから使う
  shuffled.forEach((fruit) => {
    board.appendChild(createCard(fruit));
  });
}

// ---------- 7. ゲームの状態（第3章で拡張） ----------
let selectedCards = [];
let isLocked = false;
let moves = 0;
let matchedPairs = 0;
let seconds = 0;
let timerId = null;

// ---------- 8. 表示を更新する関数（第3章で追加） ----------
function updateMovesDisplay() {
  movesDisplay.textContent = moves;
}

function updatePairsDisplay() {
  pairsDisplay.textContent = `${matchedPairs} / ${TOTAL_PAIRS}`;
}

// ---------- 9. カード照合・判定の関数（第3章で追加） ----------
function isMatch(cardA, cardB) {
  return cardA.dataset.fruitId === cardB.dataset.fruitId;
}

function handleMatch() {
  selectedCards.forEach((card) => card.classList.add("matched"));
  matchedPairs++;
  updatePairsDisplay();
  resetSelection();
}

function handleMismatch() {
  console.log("不一致です（3-2で、裏返す処理を書きます）");
}

function resetSelection() {
  selectedCards = [];
  isLocked = false;
}

// ---------- 10. クリックの処理（第3章で更新） ----------
function handleBoardClick(event) {
  const card = event.target.closest(".card");
  if (card === null) return;
  if (isLocked) return;
  if (card.classList.contains("flipped")) return;

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

// ---------- 11. ゲーム開始 ----------
board.addEventListener("click", handleBoardClick);
renderBoard();