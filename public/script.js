const boardEl = document.getElementById('board');
const messageEl = document.getElementById('message');
const restartBtn = document.getElementById('restart');
const difficultySelect = document.getElementById('difficulty');

let board = ["", "", "", "", "", "", "", "", ""];
let player1Score = 0;
let player2Score = 0;
let tieScore = 0;
let gameOver = false;

function renderBoard() {
  boardEl.innerHTML = "";
  board.forEach((cell, index) => {
    const cellEl = document.createElement('div');
    cellEl.classList.add('cell');
    cellEl.dataset.index = index;
    cellEl.innerHTML = cell;
    if (cell !== "") cellEl.classList.add('taken');
    boardEl.appendChild(cellEl);
  });
}

function checkWinner(bd = board) {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let pattern of winPatterns) {
    const [a,b,c] = pattern;
    if (bd[a] && bd[a] === bd[b] && bd[b] === bd[c]) {
      return bd[a];
    }
  }
  return bd.includes("") ? null : "Tie";
}

function aiMove() {
  const diff = difficultySelect.value;

  if (diff === "easy") {
    randomMove();
  } else if (diff === "medium") {
    if (Math.random() < 0.5) {
      randomMove();
    } else {
      minimaxMove();
    }
  } else {
    minimaxMove();
  }
}

function randomMove() {
  let emptyIndices = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
  let move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  board[move] = "O";
}

function minimaxMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = "O";
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  board[move] = "O";
}

function minimax(bd, depth, isMaximizing) {
  let result = checkWinner(bd);
  if (result !== null) {
    if (result === "O") return 10 - depth;
    else if (result === "X") return depth - 10;
    else return 0;
  }

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < bd.length; i++) {
      if (bd[i] === "") {
        bd[i] = "O";
        best = Math.max(best, minimax(bd, depth + 1, false));
        bd[i] = "";
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < bd.length; i++) {
      if (bd[i] === "") {
        bd[i] = "X";
        best = Math.min(best, minimax(bd, depth + 1, true));
        bd[i] = "";
      }
    }
    return best;
  }
}

function handleClick(e) {
  if (gameOver) return;
  const index = e.target.dataset.index;
  if (board[index] !== "") return;

  board[index] = "X";
  let result = checkWinner();
  renderBoard();

  if (result) {
    endGame(result);
    return;
  }

  aiMove();
  result = checkWinner();
  renderBoard();

  if (result) {
    endGame(result);
  }
}

function endGame(result) {
  gameOver = true;
  if (result === "X") {
    player1Score++;
    document.getElementById('player1-score').innerText = player1Score;
    messageEl.innerText = "Player 1 wins!";
  } else if (result === "O") {
    player2Score++;
    document.getElementById('player2-score').innerText = player2Score;
    messageEl.innerText = "AI wins!";
  } else if (result === "Tie") {
    tieScore++;
    document.getElementById('tie-score').innerText = tieScore;
    messageEl.innerText = "It's a Tie!";
  }
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  gameOver = false;
  messageEl.innerText = "Welcome to Tic Tac Toe!";
  renderBoard();
}

boardEl.addEventListener('click', handleClick);
restartBtn.addEventListener('click', resetGame);
difficultySelect.addEventListener('change', resetGame);

renderBoard();
