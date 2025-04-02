document.getElementById('expenseForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
        alert('กรุณาลงชื่อเข้าใช้ก่อนเพิ่มรายการ');
        return;
    }

    const type = document.getElementById('type').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;

    await db.collection('expenses').doc(user.uid).collection('items').add({
        type,
        amount,
        date,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    updateExpensesList();
    checkBalance();
    e.target.reset();
});

async function updateExpensesList() {
    const user = auth.currentUser;
    const list = document.getElementById('expensesList');
    list.innerHTML = '';

    if (!user) {
        list.innerHTML = '<p class="text-muted">กรุณาลงชื่อเข้าใช้เพื่อดูรายการ</p>';
        return;
    }

    const snapshot = await db.collection('expenses').doc(user.uid).collection('items').get();
    const expenses = snapshot.docs.map(doc => doc.data());

    let totalIncome = 0, totalExpense = 0;
    expenses.forEach(item => {
        if (item.type === 'income') totalIncome += item.amount;
        else totalExpense += item.amount;

        const div = document.createElement('div');
        div.className = 'p-2 bg-light rounded';
        div.innerHTML = `<p>${item.type === 'income' ? 'รายรับ' : 'รายจ่าย'}: ${item.amount.toLocaleString()} บาท (${item.date})</p>`;
        list.appendChild(div);
    });

    const summary = document.createElement('div');
    summary.innerHTML = `
        <p>รวมรายรับ: ${totalIncome.toLocaleString()} บาท</p>
        <p>รวมรายจ่าย: ${totalExpense.toLocaleString()} บาท</p>
    `;
    list.appendChild(summary);
}

async function checkBalance() {
    const user = auth.currentUser;
    const notification = document.getElementById('notification');

    if (!user) {
        notification.innerHTML = '';
        return;
    }

    const snapshot = await db.collection('expenses').doc(user.uid).collection('items').get();
    const expenses = snapshot.docs.map(doc => doc.data());

    let totalIncome = 0, totalExpense = 0;
    expenses.forEach(item => {
        if (item.type === 'income') totalIncome += item.amount;
        else totalExpense += item.amount;
    });

    if (totalExpense > totalIncome) {
        notification.innerHTML = `<p class="text-danger">⚠️ รายจ่าย (${totalExpense.toLocaleString()} บาท) มากกว่ารายรับ (${totalIncome.toLocaleString()} บาท)</p>`;
    } else {
        notification.innerHTML = '';
    }
}

auth.onAuthStateChanged(user => {
    updateExpensesList();
    checkBalance();
});