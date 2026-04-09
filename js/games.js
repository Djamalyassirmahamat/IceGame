window.GAMES = [
    // 1. PONG
    {
        name: 'Pong',
        html: '<canvas id="pongCanvas" width="800" height="400"></canvas>',
        init: function() {
            const canvas = document.getElementById('pongCanvas');
            const ctx = canvas.getContext('2d');
            canvas.width = Math.min(800, window.innerWidth - 40);
            canvas.height = 400;

            const paddle = { x: 20, y: 150, width: 10, height: 100, dy: 0, speed: 6 };
            const computer = { x: canvas.width - 30, y: 150, width: 10, height: 100, dy: 0, speed: 5 };
            const ball = { x: canvas.width / 2, y: canvas.height / 2, dx: 4, dy: 4, size: 8 };
            let score = 0;
            let gameActive = true;

            const keys = {};
            document.addEventListener('keydown', e => keys[e.key] = true);
            document.addEventListener('keyup', e => keys[e.key] = false);

            function update() {
                if (keys['ArrowUp']) paddle.y = Math.max(0, paddle.y - paddle.speed);
                if (keys['ArrowDown']) paddle.y = Math.min(canvas.height - paddle.height, paddle.y + paddle.speed);

                ball.x += ball.dx;
                ball.y += ball.dy;

                if (ball.y < 0 || ball.y > canvas.height) ball.dy = -ball.dy;

                if (ball.x < paddle.x + paddle.width && ball.y > paddle.y && ball.y < paddle.y + paddle.height) {
                    ball.dx = Math.abs(ball.dx);
                    score++;
                }

                if (ball.x > canvas.width) {
                    gameActive = false;
                }

                const computerCenter = computer.y + computer.height / 2;
                if (computerCenter < ball.y - 35) computer.y = Math.min(canvas.height - computer.height, computer.y + computer.speed);
                else if (computerCenter > ball.y + 35) computer.y = Math.max(0, computer.y - computer.speed);
            }

            function draw() {
                ctx.fillStyle = '#0d1117';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#00ff88';
                ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
                ctx.fillRect(computer.x, computer.y, computer.width, computer.height);
                ctx.beginPath();
                ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
                ctx.fill();
            }

            const gameLoop = setInterval(() => {
                if (!gameActive) {
                    clearInterval(gameLoop);
                    submitScore('Pong', score);
                    return;
                }
                update();
                draw();
            }, 30);

            this.stop = () => clearInterval(gameLoop);
        },
        stop: () => {}
    },

    // 2. SNAKE
    {
        name: 'Snake',
        html: '<canvas id="snakeCanvas" width="400" height="400"></canvas>',
        init: function() {
            const canvas = document.getElementById('snakeCanvas');
            const ctx = canvas.getContext('2d');
            canvas.width = Math.min(400, window.innerWidth - 40);
            canvas.height = 400;

            const gridSize = 20;
            let snake = [{ x: 10, y: 10 }];
            let food = { x: 15, y: 15 };
            let direction = { x: 1, y: 0 };
            let nextDirection = { x: 1, y: 0 };
            let score = 0;
            let gameActive = true;

            document.addEventListener('keydown', e => {
                if (e.key === 'ArrowUp' && direction.y === 0) nextDirection = { x: 0, y: -1 };
                if (e.key === 'ArrowDown' && direction.y === 0) nextDirection = { x: 0, y: 1 };
                if (e.key === 'ArrowLeft' && direction.x === 0) nextDirection = { x: -1, y: 0 };
                if (e.key === 'ArrowRight' && direction.x === 0) nextDirection = { x: 1, y: 0 };
            });

            function update() {
                direction = nextDirection;
                const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

                if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 || snake.some(s => s.x === head.x && s.y === head.y)) {
                    gameActive = false;
                    return;
                }

                snake.unshift(head);

                if (head.x === food.x && head.y === food.y) {
                    score += 10;
                    food = { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) };
                } else {
                    snake.pop();
                }
            }

            function draw() {
                ctx.fillStyle = '#0d1117';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.fillStyle = '#00ff88';
                snake.forEach(s => ctx.fillRect(s.x * gridSize, s.y * gridSize, gridSize - 2, gridSize - 2));

                ctx.fillStyle = '#ffff00';
                ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
            }

            const gameLoop = setInterval(() => {
                if (!gameActive) {
                    clearInterval(gameLoop);
                    submitScore('Snake', score);
                    return;
                }
                update();
                draw();
            }, 100);

            this.stop = () => clearInterval(gameLoop);
        },
        stop: () => {}
    },

    // 3. MEMORY
    {
        name: 'Memory',
        html: '<div id="memoryGame" style="display:grid; grid-template-columns:repeat(4,80px); gap:10px; justify-content:center;"></div>',
        init: function() {
            const gameDiv = document.getElementById('memoryGame');
            const symbols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
            const deck = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
            let flipped = [];
            let matched = 0;
            let score = 0;

            deck.forEach((symbol, index) => {
                const card = document.createElement('button');
                card.className = 'btn btn-outline-success';
                card.style.cssText = 'width:80px; height:80px; font-size:2em; font-weight:bold;';
                card.textContent = '?';
                card.dataset.symbol = symbol;

                card.onclick = () => {
                    if (flipped.length < 2 && card.textContent === '?') {
                        card.textContent = symbol;
                        card.classList.add('active');
                        flipped.push(card);

                        if (flipped.length === 2) {
                            if (flipped[0].dataset.symbol === flipped[1].dataset.symbol) {
                                matched++;
                                score += 10;
                                flipped = [];
                                if (matched === 8) {
                                    submitScore('Memory', score);
                                }
                            } else {
                                setTimeout(() => {
                                    flipped.forEach(c => {
                                        c.textContent = '?';
                                        c.classList.remove('active');
                                    });
                                    flipped = [];
                                }, 1000);
                            }
                        }
                    }
                };

                gameDiv.appendChild(card);
            });
        },
        stop: () => {}
    },

    // 4. 2048
    {
        name: '2048',
        html: '<div id="game2048" style="display:grid; grid-template-columns:repeat(4,80px); gap:10px; justify-content:center;"></div><p id="score2048" class="text-success text-center mt-3">Score: 0</p>',
        init: function() {
            const gameDiv = document.getElementById('game2048');
            const scoreDiv = document.getElementById('score2048');
            let board = Array(16).fill(0);
            let score = 0;

            function addTile() {
                const empty = board.map((v, i) => v === 0 ? i : -1).filter(i => i !== -1);
                if (empty.length) {
                    board[empty[Math.floor(Math.random() * empty.length)]] = Math.random() < 0.9 ? 2 : 4;
                }
            }

            function draw() {
                gameDiv.innerHTML = '';
                board.forEach(value => {
                    const tile = document.createElement('div');
                    tile.className = 'btn btn-outline-success';
                    tile.style.cssText = `width:80px; height:80px; display:flex; align-items:center; justify-content:center; font-size:${value ? '1.5em' : '1em'}; font-weight:bold;`;
                    tile.textContent = value || '';
                    gameDiv.appendChild(tile);
                });
                scoreDiv.textContent = `Score: ${score}`;
            }

            addTile();
            addTile();
            draw();

            document.addEventListener('keydown', (e) => {
                addTile();
                score += 10;
                draw();
            });
        },
        stop: () => {}
    },

    // 5. FLAPPY BIRD
    {
        name: 'Flappy Bird',
        html: '<canvas id="flappyCanvas" width="400" height="600"></canvas>',
        init: function() {
            const canvas = document.getElementById('flappyCanvas');
            const ctx = canvas.getContext('2d');
            canvas.width = Math.min(400, window.innerWidth - 40);

            const bird = { x: 50, y: 300, width: 30, height: 30, velocity: 0, gravity: 0.6, lift: -12 };
            const pipes = [];
            let score = 0;
            let gameActive = true;
            let pipeCounter = 0;

            document.addEventListener('keydown', () => bird.velocity = bird.lift);
            document.addEventListener('click', () => bird.velocity = bird.lift);

            function update() {
                bird.velocity += bird.gravity;
                bird.y += bird.velocity;

                if (bird.y + bird.height > canvas.height || bird.y < 0) {
                    gameActive = false;
                }

                pipeCounter++;
                if (pipeCounter > 100) {
                    pipes.push({ x: canvas.width, width: 50, gap: 120, top: Math.random() * (canvas.height - 150) });
                    pipeCounter = 0;
                }

                pipes.forEach(pipe => {
                    pipe.x -= 5;
                    if (bird.x < pipe.x + pipe.width && bird.x + bird.width > pipe.x) {
                        if (bird.y < pipe.top || bird.y + bird.height > pipe.top + pipe.gap) {
                            gameActive = false;
                        }
                    }
                    if (pipe.x === bird.x) score++;
                });

                pipes = pipes.filter(p => p.x > -50);
            }

            function draw() {
                ctx.fillStyle = '#87CEEB';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#ffff00';
                ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

                ctx.fillStyle = '#00ff88';
                pipes.forEach(pipe => {
                    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
                    ctx.fillRect(pipe.x, pipe.top + pipe.gap, pipe.width, canvas.height - pipe.top - pipe.gap);
                });

                ctx.fillStyle = '#fff';
                ctx.font = '20px Arial';
                ctx.fillText(`Score: ${score}`, 10, 30);
            }

            const gameLoop = setInterval(() => {
                if (!gameActive) {
                    clearInterval(gameLoop);
                    submitScore('Flappy Bird', score);
                    return;
                }
                update();
                draw();
            }, 30);

            this.stop = () => clearInterval(gameLoop);
        },
        stop: () => {}
    },

    // 6. BREAKOUT
    {
        name: 'Breakout',
        html: '<canvas id="breakoutCanvas" width="400" height="600"></canvas>',
        init: function() {
            const canvas = document.getElementById('breakoutCanvas');
            const ctx = canvas.getContext('2d');
            canvas.width = Math.min(400, window.innerWidth - 40);

            const paddle = { x: 150, y: 550, width: 100, height: 10, speed: 6 };
            const ball = { x: 200, y: 300, dx: 3, dy: -3, radius: 5 };
            const bricks = [];
            let score = 0;

            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < 8; j++) {
                    bricks.push({ x: j * 50, y: i * 20 + 20, width: 50, height: 20, active: true });
                }
            }

            const keys = {};
            document.addEventListener('keydown', e => keys[e.key] = true);
            document.addEventListener('keyup', e => keys[e.key] = false);

            function update() {
                if (keys['ArrowLeft']) paddle.x = Math.max(0, paddle.x - paddle.speed);
                if (keys['ArrowRight']) paddle.x = Math.min(canvas.width - paddle.width, paddle.x + paddle.speed);

                ball.x += ball.dx;
                ball.y += ball.dy;

                if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) ball.dx = -ball.dx;
                if (ball.y - ball.radius < 0) ball.dy = -ball.dy;
                if (ball.y + ball.radius > canvas.height) {
                    submitScore('Breakout', score);
                }

                if (ball.x > paddle.x && ball.x < paddle.x + paddle.width && ball.y + ball.radius > paddle.y) {
                    ball.dy = -ball.dy;
                }

                bricks.forEach(brick => {
                    if (brick.active && ball.x > brick.x && ball.x < brick.x + brick.width && ball.y > brick.y && ball.y < brick.y + brick.height) {
                        brick.active = false;
                        ball.dy = -ball.dy;
                        score += 10;
                    }
                });
            }

            function draw() {
                ctx.fillStyle = '#0d1117';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.fillStyle = '#00ff88';
                ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

                ctx.fillStyle = '#ffff00';
                ctx.beginPath();
                ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
                ctx.fill();

                bricks.forEach(brick => {
                    if (brick.active) {
                        ctx.fillStyle = '#667eea';
                        ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
                    }
                });

                ctx.fillStyle = '#fff';
                ctx.font = '20px Arial';
                ctx.fillText(`Score: ${score}`, 10, 30);
            }

            const gameLoop = setInterval(() => {
                update();
                draw();
            }, 30);

            this.stop = () => clearInterval(gameLoop);
        },
        stop: () => {}
    },

    // 7-50: JEUX ADDITIONNELS (templates simplifiés)
    { name: 'Tic-Tac-Toe', html: '<div class="alert alert-info">Tic-Tac-Toe - Bientôt disponible</div>', init: () => {} },
    { name: 'Simon Says', html: '<div class="alert alert-info">Simon Says - Bientôt disponible</div>', init: () => {} },
    { name: 'Doodlejump', html: '<div class="alert alert-info">Doodlejump - Bientôt disponible</div>', init: () => {} },
    { name: 'Color Match', html: '<div class="alert alert-info">Color Match - Bientôt disponible</div>', init: () => {} },
    { name: 'Dice Roll', html: '<div class="alert alert-info">Dice Roll - Bientôt disponible</div>', init: () => {} },
    { name: 'Clicking Game', html: '<div class="alert alert-info">Clicking Game - Bientôt disponible</div>', init: () => {} },
    { name: 'Hangman', html: '<div class="alert alert-info">Hangman - Bientôt disponible</div>', init: () => {} },
    { name: 'Quiz', html: '<div class="alert alert-info">Quiz - Bientôt disponible</div>', init: () => {} },
    { name: 'Matching', html: '<div class="alert alert-info">Matching - Bientôt disponible</div>', init: () => {} },
    { name: 'Whack-a-Mole', html: '<div class="alert alert-info">Whack-a-Mole - Bientôt disponible</div>', init: () => {} },
    { name: 'Asteroid', html: '<div class="alert alert-info">Asteroid - Bientôt disponible</div>', init: () => {} },
    { name: 'Space Invaders', html: '<div class="alert alert-info">Space Invaders - Bientôt disponible</div>', init: () => {} },
    { name: 'Pac-Man', html: '<div class="alert alert-info">Pac-Man - Bientôt disponible</div>', init: () => {} },
    { name: 'Tetris', html: '<div class="alert alert-info">Tetris - Bientôt disponible</div>', init: () => {} },
    { name: 'Minesweeper', html: '<div class="alert alert-info">Minesweeper - Bientôt disponible</div>', init: () => {} },
    { name: 'Sudoku', html: '<div class="alert alert-info">Sudoku - Bientôt disponible</div>', init: () => {} },
    { name: 'Crossword', html: '<div class="alert alert-info">Crossword - Bientôt disponible</div>', init: () => {} },
    { name: 'Word Search', html: '<div class="alert alert-info">Word Search - Bientôt disponible</div>', init: () => {} },
    { name: 'Slots', html: '<div class="alert alert-info">Slots - Bientôt disponible</div>', init: () => {} },
    { name: 'Roulette', html: '<div class="alert alert-info">Roulette - Bientôt disponible</div>', init: () => {} },
    { name: 'Blackjack', html: '<div class="alert alert-info">Blackjack - Bientôt disponible</div>', init: () => {} },
    { name: 'Poker', html: '<div class="alert alert-info">Poker - Bientôt disponible</div>', init: () => {} },
    { name: 'Connect 4', html: '<div class="alert alert-info">Connect 4 - Bientôt disponible</div>', init: () => {} },
    { name: 'Checkers', html: '<div class="alert alert-info">Checkers - Bientôt disponible</div>', init: () => {} },
    { name: 'Chess', html: '<div class="alert alert-info">Chess - Bientôt disponible</div>', init: () => {} },
    { name: 'Racing', html: '<div class="alert alert-info">Racing - Bientôt disponible</div>', init: () => {} },
    { name: 'Golf', html: '<div class="alert alert-info">Golf - Bientôt disponible</div>', init: () => {} },
    { name: 'Bowling', html: '<div class="alert alert-info">Bowling - Bientôt disponible</div>', init: () => {} },
    { name: 'Darts', html: '<div class="alert alert-info">Darts - Bientôt disponible</div>', init: () => {} },
    { name: 'Archery', html: '<div class="alert alert-info">Archery - Bientôt disponible</div>', init: () => {} },
    { name: 'Shooting', html: '<div class="alert alert-info">Shooting - Bientôt disponible</div>', init: () => {} },
    { name: 'Platformer', html: '<div class="alert alert-info">Platformer - Bientôt disponible</div>', init: () => {} },
    { name: 'Runner', html: '<div class="alert alert-info">Runner - Bientôt disponible</div>', init: () => {} },
    { name: 'Cooking', html: '<div class="alert alert-info">Cooking - Bientôt disponible</div>', init: () => {} },
    { name: 'Fishing', html: '<div class="alert alert-info">Fishing - Bientôt disponible</div>', init: () => {} },
    { name: 'Farming', html: '<div class="alert alert-info">Farming - Bientôt disponible</div>', init: () => {} },
    { name: 'Builder', html: '<div class="alert alert-info">Builder - Bientôt disponible</div>', init: () => {} },
    { name: 'Puzzle', html: '<div class="alert alert-info">Puzzle - Bientôt disponible</div>', init: () => {} },
    { name: 'Math', html: '<div class="alert alert-info">Math - Bientôt disponible</div>', init: () => {} },
    { name: 'Trivia', html: '<div class="alert alert-info">Trivia - Bientôt disponible</div>', init: () => {} },
    { name: 'Logo Quiz', html: '<div class="alert alert-info">Logo Quiz - Bientôt disponible</div>', init: () => {} },
    { name: 'Emoji Guess', html: '<div class="alert alert-info">Emoji Guess - Bientôt disponible</div>', init: () => {} },
    { name: 'Music', html: '<div class="alert alert-info">Music - Bientôt disponible</div>', init: () => {} },
    { name: 'Dance', html: '<div class="alert alert-info">Dance - Bientôt disponible</div>', init: () => {} },
    { name: 'Draw', html: '<div class="alert alert-info">Draw - Bientôt disponible</div>', init: () => {} }
];