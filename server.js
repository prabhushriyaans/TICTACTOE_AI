const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/api/check-win', (req, res) => {
    const { board, player } = req.body;
    const WINNING_COMBOS = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    const isWin = WINNING_COMBOS.some(combo =>
        combo.every(index => board[index] === player)
    );
    res.json({ isWin });
});

app.post('/api/ai-move', (req, res) => {
    const { board } = req.body;
    const availablePositions = board
        .map((cell, index) => (cell === ' ' ? index : null))
        .filter(index => index !== null);

    const move = availablePositions[Math.floor(Math.random() * availablePositions.length)];
    res.json({ move });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
