async function sendMessage() {
    const userInput = document.getElementById('userInput').value;
    if (!userInput) return;

    const chatBox = document.getElementById('chatBox');
    chatBox.innerHTML += `<p><strong>คุณ:</strong> ${userInput}</p>`;

    try {
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: userInput })
        });
        const data = await response.json();
        chatBox.innerHTML += `<p><strong>AI:</strong> ${data.message}</p>`;
    } catch (error) {
        chatBox.innerHTML += `<p><strong>AI:</strong> ขอโทษครับ เกิดข้อผิดพลาดในการเชื่อมต่อ</p>`;
    }

    chatBox.scrollTop = chatBox.scrollHeight;
    document.getElementById('userInput').value = '';
}