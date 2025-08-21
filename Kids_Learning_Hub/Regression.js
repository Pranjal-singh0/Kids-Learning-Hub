const express = require('express');
const math = require('mathjs');
const { createCanvas } = require('canvas');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));

function polynomialRegression(data, degree) {
    let X = [];
    let Y = [];
    
    for (let i = 0; i < data.length; i++) {
        let row = [];
        for (let j = 0; j <= degree; j++) {
            row.push(Math.pow(data[i].x, j));
        }
        X.push(row);
        Y.push([data[i].y]);
    }
    
    let X_matrix = math.matrix(X);
    let Y_matrix = math.matrix(Y);
    
    let XT = math.transpose(X_matrix);
    let XTX = math.multiply(XT, X_matrix);
    let XTX_inv = math.inv(XTX);
    let XTY = math.multiply(XT, Y_matrix);
    let B = math.multiply(XTX_inv, XTY);
    
    return B.valueOf();
}

function generateGraph(data, coefficients) {
    const canvas = createCanvas(400, 400);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 400, 400);
    
    // Draw Axes
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(50, 350);
    ctx.lineTo(350, 350);
    ctx.moveTo(50, 50);
    ctx.lineTo(50, 350);
    ctx.stroke();
    
    // Draw Data Points
    ctx.fillStyle = 'red';
    data.forEach(point => {
        let x = 50 + (point.x * 30);
        let y = 350 - (point.y * 30);
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
    });
    
    ctx.strokeStyle = 'blue';
    ctx.beginPath();
    for (let x = 0; x <= 10; x += 0.1) {
        let y = 0;
        for (let i = 0; i < coefficients.length; i++) {
            y += coefficients[i][0] * Math.pow(x, i);
        }
        let canvasX = 50 + (x * 30);
        let canvasY = 350 - (y * 30);
        if (x === 0) ctx.moveTo(canvasX, canvasY);
        else ctx.lineTo(canvasX, canvasY);
    }
    ctx.stroke();
    
    return canvas.toBuffer('image/png');
}

app.get('/polyregression', (req, res) => {
    res.send(`
        <form action="/polyregression" method="post">
            <textarea name="data" placeholder="Enter x,y pairs (one per line)" required></textarea><br>
            <input type="number" name="degree" placeholder="Degree of polynomial" required><br>
            <button type="submit">Calculate Regression</button>
        </form>
    `);
});

// Handle Polynomial Regression Calculation
app.post('/polyregression', (req, res) => {
    const rawData = req.body.data.trim().split('\n');
    const degree = parseInt(req.body.degree);
    let data = [];
    
    for (let line of rawData) {
        let [x, y] = line.split(',').map(Number);
        if (isNaN(x) || isNaN(y)) {
            return res.send('Invalid input format. Please enter x,y pairs.');
        }
        data.push({ x, y });
    }
    
    const coefficients = polynomialRegression(data, degree);
    const imageBuffer = generateGraph(data, coefficients);
    
    res.setHeader('Content-Type', 'image/png');
    res.send(imageBuffer);
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
