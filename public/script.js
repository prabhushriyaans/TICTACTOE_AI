const board = Array(9).fill(' ');
const boardElement = document.getElementById('board');
const messageElement = document.getElementById('message');
const restartButton = document.getElementById('restart');

let isPlayerTurn = true;

function createBoard() {
    boardElement.innerHTML = '';
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
    isPlayerTurn = false;
    updateBoard();
    if (await checkWin('O')) {
        messageElement.textContent = 'You win!';
        disableBoard();
        return;
    }
    if (isBoardFull()) {
        messageElement.textContent = "It's a draw!";
        disableBoard();
        return;
    }

    setTimeout(aiMove, 500);
}

async function aiMove() {
    const response = await fetch('/api/ai-move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ board })
    });
    const data = await response.json();

    board[data.move] = 'X';
    updateBoard();

    if (await checkWin('X')) {
        messageElement.textContent = 'AI wins!';
        disableBoard();
        return;
    }
    if (isBoardFull()) {
        messageElement.textContent = "It's a draw!";
        disableBoard();
        return;
    }

    isPlayerTurn = true;
}

function updateBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        cell.textContent = board[index];
        if (board[index] !== ' ') {
            cell.classList.add('taken');
        }
    });
}

function disableBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.classList.add('taken'));
}

async function checkWin(player) {
    const response = await fetch('/api/check-win', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ board, player })
    });
    const data = await response.json
