document.getElementById('add-saving-goal-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser.email) {
        alert('กรุณาลงชื่อเข้าใช้ก่อนเพิ่มเป้าหมาย');
        return;
    }

    const goalName = document.getElementById('goal-name').value;
    const targetAmount = parseFloat(document.getElementById('target-amount').value);
    const targetDate = document.getElementById('target-date').value;
    const initialAmount = parseFloat(document.getElementById('initial-amount').value || 0);

    const userId = currentUser.email;
    const goals = JSON.parse(localStorage.getItem(`savingsGoals_${userId}`) || '[]');
    const goalId = Date.now();
    goals.push({ id: goalId, name: goalName, target: targetAmount, initial: initialAmount, date: targetDate });
    localStorage.setItem(`savingsGoals_${userId}`, JSON.stringify(goals));

    renderGoals();
    updateCharts();
    e.target.reset();
});

function renderGoals() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser.email || 'guest';
    const goals = JSON.parse(localStorage.getItem(`savingsGoals_${userId}`) || '[]');
    const container = document.getElementById('saving-goals-container');
    container.innerHTML = '';

    if (!currentUser.email) {
        container.innerHTML = '<p class="text-muted">กรุณาลงชื่อเข้าใช้เพื่อดูเป้าหมายการออม</p>';
        return;
    }

    goals.forEach(goal => {
        const progress = (goal.initial / goal.target) * 100;
        const goalCard = document.createElement('div');
        goalCard.className = 'col-md-4';
        goalCard.innerHTML = `
            <div class="card shadow-sm">
                <div class="card-body">
                    <h5 class="card-title">${goal.name}</h5>
                    <p class="card-text">เป้าหมาย: ${goal.target.toLocaleString()} บาท</p>
                    <p class="card-text">ออมแล้ว: <span id="saved-${goal.id}">${goal.initial.toLocaleString()}</span> บาท</p>
                    <p class="card-text">วันที่เป้าหมาย: ${goal.date}</p>
                    <div class="progress mb-3">
                        <div class="progress-bar bg-primary" role="progressbar" style="width: ${progress}%" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100">${progress.toFixed(2)}%</div>
                    </div>
                    <div class="input-group mb-2">
                        <input type="number" class="form-control" id="add-amount-${goal.id}" placeholder="เพิ่มเงิน (บาท)">
                        <button class="btn btn-success" onclick="addToGoal(${goal.id})">เพิ่ม</button>
                    </div>
                    <button class="btn btn-danger w-100" onclick="deleteGoal(${goal.id})">ลบ</button>
                </div>
            </div>
        `;
        container.appendChild(goalCard);
    });
}

function addToGoal(goalId) {
    const addAmount = parseFloat(document.getElementById(`add-amount-${goalId}`).value);
    if (!addAmount || addAmount <= 0) return;

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser.email || 'guest';
    const goals = JSON.parse(localStorage.getItem(`savingsGoals_${userId}`) || '[]');
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
        goal.initial += addAmount;
        localStorage.setItem(`savingsGoals_${userId}`, JSON.stringify(goals));
        renderGoals();
        updateCharts();
    }
}

function deleteGoal(goalId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser.email || 'guest';
    let goals = JSON.parse(localStorage.getItem(`savingsGoals_${userId}`) || '[]');
    goals = goals.filter(g => g.id !== goalId);
    localStorage.setItem(`savingsGoals_${userId}`, JSON.stringify(goals));
    renderGoals();
    updateCharts();
}

function updateCharts() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser.email || 'guest';
    const goals = JSON.parse(localStorage.getItem(`savingsGoals_${userId}`) || '[]');

    const barCtx = document.getElementById('savingChart').getContext('2d');
    new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: goals.map(goal => goal.name),
            datasets: [
                { label: 'เงินที่ออมแล้ว', data: goals.map(goal => goal.initial), backgroundColor: '#0d6efd' },
                { label: 'เงินที่เหลือ', data: goals.map(goal => goal.target - goal.initial), backgroundColor: '#6c757d' }
            ]
        },
        options: { scales: { y: { beginAtZero: true } } }
    });

    const pieCtx = document.getElementById('savingPieChart').getContext('2d');
    new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: goals.map(goal => goal.name),
            datasets: [{ data: goals.map(goal => goal.initial), backgroundColor: ['#0d6efd', '#6c757d', '#198754', '#dc3545', '#ffc107'] }]
        }
    });
}

window.onload = () => {
    renderGoals();
    updateCharts();
};