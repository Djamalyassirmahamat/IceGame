// Gestion des écrans
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function showGames() {
    loadGames();
    showScreen('gamesScreen');
}

function showLeaderboard() {
    loadLeaderboard();
    showScreen('leaderboardScreen');
}

function showAbout() {
    showScreen('aboutScreen');
}

function backToMenu() {
    stopCurrentGame();
    showScreen('mainMenu');
}

function backToGames() {
    stopCurrentGame();
    loadGames();
    showScreen('gamesScreen');
}

// Stockage Local
const Storage = {
    get: (key, defaultValue = null) => {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            return defaultValue;
        }
    },

    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Erreur de stockage:', e);
        }
    },

    addScore: (gameName, score) => {
        let scores = Storage.get('scores', []);  // ← corrigé: const → let
        scores.push({
            game: gameName,
            score: score,
            date: new Date().toLocaleDateString('fr-FR')
        });
        if (scores.length > 1000) {
            scores = scores.slice(-1000);
        }
        Storage.set('scores', scores);
    },

    getGameScores: (gameName) => {
        const scores = Storage.get('scores', []);
        return scores.filter(s => s.game === gameName).sort((a, b) => b.score - a.score);
    },

    getBestScore: (gameName) => {
        const scores = Storage.getGameScores(gameName);
        return scores.length > 0 ? scores[0].score : 0;
    },

    getTotalScore: () => {
        const scores = Storage.get('scores', []);
        return scores.reduce((sum, s) => sum + s.score, 0);
    },

    getAllScores: () => {
        return Storage.get('scores', []).sort((a, b) => new Date(b.date) - new Date(a.date));
    },

    resetAll: () => {
        if (confirm('Êtes-vous sûr ? Cette action est irréversible !')) {
            localStorage.removeItem('scores');
            alert('Tous les scores ont été réinitialisés !');
            loadLeaderboard();
        }
    }
};

// Charger la galerie de jeux
function loadGames() {
    const gamesGrid = document.getElementById('gamesGrid');
    const totalScore = Storage.getTotalScore();
    document.getElementById('totalScore').textContent = `Score Total: ${totalScore}`;

    gamesGrid.innerHTML = '';

    window.GAMES.forEach((game, index) => {
        const bestScore = Storage.getBestScore(game.name);
        const col = document.createElement('div');
        col.className = 'col-12 col-sm-6 col-md-4 col-lg-3';
        col.innerHTML = `
            <div class="game-card" onclick="playGame(${index})">
                <div>
                    <div class="game-card-title">${game.name}</div>
                    <small class="text-muted">Meilleur: ${bestScore}</small>
                </div>
            </div>
        `;
        gamesGrid.appendChild(col);
    });
}

function filterGames() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach((card, index) => {
        const gameName = window.GAMES[index].name.toLowerCase();
        if (gameName.includes(searchInput)) {
            card.parentElement.style.display = '';
        } else {
            card.parentElement.style.display = 'none';
        }
    });
}

// Lancer un jeu
let currentGameIndex = -1;

function playGame(gameIndex) {
    const game = window.GAMES[gameIndex];
    currentGameIndex = gameIndex;
    
    document.getElementById('gameName').textContent = game.name;
    document.getElementById('gameContent').innerHTML = game.html;
    document.getElementById('gameScore').textContent = '⏱️ En cours...';
    
    showScreen('gameScreen');
    
    if (game.init) {
        game.init();
    }
}

function stopCurrentGame() {
    const game = window.GAMES[currentGameIndex];
    if (game && game.stop) {
        game.stop();
    }
    currentGameIndex = -1;
}

function submitScore(gameName, score) {
    Storage.addScore(gameName, score);
    document.getElementById('gameScore').textContent = `✅ Score: ${score} points !`;
}

// Charger le leaderboard
function loadLeaderboard() {
    const scores = Storage.getAllScores();
    const globalScores = document.getElementById('globalScores');
    
    globalScores.innerHTML = '';
    
    scores.slice(0, 50).forEach((score, index) => {
        const row = `<tr>
            <td>#${index + 1}</td>
            <td>${score.game}</td>
            <td><strong>${score.score}</strong></td>
            <td>${score.date}</td>
        </tr>`;
        globalScores.innerHTML += row;
    });

    // Charger les jeux dans le select
    const gameSelect = document.getElementById('gameSelect');
    const uniqueGames = [...new Set(window.GAMES.map(g => g.name))];
    gameSelect.innerHTML = '<option value="">Sélectionner un jeu...</option>';
    uniqueGames.forEach(game => {
        const option = document.createElement('option');
        option.value = game;
        option.textContent = game;
        gameSelect.appendChild(option);
    });

    // Charger les stats
    updateStats();
}

function loadGameLeaderboard() {
    const gameSelect = document.getElementById('gameSelect');
    const gameName = gameSelect.value;
    const gameScores = Storage.getGameScores(gameName);
    const tbody = document.getElementById('gameScores');
    
    tbody.innerHTML = '';
    
    gameScores.slice(0, 50).forEach((score, index) => {
        const row = `<tr>
            <td>#${index + 1}</td>
            <td><strong>${score.score}</strong></td>
            <td>${score.date}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

function updateStats() {
    const scores = Storage.get('scores', []);
    const uniqueGames = new Set(scores.map(s => s.game)).size;
    const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
    const bestScore = Math.max(...scores.map(s => s.score), 0);
    
    document.getElementById('gamesPlayed').textContent = uniqueGames;
    document.getElementById('totalScoreGlobal').textContent = totalScore;
    document.getElementById('bestScore').textContent = bestScore;
    document.getElementById('playTime').textContent = '0h';
}

function resetAllScores() {
    Storage.resetAll();
}

// Initialiser au démarrage
document.addEventListener('DOMContentLoaded', () => {
    loadGames();
});