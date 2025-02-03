const board = Array(9).fill(' ');
const boardElement = document.getElementById('board');
const messageElement = document.getElementById('message');
const restartButton = document.getElementById('restart');
let isPlayerTurn;
let moves = 1;

function toss() {
    isPlayerTurn = Math.random() < 0.5;
    messageElement.textContent = isPlayerTurn ? "Toss Result: You go first!" : "Toss Result: AI goes first!";
    if (!isPlayerTurn) setTimeout(aiMove, 500);
}

function createBoard() {
    boardElement.innerHTML = '';
    board.fill(' ');
    moves = 1;
    toss();
    board.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.dataset.index = index;
        cellElement.textContent = cell;
        cellElement.addEventListener('click', () => handlePlayerMove(index));
        boardElement.appendChild(cellElement);
    });
}

async function handlePlayerMove(index) {
    if (board[index] !== ' ' || !isPlayerTurn) return;
    board[index] = 'O';
    moves++;
    isPlayerTurn = false;
    updateBoard();
    if (await checkWin('O')) return;
    if (moves > 9) return;
    setTimeout(aiMove, 500);
}

async function aiMove() {
    let availablePositions = board.map((cell, index) => (cell === ' ' ? index : null)).filter(index => index !== null);
    let move = availablePositions[Math.floor(Math.random() * availablePositions.length)];
    board[move] = 'X';
    moves++;
    updateBoard();
    if (await checkWin('X')) return;
    if (moves > 9) return;
    isPlayerTurn = true;
}

function updateBoard() {
    document.querySelectorAll('.cell').forEach((cell, index) => {
        cell.textContent = board[index];
        if (board[index] !== ' ') cell.classList.add('taken');
    });
}

function checkWin(player) {
    const WINNING_COMBOS = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    if (WINNING_COMBOS.some(combo => combo.every(index => board[index] === player))) {
        messageElement.textContent = player === 'O' ? "🎉 You win! 🎉" : "🤖 AI wins! 🤖";
        disableBoard();
        return true;
    }
    if (moves === 9) {
        messageElement.textContent = "🤝 It's a Draw! 🤝";
        disableBoard();
        return true;
    }
    return false;
}

function disableBoard() {
    document.querySelectorAll('.cell').forEach(cell => cell.classList.add('taken'));
}

restartButton.addEventListener('click', createBoard);
createBoard();
