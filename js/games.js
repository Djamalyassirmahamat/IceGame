window.GAMES = [];

// 1. PONG (avec boutons Haut/Bas)
window.GAMES.push({
    name: 'Pong',
    html: `<canvas id="pongCanvas" width="800" height="400"></canvas><div class="control-buttons"><button class="btn btn-outline-success" id="pongUp">⬆️ Haut</button><button class="btn btn-outline-success" id="pongDown">⬇️ Bas</button></div>`,
    init: function() {
        const canvas = document.getElementById('pongCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width = Math.min(800, window.innerWidth - 40);
        canvas.height = 400;
        let paddleY = 150, computerY = 150;
        let ballX = canvas.width/2, ballY = canvas.height/2, ballDX = 4, ballDY = 4;
        let score = 0, active = true;
        const keys = {ArrowUp:false, ArrowDown:false};
        const keyHandler = (e) => { if(e.key==='ArrowUp') keys.ArrowUp=true; if(e.key==='ArrowDown') keys.ArrowDown=true; };
        const keyUpHandler = (e) => { if(e.key==='ArrowUp') keys.ArrowUp=false; if(e.key==='ArrowDown') keys.ArrowDown=false; };
        document.addEventListener('keydown', keyHandler);
        document.addEventListener('keyup', keyUpHandler);
        const upBtn = document.getElementById('pongUp'), downBtn = document.getElementById('pongDown');
        let touchUp=false, touchDown=false;
        const startUp = () => touchUp=true, stopUp = () => touchUp=false;
        const startDown = () => touchDown=true, stopDown = () => touchDown=false;
        upBtn.addEventListener('mousedown', startUp); upBtn.addEventListener('mouseup', stopUp); upBtn.addEventListener('mouseleave', stopUp);
        upBtn.addEventListener('touchstart', startUp); upBtn.addEventListener('touchend', stopUp);
        downBtn.addEventListener('mousedown', startDown); downBtn.addEventListener('mouseup', stopDown); downBtn.addEventListener('mouseleave', stopDown);
        downBtn.addEventListener('touchstart', startDown); downBtn.addEventListener('touchend', stopDown);
        function update() {
            let move = 0;
            if (keys.ArrowUp || touchUp) move = -6;
            if (keys.ArrowDown || touchDown) move = 6;
            paddleY = Math.max(0, Math.min(canvas.height-100, paddleY + move));
            ballX += ballDX; ballY += ballDY;
            if(ballY<0 || ballY>canvas.height) ballDY = -ballDY;
            if(ballX<30 && ballX>20 && ballY>paddleY && ballY<paddleY+100) { ballDX = Math.abs(ballDX); score++; }
            const computerCenter = computerY+50;
            if(computerCenter < ballY-30) computerY = Math.min(canvas.height-100, computerY+5);
            if(computerCenter > ballY+30) computerY = Math.max(0, computerY-5);
            if(ballX>canvas.width-30 && ballX<canvas.width-20 && ballY>computerY && ballY<computerY+100) ballDX = -Math.abs(ballDX);
            if(ballX<0 || ballX>canvas.width) active = false;
        }
        function draw() {
            ctx.fillStyle='#0d1117'; ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle='#00ff88'; ctx.fillRect(20,paddleY,10,100); ctx.fillRect(canvas.width-30,computerY,10,100);
            ctx.beginPath(); ctx.arc(ballX,ballY,8,0,Math.PI*2); ctx.fill();
            ctx.fillStyle='white'; ctx.font='20px monospace'; ctx.fillText('Score: '+score,10,30);
        }
        const interval = setInterval(()=>{ if(!active){ clearInterval(interval); window.submitScore('Pong',score); return; } update(); draw(); },30);
        this.stop = ()=>{
            clearInterval(interval);
            document.removeEventListener('keydown',keyHandler); document.removeEventListener('keyup',keyUpHandler);
            upBtn.removeEventListener('mousedown', startUp); upBtn.removeEventListener('mouseup', stopUp); upBtn.removeEventListener('mouseleave', stopUp);
            upBtn.removeEventListener('touchstart', startUp); upBtn.removeEventListener('touchend', stopUp);
            downBtn.removeEventListener('mousedown', startDown); downBtn.removeEventListener('mouseup', stopDown); downBtn.removeEventListener('mouseleave', stopDown);
            downBtn.removeEventListener('touchstart', startDown); downBtn.removeEventListener('touchend', stopDown);
        };
    },
    stop:()=>{}
});

// 2. SNAKE (boutons directionnels)
window.GAMES.push({
    name: 'Snake',
    html: `<canvas id="snakeCanvas" width="400" height="400"></canvas><div class="control-buttons"><button class="btn btn-outline-success" id="snakeUp">⬆️</button><button class="btn btn-outline-success" id="snakeDown">⬇️</button><button class="btn btn-outline-success" id="snakeLeft">⬅️</button><button class="btn btn-outline-success" id="snakeRight">➡️</button></div>`,
    init: function() {
        const canvas = document.getElementById('snakeCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width=400; canvas.height=400;
        let snake = [{x:10,y:10}], food = {x:15,y:15}, dir={x:1,y:0}, nextDir={x:1,y:0}, score=0, active=true;
        const keyHandler = (e) => {
            if(e.key==='ArrowUp' && dir.y===0) nextDir={x:0,y:-1};
            if(e.key==='ArrowDown' && dir.y===0) nextDir={x:0,y:1};
            if(e.key==='ArrowLeft' && dir.x===0) nextDir={x:-1,y:0};
            if(e.key==='ArrowRight' && dir.x===0) nextDir={x:1,y:0};
        };
        document.addEventListener('keydown', keyHandler);
        const setDir = (dx,dy) => { if(active && (dx!==0||dy!==0) && ((dx===0&&dir.x!==0)||(dy===0&&dir.y!==0))) nextDir={x:dx,y:dy}; };
        document.getElementById('snakeUp').onclick = ()=>setDir(0,-1);
        document.getElementById('snakeDown').onclick = ()=>setDir(0,1);
        document.getElementById('snakeLeft').onclick = ()=>setDir(-1,0);
        document.getElementById('snakeRight').onclick = ()=>setDir(1,0);
        function update() {
            dir = nextDir;
            const head = {x:snake[0].x+dir.x, y:snake[0].y+dir.y};
            if(head.x<0||head.x>=20||head.y<0||head.y>=20||snake.some(s=>s.x===head.x&&s.y===head.y)) { active=false; return; }
            snake.unshift(head);
            if(head.x===food.x && head.y===food.y) { score+=10; food={x:Math.floor(Math.random()*20), y:Math.floor(Math.random()*20)}; }
            else snake.pop();
        }
        function draw() {
            ctx.fillStyle='#0d1117'; ctx.fillRect(0,0,400,400);
            ctx.fillStyle='#00ff88'; snake.forEach(s=>ctx.fillRect(s.x*20,s.y*20,18,18));
            ctx.fillStyle='#ffff00'; ctx.fillRect(food.x*20,food.y*20,18,18);
            ctx.fillStyle='white'; ctx.font='20px monospace'; ctx.fillText('Score: '+score,10,30);
        }
        const loop = setInterval(()=>{ if(!active){ clearInterval(loop); window.submitScore('Snake',score); return; } update(); draw(); },100);
        this.stop = ()=>{ clearInterval(loop); document.removeEventListener('keydown',keyHandler); };
    },
    stop:()=>{}
});

// 3. MEMORY (tactile pur)
window.GAMES.push({
    name: 'Memory',
    html: '<div id="memoryGame" style="display:grid; grid-template-columns:repeat(4,80px); gap:10px; justify-content:center;"></div>',
    init: function() {
        const div = document.getElementById('memoryGame');
        const symbols = ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼'];
        const deck = [...symbols, ...symbols].sort(()=>Math.random()-0.5);
        let flipped=[], matched=0, score=0, ended=false;
        div.innerHTML = '';
        deck.forEach((sym)=>{
            const card = document.createElement('button');
            card.className='btn btn-outline-success';
            card.style.cssText='width:80px;height:80px;font-size:2em;margin:5px';
            card.textContent='?';
            card.dataset.symbol=sym;
            card.onclick=()=>{
                if(ended || flipped.length===2 || card.textContent!=='?') return;
                card.textContent=sym;
                flipped.push(card);
                if(flipped.length===2){
                    if(flipped[0].dataset.symbol===flipped[1].dataset.symbol){
                        matched++; score+=10; flipped=[];
                        if(matched===8){ ended=true; window.submitScore('Memory',score); }
                    } else {
                        setTimeout(()=>{ flipped.forEach(c=>c.textContent='?'); flipped=[]; },800);
                    }
                }
            };
            div.appendChild(card);
        });
    },
    stop:()=>{}
});

// 4. 2048 (version corrigée avec boutons)
window.GAMES.push({
    name: '2048',
    html: `<div id="grid2048" style="display:grid; grid-template-columns:repeat(4,80px); gap:10px; justify-content:center; margin:20px auto;"></div><p id="score2048" class="text-success text-center" style="font-size:1.5rem;">Score: 0</p><div class="control-buttons"><button class="btn btn-outline-success" id="btnUp2048">⬆️</button><button class="btn btn-outline-success" id="btnDown2048">⬇️</button><button class="btn btn-outline-success" id="btnLeft2048">⬅️</button><button class="btn btn-outline-success" id="btnRight2048">➡️</button></div>`,
    init: function() {
        let grid = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
        let score = 0, active = true;
        function addRandom() {
            let empty = [];
            for(let i=0;i<4;i++) for(let j=0;j<4;j++) if(grid[i][j]===0) empty.push([i,j]);
            if(empty.length===0) return false;
            let [r,c] = empty[Math.floor(Math.random()*empty.length)];
            grid[r][c] = Math.random()<0.9 ? 2 : 4;
            return true;
        }
        function draw() {
            const container = document.getElementById('grid2048');
            container.innerHTML = '';
            for(let i=0;i<4;i++) for(let j=0;j<4;j++){
                const tile = document.createElement('div');
                tile.className='btn btn-outline-success';
                tile.style.cssText='width:80px;height:80px;display:flex;align-items:center;justify-content:center;font-size:1.5em;font-weight:bold;';
                tile.textContent = grid[i][j]===0 ? '' : grid[i][j];
                container.appendChild(tile);
            }
            document.getElementById('score2048').textContent = `Score: ${score}`;
        }
        function move(direction) {
            if(!active) return false;
            let old = JSON.parse(JSON.stringify(grid));
            function rotate(times){
                for(let t=0;t<times;t++){
                    let newGrid = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
                    for(let i=0;i<4;i++) for(let j=0;j<4;j++) newGrid[j][3-i] = grid[i][j];
                    grid = newGrid;
                }
            }
            if(direction==='right') rotate(2);
            if(direction==='up') rotate(1);
            if(direction==='down') rotate(3);
            for(let row=0;row<4;row++){
                let newRow = [];
                for(let col=0;col<4;col++) if(grid[row][col]!==0) newRow.push(grid[row][col]);
                for(let i=0;i<newRow.length-1;i++){
                    if(newRow[i]===newRow[i+1]){
                        newRow[i]*=2;
                        score += newRow[i];
                        newRow.splice(i+1,1);
                    }
                }
                while(newRow.length<4) newRow.push(0);
                grid[row] = newRow;
            }
            if(direction==='right') rotate(2);
            if(direction==='up') rotate(3);
            if(direction==='down') rotate(1);
            let changed = JSON.stringify(old) !== JSON.stringify(grid);
            if(changed){
                addRandom();
                draw();
                let gameOver = true;
                for(let i=0;i<4;i++) for(let j=0;j<4;j++) if(grid[i][j]===0) gameOver=false;
                if(gameOver) { active=false; window.submitScore('2048',score); }
            }
            return changed;
        }
        addRandom(); addRandom(); draw();
        const keyHandler = (e) => {
            if(!active) return;
            if(e.key==='ArrowLeft') move('left');
            if(e.key==='ArrowRight') move('right');
            if(e.key==='ArrowUp') move('up');
            if(e.key==='ArrowDown') move('down');
        };
        document.addEventListener('keydown', keyHandler);
        document.getElementById('btnUp2048').onclick = ()=>move('up');
        document.getElementById('btnDown2048').onclick = ()=>move('down');
        document.getElementById('btnLeft2048').onclick = ()=>move('left');
        document.getElementById('btnRight2048').onclick = ()=>move('right');
        this.stop = ()=> document.removeEventListener('keydown', keyHandler);
    },
    stop:()=>{}
});

// 5. FLAPPY BIRD (bouton sauter)
window.GAMES.push({
    name: 'Flappy Bird',
    html: `<canvas id="flappyCanvas" width="400" height="600"></canvas><div class="control-buttons"><button class="btn btn-success btn-lg" id="flappyJump">🕹️ Sauter</button></div>`,
    init: function() {
        const canvas = document.getElementById('flappyCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width=400; canvas.height=600;
        let birdY=300, vel=0, pipes=[], frame=0, score=0, active=true;
        const jump = ()=>{ if(active) vel=-8; };
        document.addEventListener('keydown', jump);
        document.addEventListener('click', jump);
        const jumpBtn = document.getElementById('flappyJump');
        if(jumpBtn) jumpBtn.onclick = jump;
        function update() {
            vel+=0.5; birdY+=vel;
            if(birdY<0||birdY+30>600) active=false;
            if(frame%100===0){
                let gapY = 150+Math.random()*200;
                pipes.push({x:400, top:gapY-100, bottom:gapY+100});
            }
            for(let i=0;i<pipes.length;i++){
                pipes[i].x -=3;
                if(pipes[i].x+50<0){ pipes.splice(i,1); i--; }
                else if(pipes[i].x<70 && pipes[i].x+50>50){
                    if(birdY<pipes[i].top || birdY+30>pipes[i].bottom) active=false;
                    else if(!pipes[i].counted){ score++; pipes[i].counted=true; }
                }
            }
            frame++;
        }
        function draw() {
            ctx.fillStyle='#87CEEB'; ctx.fillRect(0,0,400,600);
            ctx.fillStyle='#00ff88'; ctx.fillRect(50,birdY,30,30);
            ctx.fillStyle='#228B22';
            pipes.forEach(p=>{ ctx.fillRect(p.x,0,50,p.top); ctx.fillRect(p.x,p.bottom,50,600-p.bottom); });
            ctx.fillStyle='white'; ctx.font='20px monospace'; ctx.fillText('Score: '+score,10,30);
        }
        const interval = setInterval(()=>{
            if(!active){ clearInterval(interval); window.submitScore('Flappy Bird',score); return; }
            update(); draw();
        },30);
        this.stop = ()=>{ clearInterval(interval); document.removeEventListener('keydown',jump); document.removeEventListener('click',jump); if(jumpBtn) jumpBtn.onclick=null; };
    },
    stop:()=>{}
});

// 6. BREAKOUT (boutons gauche/droite)
window.GAMES.push({
    name: 'Breakout',
    html: `<canvas id="breakoutCanvas" width="400" height="600"></canvas><div class="control-buttons"><button class="btn btn-outline-success" id="breakoutLeft">⬅️ Gauche</button><button class="btn btn-outline-success" id="breakoutRight">➡️ Droite</button></div>`,
    init: function() {
        const canvas = document.getElementById('breakoutCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width=400; canvas.height=600;
        let paddleX=150, ballX=200, ballY=500, ballDX=3, ballDY=-3;
        let bricks=[], score=0, active=true;
        for(let i=0;i<5;i++) for(let j=0;j<8;j++) bricks.push({x:j*50, y:i*20+30, w:48, h:18, active:true});
        const keys={ArrowLeft:false, ArrowRight:false};
        const keyHandler = (e)=>{ if(e.key==='ArrowLeft') keys.ArrowLeft=true; if(e.key==='ArrowRight') keys.ArrowRight=true; };
        const keyUpHandler = (e)=>{ if(e.key==='ArrowLeft') keys.ArrowLeft=false; if(e.key==='ArrowRight') keys.ArrowRight=false; };
        document.addEventListener('keydown', keyHandler);
        document.addEventListener('keyup', keyUpHandler);
        const leftBtn = document.getElementById('breakoutLeft'), rightBtn = document.getElementById('breakoutRight');
        let leftPressed=false, rightPressed=false;
        const setLeft = (s)=>leftPressed=s, setRight=(s)=>rightPressed=s;
        leftBtn.addEventListener('mousedown',()=>setLeft(true)); leftBtn.addEventListener('mouseup',()=>setLeft(false)); leftBtn.addEventListener('mouseleave',()=>setLeft(false));
        leftBtn.addEventListener('touchstart',()=>setLeft(true)); leftBtn.addEventListener('touchend',()=>setLeft(false));
        rightBtn.addEventListener('mousedown',()=>setRight(true)); rightBtn.addEventListener('mouseup',()=>setRight(false)); rightBtn.addEventListener('mouseleave',()=>setRight(false));
        rightBtn.addEventListener('touchstart',()=>setRight(true)); rightBtn.addEventListener('touchend',()=>setRight(false));
        function update() {
            let move=0;
            if(keys.ArrowLeft||leftPressed) move=-6;
            if(keys.ArrowRight||rightPressed) move=6;
            paddleX = Math.max(0, Math.min(350, paddleX+move));
            ballX+=ballDX; ballY+=ballDY;
            if(ballX<0||ballX>400) ballDX=-ballDX;
            if(ballY<0) ballDY=-ballDY;
            if(ballY+5>600) active=false;
            if(ballY+5>580 && ballX>paddleX && ballX<paddleX+50) ballDY=-ballDY;
            bricks.forEach(b=>{
                if(b.active && ballX>b.x && ballX<b.x+b.w && ballY>b.y && ballY<b.y+b.h){
                    b.active=false; ballDY=-ballDY; score+=10;
                }
            });
        }
        function draw() {
            ctx.fillStyle='#0d1117'; ctx.fillRect(0,0,400,600);
            ctx.fillStyle='#00ff88'; ctx.fillRect(paddleX,580,50,10);
            ctx.fillStyle='yellow'; ctx.beginPath(); ctx.arc(ballX,ballY,5,0,Math.PI*2); ctx.fill();
            bricks.forEach(b=>{ if(b.active){ ctx.fillStyle='#667eea'; ctx.fillRect(b.x,b.y,b.w,b.h); } });
            ctx.fillStyle='white'; ctx.font='20px monospace'; ctx.fillText('Score: '+score,10,30);
        }
        const loop = setInterval(()=>{ if(!active){ clearInterval(loop); window.submitScore('Breakout',score); return; } update(); draw(); },30);
        this.stop = ()=>{
            clearInterval(loop);
            document.removeEventListener('keydown',keyHandler); document.removeEventListener('keyup',keyUpHandler);
            leftBtn.removeEventListener('mousedown',setLeft); leftBtn.removeEventListener('mouseup',setLeft); leftBtn.removeEventListener('mouseleave',setLeft);
            leftBtn.removeEventListener('touchstart',setLeft); leftBtn.removeEventListener('touchend',setLeft);
            rightBtn.removeEventListener('mousedown',setRight); rightBtn.removeEventListener('mouseup',setRight); rightBtn.removeEventListener('mouseleave',setRight);
            rightBtn.removeEventListener('touchstart',setRight); rightBtn.removeEventListener('touchend',setRight);
        };
    },
    stop:()=>{}
});

// 7. TIC-TAC-TOE (tactile)
window.GAMES.push({
    name: 'Tic-Tac-Toe',
    html: '<div id="tttBoard" style="display:grid; grid-template-columns:repeat(3,100px); gap:5px; justify-content:center;"></div><p id="tttStatus" class="text-center mt-3"></p>',
    init: function() {
        let board = ['','','','','','','','',''];
        let turn = 'X';
        let gameOver = false;
        const container = document.getElementById('tttBoard');
        const status = document.getElementById('tttStatus');
        function checkWin() {
            const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
            for(let l of lines) if(board[l[0]] && board[l[0]]===board[l[1]] && board[l[1]]===board[l[2]]) return board[l[0]];
            if(board.every(c=>c!=='')) return 'tie';
            return null;
        }
        function render() {
            container.innerHTML = '';
            for(let i=0;i<9;i++){
                const btn = document.createElement('button');
                btn.className='btn btn-outline-success';
                btn.style.cssText='width:100px;height:100px;font-size:2em;';
                btn.textContent = board[i];
                btn.disabled = gameOver || board[i]!=='';
                btn.onclick = ()=>{
                    if(gameOver) return;
                    board[i] = turn;
                    const winner = checkWin();
                    if(winner){
                        gameOver=true;
                        if(winner==='tie') status.textContent = 'Match nul ! Score: 5';
                        else status.textContent = `${winner} gagne ! Score: 10`;
                        window.submitScore('Tic-Tac-Toe', winner==='tie' ? 5 : 10);
                    } else {
                        turn = turn==='X' ? 'O' : 'X';
                        render();
                    }
                };
                container.appendChild(btn);
            }
        }
        render();
    },
    stop:()=>{}
});

// 8. SIMON SAYS (tactile)
window.GAMES.push({
    name: 'Simon Says',
    html: `<div style="display:flex; gap:10px; justify-content:center;"><div id="simonRed" style="width:100px;height:100px;background:darkred;border-radius:10px;"></div><div id="simonGreen" style="width:100px;height:100px;background:darkgreen;border-radius:10px;"></div></div><div style="display:flex; gap:10px; justify-content:center; margin-top:10px;"><div id="simonBlue" style="width:100px;height:100px;background:darkblue;border-radius:10px;"></div><div id="simonYellow" style="width:100px;height:100px;background:darkgoldenrod;border-radius:10px;"></div></div><p id="simonStatus" class="text-center mt-3"></p>`,
    init: function() {
        const colors = ['red','green','blue','yellow'];
        let sequence = [], playerIndex=0, score=0, canPlay=false;
        const statusDiv = document.getElementById('simonStatus');
        function flash(color, callback) {
            const elem = document.getElementById(`simon${color[0].toUpperCase()+color.slice(1)}`);
            if(!elem) return;
            const oldBg = elem.style.background;
            elem.style.background = `light${color}`;
            setTimeout(()=>{ elem.style.background = oldBg; if(callback) callback(); },300);
        }
        function playSequence() {
            canPlay=false;
            let i=0;
            function next(){ if(i>=sequence.length){ canPlay=true; statusDiv.textContent='À ton tour !'; return; } flash(sequence[i], ()=>{ i++; next(); }); }
            next();
        }
        function addRound() { sequence.push(colors[Math.floor(Math.random()*4)]); playSequence(); }
        function gameOver() { canPlay=false; statusDiv.textContent = `Partie terminée ! Score: ${score}`; window.submitScore('Simon Says', score); }
        function handleClick(color) {
            if(!canPlay) return;
            flash(color);
            if(color !== sequence[playerIndex]){ gameOver(); return; }
            playerIndex++;
            if(playerIndex === sequence.length){ score+=10; statusDiv.textContent = `Bon ! +10 points. Nouveau round...`; playerIndex=0; canPlay=false; setTimeout(()=> addRound(), 1000); }
        }
        colors.forEach(c=>{ document.getElementById(`simon${c[0].toUpperCase()+c.slice(1)}`).onclick = ()=> handleClick(c); });
        addRound();
        this.stop = ()=>{ colors.forEach(c=>{ document.getElementById(`simon${c[0].toUpperCase()+c.slice(1)}`).onclick = null; }); };
    },
    stop:()=>{}
});

// 9. JUSTE PRIX
window.GAMES.push({
    name: 'Juste Prix',
    html: '<div class="text-center"><p>Devinez le prix entre 1 et 100</p><input type="number" id="guessInput" class="form-control w-50 mx-auto"><button id="guessBtn" class="btn btn-success mt-2">Deviner</button><p id="guessResult" class="mt-3"></p></div>',
    init: function() {
        let secret = Math.floor(Math.random()*100)+1, attempts=0, finished=false;
        const input = document.getElementById('guessInput'), btn = document.getElementById('guessBtn'), result = document.getElementById('guessResult');
        btn.onclick = () => {
            if(finished) return;
            const guess = parseInt(input.value);
            if(isNaN(guess)) return;
            attempts++;
            if(guess === secret){
                let score = Math.max(0, 100 - attempts*5);
                result.innerHTML = `<span class="text-success">Bravo ! Le prix était ${secret}. Score: ${score}</span>`;
                window.submitScore('Juste Prix', score);
                finished=true; btn.disabled=true;
            } else if(guess < secret) result.innerHTML = '<span class="text-warning">Plus haut !</span>';
            else result.innerHTML = '<span class="text-warning">Plus bas !</span>';
            input.value = '';
        };
    },
    stop:()=>{}
});

// 10. PIERRE-FEUILLE-CISEAUX
window.GAMES.push({
    name: 'Pierre-Feuille-Ciseaux',
    html: '<div class="text-center"><button id="rock" class="btn btn-success m-2">🪨 Pierre</button><button id="paper" class="btn btn-success m-2">📄 Feuille</button><button id="scissors" class="btn btn-success m-2">✂️ Ciseaux</button><p id="rpsResult" class="mt-3"></p><p id="rpsScore" class="mt-2">Score: 0</p></div>',
    init: function() {
        let playerScore = 0, finished = false;
        const resultDiv = document.getElementById('rpsResult'), scoreDiv = document.getElementById('rpsScore');
        const choices = ['pierre','feuille','ciseaux'];
        function play(player) {
            if(finished) return;
            const computer = choices[Math.floor(Math.random()*3)];
            let msg = '';
            if(player===computer) msg = 'Égalité !';
            else if((player==='pierre' && computer==='ciseaux') || (player==='feuille' && computer==='pierre') || (player==='ciseaux' && computer==='feuille')) {
                playerScore += 10; msg = `Gagné ! ${player} bat ${computer}`;
            } else { msg = `Perdu... ${computer} bat ${player}`; }
            scoreDiv.textContent = `Score: ${playerScore}`;
            resultDiv.innerHTML = msg;
            if(playerScore >= 50) { finished=true; resultDiv.innerHTML += `<br><span class="text-success">Partie terminée ! Score final: ${playerScore}</span>`; window.submitScore('Pierre-Feuille-Ciseaux', playerScore); }
        }
        document.getElementById('rock').onclick = ()=> play('pierre');
        document.getElementById('paper').onclick = ()=> play('feuille');
        document.getElementById('scissors').onclick = ()=> play('ciseaux');
    },
    stop:()=>{}
});