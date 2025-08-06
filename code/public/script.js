let players = {};
let scores = {};
let reactionKeyMap = { a: 0, b: 1, '1': 2, '9': 3 };
let reactionStarted = false;

const startBtn = document.getElementById("startBtn");
const reactionBtn = document.getElementById("reactionBtn");
const resetBtn = document.getElementById("resetBtn");
const nameScreen = document.getElementById("name-screen");
const gameScreen = document.getElementById("game-screen");
const scoreTable = document.getElementById("scoreTable");
const status = document.getElementById("status");
const winnerSection = document.getElementById("winner-section");
const winnerName = document.getElementById("winnerName");
const winnerImage = document.getElementById("winnerImage");

const emojiList = ["🦁", "🐯", "🐵", "🦄"];
const winImages = [
  "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif",
  "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
  "https://media.giphy.com/media/3oz8xKaR836UJOYeOc/giphy.gif",
  "https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/giphy.gif"
];

startBtn.addEventListener("click", () => {
  players = [
    document.getElementById("player1").value || "Player 1",
    document.getElementById("player2").value || "Player 2",
    document.getElementById("player3").value || "Player 3",
    document.getElementById("player4").value || "Player 4",
  ];

  players = players.map((name, index) => `${emojiList[index]} ${name}`);
  players.forEach((name, i) => (scores[name] = 0));

  updateScoreTable();
  nameScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");

  setTimeout(() => {
    status.textContent = "PRESS!";
    reactionStarted = true;
  }, Math.random() * 4000 + 2000); // 2s - 6s delay
});

document.addEventListener("keydown", (e) => {
  if (!reactionStarted) return;
  const key = e.key.toLowerCase();
  if (reactionKeyMap.hasOwnProperty(key)) {
    reactionStarted = false;
    const winnerIndex = reactionKeyMap[key];
    const winner = players[winnerIndex];
    scores[winner]++;
    updateScoreTable();
    showWinner(winner, winnerIndex);
    fireConfetti();
  }
});

resetBtn.addEventListener("click", () => {
  winnerSection.classList.add("hidden");
  status.textContent = "Get Ready...";
  setTimeout(() => {
    status.textContent = "PRESS!";
    reactionStarted = true;
  }, Math.random() * 4000 + 2000);
});

function updateScoreTable() {
  scoreTable.innerHTML = "";
  for (let player in scores) {
    const row = document.createElement("tr");
    const playerCell = document.createElement("td");
    const scoreCell = document.createElement("td");

    playerCell.textContent = player;
    scoreCell.textContent = scores[player];
    row.appendChild(playerCell);
    row.appendChild(scoreCell);
    scoreTable.appendChild(row);
  }
}

function showWinner(name, index) {
  winnerSection.classList.remove("hidden");
  winnerName.textContent = name;
  winnerImage.src = winImages[index];
}

function fireConfetti() {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 }
  });
}
