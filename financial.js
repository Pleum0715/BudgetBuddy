// ดอกเบี้ยทบต้น
document.getElementById('calculate-compound').addEventListener('click', () => {
    const initialAmount = parseFloat(document.getElementById('initial-amount').value);
    const monthlyAdd = parseFloat(document.getElementById('monthly-add').value);
    const years = parseFloat(document.getElementById('years').value);
    const returnRate = parseFloat(document.getElementById('return-rate').value) / 100;
    const compoundFreq = parseFloat(document.getElementById('compound-freq').value);
    const inflationRate = parseFloat(document.getElementById('inflation-rate').value) / 100;

    let total = initialAmount;
    const monthlyRate = returnRate / compoundFreq;
    const totalPeriods = years * compoundFreq;

    for (let i = 0; i < totalPeriods; i++) {
        total = total * (1 + monthlyRate) + monthlyAdd * compoundFreq;
    }

    const futureValue = total;
    const presentValue = futureValue / Math.pow(1 + inflationRate, years);

    document.getElementById('future-value').textContent = `${futureValue.toLocaleString()} บาท`;
    document.getElementById('present-value').textContent = `${presentValue.toLocaleString()} บาท`;
    document.getElementById('compound-results').style.display = 'block';

    const ctx = document.getElementById('compound-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: years + 1 }, (_, i) => `ปีที่ ${i}`),
            datasets: [{
                label: 'มูลค่าทรัพย์สิน',
                data: Array.from({ length: years + 1 }, (_, i) => {
                    let value = initialAmount;
                    for (let j = 0; j < i * compoundFreq; j++) {
                        value = value * (1 + monthlyRate) + monthlyAdd * compoundFreq;
                    }
                    return value;
                }),
                borderColor: '#0d6efd',
                fill: false
            }]
        },
        options: { scales: { y: { beginAtZero: true } } }
    });
});

// คำนวณภาษี (ตัวอย่างพื้นฐานตามอัตราภาษีไทย)
document.getElementById('calculate-tax').addEventListener('click', () => {
    const income = parseFloat(document.getElementById('income').value);
    let tax = 0;

    if (income <= 150000) tax = 0;
    else if (income <= 300000) tax = (income - 150000) * 0.05;
    else if (income <= 500000) tax = 7500 + (income - 300000) * 0.10;
    else if (income <= 750000) tax = 27500 + (income - 500000) * 0.15;
    else if (income <= 1000000) tax = 65000 + (income - 750000) * 0.20;
    else tax = 115000 + (income - 1000000) * 0.35;

    document.getElementById('tax-amount').textContent = `${tax.toLocaleString()} บาท`;
    document.getElementById('tax-results').style.display = 'block';
});

// คำนวณค่าไฟฟ้า (ตัวอย่างพื้นฐานตามอัตราประมาณการ)
document.getElementById('calculate-electricity').addEventListener('click', () => {
    const units = parseFloat(document.getElementById('units').value);
    const ratePerUnit = 4.5; // อัตราต่อหน่วย (บาท)
    const total = units * ratePerUnit;

    document.getElementById('electricity-cost').textContent = `${total.toLocaleString()} บาท`;
    document.getElementById('electricity-results').style.display = 'block';
});