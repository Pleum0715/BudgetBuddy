document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser.email || 'guest';

    if (!currentUser.email) {
        document.getElementById('savingsSummary').textContent = 'กรุณาลงชื่อเข้าใช้';
        document.getElementById('expenseSummary').textContent = 'กรุณาลงชื่อเข้าใช้';
        document.getElementById('analysisSummary').textContent = 'กรุณาลงชื่อเข้าใช้';
        document.getElementById('dashboardChart').style.display = 'none';
        return;
    }

    const savings = JSON.parse(localStorage.getItem(`savingsGoals_${userId}`) || '[]');
    const expenses = JSON.parse(localStorage.getItem(`expenses_${userId}`) || '[]');

    let totalSavings = 0, totalIncome = 0, totalExpense = 0;
    savings.forEach(goal => totalSavings += goal.initial);
    expenses.forEach(item => {
        if (item.type === 'income') totalIncome += item.amount;
        else totalExpense += item.amount;
    });

    document.getElementById('savingsSummary').textContent = `รวม: ${totalSavings.toLocaleString()} บาท`;
    document.getElementById('expenseSummary').textContent = `รายรับ: ${totalIncome.toLocaleString()} บาท, รายจ่าย: ${totalExpense.toLocaleString()} บาท`;
    document.getElementById('analysisSummary').textContent = totalExpense > totalIncome ? 'ระวัง! รายจ่ายมากกว่ารายรับ' : 'สถานะการเงินดี';

    new Chart(document.getElementById('dashboardChart'), {
        type: 'bar',
        data: {
            labels: ['ออมเงิน', 'รายรับ', 'รายจ่าย'],
            datasets: [{
                label: 'สรุปยอด (บาท)',
                data: [totalSavings, totalIncome, totalExpense],
                backgroundColor: ['#2ecc71', '#3498db', '#e74c3c']
            }]
        },
        options: { scales: { y: { beginAtZero: true } } }
    });
});