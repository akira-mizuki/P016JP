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
 
// ---------- 3. 要素の参照を取得 ----------
const board = document.getElementById("board");
 
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
 
// ---------- 5. デッキの全カードをボードに並べる ----------
function renderBoard() {
  board.innerHTML = "";
  deck.forEach((fruit) => {
    board.appendChild(createCard(fruit));
  });
}
 
renderBoard();