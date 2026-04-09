window.GAMES = [];

// ==================== 1. PONG ====================
window.GAMES.push({
    name: 'Pong',
    html: '<canvas id="pongCanvas" width="800" height="400"></canvas>',
    init: function() { /* code complet du jeu Pong */ },
    stop: () => {}
});

// ==================== 2. SNAKE ====================
window.GAMES.push({
    name: 'Snake',
    html: '<canvas id="snakeCanvas" width="400" height="400"></canvas>',
    init: function() { /* code complet du jeu Snake */ },
    stop: () => {}
});

// ==================== 3. MEMORY ====================
window.GAMES.push({
    name: 'Memory',
    html: '<div id="memoryGame" style="display:grid; grid-template-columns:repeat(4,80px); gap:10px; justify-content:center;"></div>',
    init: function() { /* code complet du Memory */ },
    stop: () => {}
});

// ==================== 4. 2048 ====================
window.GAMES.push({
    name: '2048',
    html: '<div id="board2048" style="display:grid; grid-template-columns:repeat(4,80px); gap:10px; justify-content:center;"></div><p id="score2048" class="text-success text-center mt-3">Score: 0</p>',
    init: function() { /* code complet du 2048 */ },
    stop: () => {}
});

// ==================== 5. FLAPPY BIRD ====================
window.GAMES.push({
    name: 'Flappy Bird',
    html: '<canvas id="flappyCanvas" width="400" height="600"></canvas>',
    init: function() { /* code complet Flappy Bird */ },
    stop: () => {}
});

// ==================== 6. BREAKOUT ====================
window.GAMES.push({
    name: 'Breakout',
    html: '<canvas id="breakoutCanvas" width="400" height="600"></canvas>',
    init: function() { /* code complet Breakout */ },
    stop: () => {}
});

// ==================== 7. TIC-TAC-TOE ====================
window.GAMES.push({
    name: 'Tic-Tac-Toe',
    html: '<div id="tttBoard" style="display:grid; grid-template-columns:repeat(3,100px); gap:5px; justify-content:center;"></div><p id="tttStatus" class="text-center mt-3"></p>',
    init: function() { /* code complet TicTacToe */ },
    stop: () => {}
});

// ==================== 8. SIMON SAYS ====================
window.GAMES.push({
    name: 'Simon Says',
    html: '<div style="display:flex; gap:10px; justify-content:center;"><div id="simonRed" style="width:100px;height:100px;background:darkred;border-radius:10px;"></div><div id="simonGreen" style="width:100px;height:100px;background:darkgreen;border-radius:10px;"></div></div><div style="display:flex; gap:10px; justify-content:center; margin-top:10px;"><div id="simonBlue" style="width:100px;height:100px;background:darkblue;border-radius:10px;"></div><div id="simonYellow" style="width:100px;height:100px;background:darkgoldenrod;border-radius:10px;"></div></div><p id="simonStatus" class="text-center mt-3"></p>',
    init: function() { /* code complet Simon */ },
    stop: () => {}
});

// ==================== 9. JUSTE PRIX ====================
window.GAMES.push({
    name: 'Juste Prix',
    html: '<div class="text-center"><p>Devinez le prix entre 1 et 100</p><input type="number" id="guessInput" class="form-control w-50 mx-auto"><button id="guessBtn" class="btn btn-success mt-2">Deviner</button><p id="guessResult" class="mt-3"></p></div>',
    init: function() { /* code complet Juste Prix */ },
    stop: () => {}
});

// ==================== 10. PIERRE-FEUILLE-CISEAUX ====================
window.GAMES.push({
    name: 'Pierre-Feuille-Ciseaux',
    html: '<div class="text-center"><button id="rock" class="btn btn-success m-2">🪨 Pierre</button><button id="paper" class="btn btn-success m-2">📄 Feuille</button><button id="scissors" class="btn btn-success m-2">✂️ Ciseaux</button><p id="rpsResult" class="mt-3"></p><p id="rpsScore" class="mt-2">Score: 0</p></div>',
    init: function() { /* code complet Pierre-Feuille-Ciseaux */ },
    stop: () => {}
});