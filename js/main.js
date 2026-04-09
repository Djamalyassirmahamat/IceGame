// Gestion des écrans
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}
function showGames() { loadGames(); showScreen('gamesScreen'); }
function showLeaderboard() { loadLeaderboard(); showScreen('leaderboardScreen'); }
function showAbout() { showScreen('aboutScreen'); }
function backToMenu() { stopCurrentGame(); showScreen('mainMenu'); }
function backToGames() { stopCurrentGame(); loadGames(); showScreen('gamesScreen'); }

// Stockage Local
const Storage = {
    get: (key, defaultValue = null) => { try { const data = localStorage.getItem(key); return data ? JSON.parse(data) : defaultValue; } catch(e) { return defaultValue; } },
    set: (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch(e) { console.error(e); } },
    addScore: (gameName, score) => {
        let scores = Storage.get('scores', []);
        scores.push({ game: gameName, score: score, date: new Date().toLocaleDateString('fr-FR') });
        if (scores.length > 1000) scores = scores.slice(-1000);
        Storage.set('scores', scores);
    },
    getGameScores: (gameName) => Storage.get('scores', []).filter(s => s.game === gameName).sort((a,b) => b.score - a.score),
    getBestScore: (gameName) => { const s = Storage.getGameScores(gameName); return s.length ? s[0].score : 0; },
    getTotalScore: () => Storage.get('scores', []).reduce((sum,s) => sum + s.score, 0),
    getAllScores: () => Storage.get('scores', []).sort((a,b) => new Date(b.date) - new Date(a.date)),
    resetAll: () => { if(confirm('Êtes-vous sûr ?')) { localStorage.removeItem('scores'); alert('Scores réinitialisés'); loadLeaderboard(); } }
};

let currentGameIndex = -1;

function loadGames() {
    const grid = document.getElementById('gamesGrid');
    const totalScore = Storage.getTotalScore();
    document.getElementById('totalScore').textContent = `Score Total: ${totalScore}`;
    grid.innerHTML = '';
    window.GAMES.forEach((game, idx) => {
        const best = Storage.getBestScore(game.name);
        const col = document.createElement('div');
        col.className = 'col-12 col-sm-6 col-md-4 col-lg-3';
        col.innerHTML = `<div class="game-card" onclick="playGame(${idx})"><div><div class="game-card-title">${game.name}</div><small class="text-muted">Meilleur: ${best}</small></div></div>`;
        grid.appendChild(col);
    });
}

function filterGames() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    document.querySelectorAll('.game-card').forEach((card, i) => {
        const name = window.GAMES[i].name.toLowerCase();
        card.parentElement.style.display = name.includes(search) ? '' : 'none';
    });
}

function playGame(idx) {
    const game = window.GAMES[idx];
    currentGameIndex = idx;
    document.getElementById('gameName').textContent = game.name;
    document.getElementById('gameContent').innerHTML = game.html;
    document.getElementById('gameScore').textContent = '⏱️ En cours...';
    showScreen('gameScreen');
    if (game.init) game.init();
}

function stopCurrentGame() {
    if (currentGameIndex >= 0 && window.GAMES[currentGameIndex].stop) {
        window.GAMES[currentGameIndex].stop();
    }
    currentGameIndex = -1;
}

window.submitScore = function(gameName, score) {
    Storage.addScore(gameName, score);
    document.getElementById('gameScore').innerHTML = `✅ Score: ${score} points !`;
};

function loadLeaderboard() {
    const scores = Storage.getAllScores();
    const globalTbody = document.getElementById('globalScores');
    globalTbody.innerHTML = '';
    scores.slice(0,50).forEach((s,i) => { globalTbody.innerHTML += `<tr><td>#${i+1}</td><td>${s.game}</td><td><strong>${s.score}</strong></td><td>${s.date}</td></tr>`; });
    const gameSelect = document.getElementById('gameSelect');
    const uniqueGames = [...new Set(window.GAMES.map(g => g.name))];
    gameSelect.innerHTML = '<option value="">Sélectionner un jeu...</option>';
    uniqueGames.forEach(g => { const opt = document.createElement('option'); opt.value = g; opt.textContent = g; gameSelect.appendChild(opt); });
    updateStats();
}

function loadGameLeaderboard() {
    const gameName = document.getElementById('gameSelect').value;
    if (!gameName) return;
    const scores = Storage.getGameScores(gameName);
    const tbody = document.getElementById('gameScores');
    tbody.innerHTML = '';
    scores.slice(0,50).forEach((s,i) => { tbody.innerHTML += `<tr><td>#${i+1}</td><td><strong>${s.score}</strong></td><td>${s.date}</td></tr>`; });
}

function updateStats() {
    const scores = Storage.get('scores', []);
    const uniqueGames = new Set(scores.map(s => s.game)).size;
    const totalScore = scores.reduce((sum,s) => sum + s.score, 0);
    const bestScore = scores.length ? Math.max(...scores.map(s => s.score)) : 0;
    document.getElementById('gamesPlayed').textContent = uniqueGames;
    document.getElementById('totalScoreGlobal').textContent = totalScore;
    document.getElementById('bestScore').textContent = bestScore;
    document.getElementById('playTime').textContent = '0h';
}
function resetAllScores() { Storage.resetAll(); }
document.addEventListener('DOMContentLoaded', () => loadGames());