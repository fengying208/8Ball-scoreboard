let score1 = 0;
let score2 = 0;
let totalSeconds = 0;
let timerInterval = null;
let breakRule = 'winner'; 
let currentBreaker = 1;

// 用來儲存長按計時器的變數
let pressTimer;
const LONG_PRESS_DURATION = 1500; // 1.5 秒

const lobby = document.getElementById('lobby');
const scoreboard = document.getElementById('scoreboard');

// --- 開始比賽 ---
document.getElementById('start-btn').addEventListener('click', () => {
    const p1Name = document.getElementById('input-p1-name').value;
    const p2Name = document.getElementById('input-p2-name').value;
    const raceNum = document.getElementById('input-race').value;
    breakRule = document.getElementById('input-break-rule').value;
    currentBreaker = parseInt(document.getElementById('input-first-breaker').value);

    document.getElementById('display-p1-name').innerText = p1Name;
    document.getElementById('display-p2-name').innerText = p2Name;
    document.getElementById('race-info').innerText = `(${raceNum})`;

    lobby.style.display = 'none';
    scoreboard.style.display = 'flex';

    resetMatch();
    startTimer();
    updateBreakerUI();
});

// --- 加分邏輯 (雙擊) ---
document.getElementById('player-1').addEventListener('dblclick', () => {
    score1++;
    document.getElementById('score-1').innerText = score1;
    handleScoreChange(1);
});

document.getElementById('player-2').addEventListener('dblclick', () => {
    score2++;
    document.getElementById('score-2').innerText = score2;
    handleScoreChange(2);
});

// --- 減分邏輯 (長按 2 秒) ---
function setupLongPress(elementId, playerNum) {
    const el = document.getElementById(elementId);

    const startPress = (e) => {
        // 防止平板彈出系統右鍵選單
        // e.preventDefault(); 
        
        pressTimer = setTimeout(() => {
            subtractScore(playerNum);
            // 觸發成功後震動一下 (如果設備支援)
            if (navigator.vibrate) navigator.vibrate(100); 
        }, LONG_PRESS_DURATION);
    };

    const cancelPress = () => {
        clearTimeout(pressTimer);
    };

    // 滑鼠事件 (電腦測試用)
    el.addEventListener('mousedown', startPress);
    el.addEventListener('mouseup', cancelPress);
    el.addEventListener('mouseleave', cancelPress);

    // 觸控事件 (平板使用)
    el.addEventListener('touchstart', startPress, { passive: false });
    el.addEventListener('touchend', cancelPress);
}

function subtractScore(playerNum) {
    if (playerNum === 1 && score1 > 0) {
        score1--;
        document.getElementById('score-1').innerText = score1;
    } else if (playerNum === 2 && score2 > 0) {
        score2--;
        document.getElementById('score-2').innerText = score2;
    }
}

// 啟動長按監聽
setupLongPress('player-1', 1);
setupLongPress('player-2', 2);

// 防止整個網頁彈出右鍵選單
window.oncontextmenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
};

// --- 其他邏輯 ---
function updateBreakerUI() {
    const p1Area = document.getElementById('player-1');
    const p2Area = document.getElementById('player-2');
    if (currentBreaker === 1) {
        p1Area.classList.add('breaking');
        p2Area.classList.remove('breaking');
    } else {
        p1Area.classList.remove('breaking');
        p2Area.classList.add('breaking');
    }
}

function handleScoreChange(winner) {
    if (breakRule === 'winner') {
        currentBreaker = winner;
    } else if (breakRule === 'alternate') {
        currentBreaker = (currentBreaker === 1) ? 2 : 1;
    } else if (breakRule === 'loser') {
        currentBreaker = (winner === 1) ? 2 : 1;
    }
    updateBreakerUI();
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    totalSeconds = 0;
    timerInterval = setInterval(() => {
        totalSeconds++;
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        document.getElementById('timer').innerText = 
            `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }, 1000);
}

function resetMatch() {
    score1 = 0; score2 = 0;
    document.getElementById('score-1').innerText = "0";
    document.getElementById('score-2').innerText = "0";
}

document.getElementById('reset-btn').addEventListener('click', () => {
    if (confirm("確定要結束比賽並回到大廳嗎？")) {
        clearInterval(timerInterval);
        scoreboard.style.display = 'none';
        lobby.style.display = 'flex';
    }
});