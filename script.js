// 1. Base de données des défis
const CHALLENGES = [
    {
        name: "Table de Multiplication",
        desc: "Écris une fonction qui prend 'n' et retourne un tableau des multiplications de n par 1 jusqu'à 10.\nEx: mult(2) -> [2, 4, ..., 20]",
        starter: "function solve(n) {\n  // Ton code ici\n  \n}",
        time: 60,
        test: (fn) => JSON.stringify(fn(5)) === JSON.stringify([5, 10, 15, 20, 25, 30, 35, 40, 45, 50])
    },
    {
        name: "FizzBuzz Inverse",
        desc: "Si n est divisible par 3 retourne 'Fizz', par 5 'Buzz', par les deux 'FizzBuzz', sinon retourne n.",
        starter: "function solve(n) {\n  \n}",
        time: 45,
        test: (fn) => fn(15) === "FizzBuzz" && fn(9) === "Fizz" && fn(10) === "Buzz"
    },
    {
        name: "Somme des Pairs",
        desc: "Additionne tous les nombres pairs d'un tableau donné.",
        starter: "function solve(arr) {\n  \n}",
        time: 90,
        test: (fn) => fn([1, 2, 3, 4, 5, 6]) === 12
    }
];

let timerInterval;
let currentIdx = null;

// 2. Fonctions de Navigation
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function initMenu() {
    const grid = document.getElementById('challengeGrid');
    grid.innerHTML = CHALLENGES.map((c, i) => `
        <div class="col-md-4 mb-3">
            <div class="glass p-4 text-center">
                <h5>${c.name}</h5>
                <p class="text-secondary small">Temps: ${c.time}s</p>
                <button class="btn btn-outline-success btn-sm" onclick="startChallenge(${i})">LANCER_LE_DUEL</button>
            </div>
        </div>
    `).join('');
}

// 3. Logique du Jeu
function startChallenge(idx) {
    currentIdx = idx;
    const c = CHALLENGES[idx];
    document.getElementById('gameTitle').innerText = c.name;
    document.getElementById('missionDesc').innerText = c.desc;
    document.getElementById('codeEditor').value = c.starter;
    document.getElementById('console').innerHTML = "> Système prêt...";
    
    startTimer(c.time);
    showScreen('gameScreen');
}

function startTimer(seconds) {
    let timeLeft = seconds;
    const display = document.getElementById('timer');
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        display.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 10) display.classList.add('timer-crit');
        else display.classList.remove('timer-crit');

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("TEMP ÉCOULÉ ! Déconnexion du serveur...");
            showScreen('mainMenu');
        }
        timeLeft--;
    }, 1000);
}

function evaluateCode() {
    const userCode = document.getElementById('codeEditor').value;
    const log = document.getElementById('console');

    try {
        // Extraction de la fonction depuis le texte
        const playerFn = new Function(`return ${userCode}`)();
        
        if (typeof playerFn !== 'function') throw new Error("Format invalide. Utilise 'function solve(n) { ... }'");

        const isCorrect = CHALLENGES[currentIdx].test(playerFn);

        if (isCorrect) {
            clearInterval(timerInterval);
            log.innerHTML = `<span class="text-success">> [SUCCESS] Code optimisé. Intégrité vérifiée !</span>`;
            setTimeout(() => { alert("Challenge réussi !"); showScreen('mainMenu'); }, 1500);
        } else {
            log.innerHTML += `<br><span class="text-danger">> [FAIL] Résultat incorrect pour les tests.</span>`;
        }
    } catch (e) {
        log.innerHTML += `<br><span class="text-danger">> [SYNTAX_ERROR] : ${e.message}</span>`;
    }
}

// Lancement
document.addEventListener('DOMContentLoaded', initMenu);
