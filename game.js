let score1 = 0, score2 = 0, totalSeconds = 0;
let timerInterval = null;
let settings = JSON.parse(localStorage.getItem('poolMatchSettings'));
let currentBreaker = settings.firstBreaker;
const LONG_PRESS_DURATION = 1500;
const fsBtn = document.getElementById('fullscreen-btn');

// --- 全螢幕切換功能 ---
fsBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        // 進入全螢幕
        launchFullScreen(document.documentElement);
        fsBtn.innerText = "退出全螢幕";
    } else {
        // 退出全螢幕
        exitFullScreen();
        fsBtn.innerText = "進入全螢幕";
    }
});

function launchFullScreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) { // Safari
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { // IE/Edge
        element.msRequestFullscreen();
    }
}

function exitFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}

// 監聽使用者按 ESC 或系統退出全螢幕時，自動更改按鈕文字
document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        fsBtn.innerText = "進入全螢幕";
    }
});

// 初始化頁面顯示
document.getElementById('display-p1-name').innerText = settings.p1Name;
document.getElementById('display-p2-name').innerText = settings.p2Name;
document.getElementById('race-info').innerText = `(${settings.raceNum})`;

// 自動請求全螢幕 (部分瀏覽器支援)
window.onload = () => {
    startTimer();
    updateBreakerUI();
};

// --- 加分 (雙擊) ---
document.getElementById('player-1').addEventListener('dblclick', () => { score1++; updateUI(); handleBreak(1); });
document.getElementById('player-2').addEventListener('dblclick', () => { score2++; updateUI(); handleBreak(2); });

function updateUI() {
    document.getElementById('score-1').innerText = score1;
    document.getElementById('score-2').innerText = score2;
}

// --- 減分 (長按) ---
function setupLongPress(id, playerNum) {
    let pressTimer;
    const el = document.getElementById(id);
    const start = () => pressTimer = setTimeout(() => {
        if (playerNum === 1 && score1 > 0) score1--;
        if (playerNum === 2 && score2 > 0) score2--;
        updateUI();
        if (navigator.vibrate) navigator.vibrate(100);
    }, LONG_PRESS_DURATION);
    const cancel = () => clearTimeout(pressTimer);
    el.addEventListener('mousedown', start); el.addEventListener('mouseup', cancel);
    el.addEventListener('touchstart', start, {passive: false}); el.addEventListener('touchend', cancel);
}
setupLongPress('player-1', 1); setupLongPress('player-2', 2);

// --- 開球邏輯 ---
function handleBreak(winner) {
    if (settings.breakRule === 'winner') currentBreaker = winner;
    else if (settings.breakRule === 'alternate') currentBreaker = (currentBreaker === 1) ? 2 : 1;
    else if (settings.breakRule === 'loser') currentBreaker = (winner === 1) ? 2 : 1;
    updateBreakerUI();
}

function updateBreakerUI() {
    document.getElementById('player-1').classList.toggle('breaking', currentBreaker === 1);
    document.getElementById('player-2').classList.toggle('breaking', currentBreaker === 2);
}

// --- 計時器 ---
function startTimer() {
    timerInterval = setInterval(() => {
        totalSeconds++;
        let h = Math.floor(totalSeconds / 3600), m = Math.floor((totalSeconds % 3600) / 60), s = totalSeconds % 60;
        document.getElementById('timer').innerText = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    }, 1000);
}

// --- 回大廳 ---
document.getElementById('reset-btn').addEventListener('click', () => {
    if (confirm("確定結束比賽？")) window.location.href = 'index.html';
});

window.oncontextmenu = (e) => e.preventDefault();