const express = require("express");
const fs = require("fs");
const router = express.Router();

const quizFile = "./Problems/quizQuestions.txt";

function getQuizQuestions() {
    if (!fs.existsSync(quizFile)) {
        return ["No questions available."];
    }
    return fs.readFileSync(quizFile, "utf8").trim().split("\n");
}

router.get("/", (req, res) => {
    const questions = getQuizQuestions();
    if (questions.length === 0) return res.send("No quiz questions available.");

    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    const [question, option1, option2, option3, option4, correctAnswer] = randomQuestion.split("|");

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Quiz</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
            <style>
                body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; background-color: #f4f4f4; }
                .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2); display: inline-block; }
                button { margin-top: 10px; padding: 10px 20px; font-size: 16px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1 class="text-primary">Quiz Time</h1>
                <h2>${question}</h2>
                <form action="/quiz/check" method="POST">
                    <input type="hidden" name="correctAnswer" value="${correctAnswer}">
                    <div class="form-check">
                        <input type="radio" class="form-check-input" name="userAnswer" value="${option1}" required> ${option1}<br>
                    </div>
                    <div class="form-check">
                        <input type="radio" class="form-check-input" name="userAnswer" value="${option2}"> ${option2}<br>
                    </div>
                    <div class="form-check">
                        <input type="radio" class="form-check-input" name="userAnswer" value="${option3}"> ${option3}<br>
                    </div>
                    <div class="form-check">
                        <input type="radio" class="form-check-input" name="userAnswer" value="${option4}"> ${option4}<br><br>
                    </div>
                    <button type="submit" class="btn btn-success">Submit</button>
                </form>
                <br>
                <a href="/home"><button class="btn btn-primary">Home</button></a>
            </div>
        </body>
        </html>
    `);
});

// Route to check the answer
router.post("/check", express.urlencoded({ extended: true }), (req, res) => {
    const { userAnswer, correctAnswer } = req.body;
    const isCorrect = userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Quiz Result</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
            <style>
                body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; background-color: #f4f4f4; }
                .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2); display: inline-block; }
                button { margin-top: 10px; padding: 10px 20px; font-size: 16px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1 class="text-${isCorrect ? "success" : "danger"}">${isCorrect ? "Correct! 🎉" : `Incorrect ❌ The correct answer was: ${correctAnswer}`}</h1>
                <a href="/quiz"><button class="btn btn-info">Next Question</button></a>
                <a href="/home"><button class="btn btn-primary">Home</button></a>
            </div>
        </body>
        </html>
    `);
});

module.exports = router;
