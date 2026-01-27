document.getElementById('start-btn').addEventListener('click', () => {
    // 儲存設定到 localStorage
    const settings = {
        p1Name: document.getElementById('input-p1-name').value,
        p2Name: document.getElementById('input-p2-name').value,
        raceNum: document.getElementById('input-race').value,
        breakRule: document.getElementById('input-break-rule').value,
        firstBreaker: parseInt(document.getElementById('input-first-breaker').value)
    };
    
    localStorage.setItem('poolMatchSettings', JSON.stringify(settings));
    
    // 跳轉到計分頁面
    window.location.href = 'game.html';
});