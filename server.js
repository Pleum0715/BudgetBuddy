const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY'; // ใส่ API Key ของคุณที่นี่

app.post('/api/chat', async (req, res) => {
    const { prompt } = req.body;

    try {
        const response = await axios.post('https://api.openai.com/v1/completions', {
            model: 'text-davinci-003', // หรือรุ่นอื่นที่คุณต้องการ
            prompt: `คุณคือ BudgetBuddy AI ผู้ช่วยด้านการเงิน คำถาม: ${prompt}`,
            max_tokens: 150,
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        res.json({ message: response.data.choices[0].text.trim() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเชื่อมต่อ OpenAI' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));