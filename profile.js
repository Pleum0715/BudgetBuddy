document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[email] && users[email].password === password) {
        localStorage.setItem('currentUser', JSON.stringify({ email }));
        showProfile();
    } else {
        alert('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }
});

document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[email]) {
        alert('อีเมลนี้มีผู้ใช้แล้ว');
    } else {
        users[email] = { password };
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify({ email }));
        showProfile();
    }
});

document.getElementById('profileForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const password = document.getElementById('password').value;

    const users = JSON.parse(localStorage.getItem('users') || '{}');
    users[currentUser.email].password = password;
    localStorage.setItem('users', JSON.stringify(users));
    alert('บันทึกการเปลี่ยนแปลงสำเร็จ!');
});

function showProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.email) {
        document.getElementById('loginSection').classList.add('d-none');
        document.getElementById('registerSection').classList.add('d-none');
        document.getElementById('profileSection').classList.remove('d-none');

        const users = JSON.parse(localStorage.getItem('users') || '{}');
        document.getElementById('email').value = currentUser.email;
        document.getElementById('password').value = users[currentUser.email].password;
        document.getElementById('displayName').textContent = currentUser.email.split('@')[0];
        document.getElementById('displayEmail').textContent = currentUser.email;
    }
}

function showRegister() {
    document.getElementById('loginSection').classList.add('d-none');
    document.getElementById('registerSection').classList.remove('d-none');
}

function showLogin() {
    document.getElementById('registerSection').classList.add('d-none');
    document.getElementById('loginSection').classList.remove('d-none');
}

function logout() {
    localStorage.removeItem('currentUser');
    document.getElementById('profileSection').classList.add('d-none');
    document.getElementById('loginSection').classList.remove('d-none');
}

window.onload = () => {
    showProfile();
};