const express = require("express");
const fs = require("fs");
const router = express.Router();

const problemsFile = "./Problems/mathProblems.txt";

function generateProblems() {
    const operators = ["+", "-", "*", "/"];
    let problems = [];

    for (let i = 0; i < 10; i++)
    {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        const operator = operators[Math.floor(Math.random() * operators.length)];
        let answer;

        switch (operator) {
            case "+": answer = num1 + num2; break;
            case "-": answer = num1 - num2; break;
            case "*": answer = num1 * num2; break;
            case "/": answer = (num1 / num2); break; 
        }

        problems.push(`${num1} ${operator} ${num2} = ${answer}`);
    }

    fs.writeFileSync(problemsFile, problems.join("\n"));
}

if (!fs.existsSync(problemsFile)) {
    generateProblems();
}

router.get("/", (req, res) => {
    fs.readFile(problemsFile, "utf8", (err, data) => {
        if (err) return res.send("Error reading problems file.");
        
        const problems = data.trim().split("\n");
        const randomProblem = problems[Math.floor(Math.random() * problems.length)];
        const [num1, operator, num2, , answer] = randomProblem.split(" ");

        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Math Problems</title>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; background-color: #f4f4f4; }
                    .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2); display: inline-block; }
                    button { margin-top: 10px; padding: 10px 20px; font-size: 16px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1 class="text-primary">Math Problems</h1>
                    <h2>${num1} ${operator} ${num2} = ?</h2>
                    <form action="/math/check" method="POST">
                        <input type="hidden" name="num1" value="${num1}">
                        <input type="hidden" name="operator" value="${operator}">
                        <input type="hidden" name="num2" value="${num2}">
                        <input type="number" step="any" name="userAnswer" required>
                        <button type="submit" class="btn btn-success">Submit</button>
                    </form>
                    <br>
                    <a href="/home"><button class="btn btn-primary">Home</button></a>
                </div>
            </body>
            </html>
        `);
    });
});

// Route to verify the answer
router.post("/check", express.urlencoded({ extended: true }), (req, res) => {
    const { num1, operator, num2, userAnswer } = req.body;
    let correctAnswer;

    switch (operator) {
        case "+": correctAnswer = parseFloat(num1) + parseFloat(num2); break;
        case "-": correctAnswer = parseFloat(num1) - parseFloat(num2); break;
        case "*": correctAnswer = parseFloat(num1) * parseFloat(num2); break;
        case "/": correctAnswer = parseFloat(num1) / parseFloat(num2); break;
        default: return res.send("Invalid operation.");
    }

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Math Problems</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
            <style>
                body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; background-color: #f4f4f4; }
                .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2); display: inline-block; }
                button { margin-top: 10px; padding: 10px 20px; font-size: 16px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1 class="text-${parseFloat(userAnswer) === parseFloat(correctAnswer) ? "success" : "danger"}">
                    ${parseFloat(userAnswer) === parseFloat(correctAnswer) ? "Correct! 🎉" : `Incorrect ❌ The correct answer was: ${correctAnswer}`}
                </h1>
                <a href="/math"><button class="btn btn-info">Next Problem</button></a>
                <a href="/home"><button class="btn btn-primary">Home</button></a>
            </div>
        </body>
        </html>
    `);
});

module.exports = router;
