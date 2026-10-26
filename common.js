// ---------- 2つのゲームで共有するもの ----------
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
 
function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}
 
function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}