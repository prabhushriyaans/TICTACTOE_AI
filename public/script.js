class TicTacToe {
    constructor() {
        this.board = Array.from({ length: 3 }, (_, i) => 
            Array.from({ length: 3 }, (_, j) => (i * 3 + j + 1).toString())
        );
        this.flag = Array(10).fill(0);
        this.moves = 1;
        this.aiTurn = Math.random() < 0.5; // Randomly decide who starts
        console.log(`Toss Result: AI${this.aiTurn ? "1" : "2"} goes first.`);
    }

    printBoard() {
        this.board.forEach((row, i) => {
            console.log(row.join(' | '));
            if (i < 2) console.log('---------');
        });
        console.log('\n');
    }

    checkWinner(player) {
        for (let i = 0; i < 3; i++) {
            if (this.board[i].every(cell => cell === player) ||
                [0, 1, 2].every(j => this.board[j][i] === player)) {
                return true;
            }
        }
        return (
            [0, 1, 2].every(i => this.board[i][i] === player) ||
            [0, 1, 2].every(i => this.board[i][2 - i] === player)
        );
    }

    makeMove(player) {
        let p;
        do {
            p = Math.floor(Math.random() * 9) + 1;
        } while (this.flag[p] === 1);
        console.log(`AI${player === 'O' ? "1" : "2"} placed ${player} at position ${p}`);

        this.flag[p] = 1;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.board[i][j] === p.toString()) {
                    this.board[i][j] = player;
                }
            }
        }
    }

    async playGame() {
        while (this.moves <= 9) {
            this.printBoard();
            const player = this.moves % 2 !== 0 ? 'O' : 'X';
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate AI delay
            this.makeMove(player);

            if (this.checkWinner(player)) {
                this.printBoard();
                console.log(`\n🎉 AI${player === 'O' ? "1" : "2"} wins the game! 🎉\n`);
                return;
            } else if (this.moves === 9) {
                console.log("\n🤝 It's a Draw! 🤝\n");
            }

            this.moves++;
        }
        this.printBoard();
    }
}

const game = new TicTacToe();
game.playGame();
