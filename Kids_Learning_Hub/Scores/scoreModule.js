const fs = require("fs");
const path = require("path");

const scoresDir = path.join(__dirname, "../Scores");

// Ensure the Scores directory exists
if (!fs.existsSync(scoresDir)) {
    fs.mkdirSync(scoresDir);
}

// Function to get the user's current score
function getUserScore(username) {
    const scoreFile = path.join(scoresDir, `${username}.txt`);
    
    if (!fs.existsSync(scoreFile)) {
        return 0;
    }

    return parseInt(fs.readFileSync(scoreFile, "utf8")) || 0;
}

// Function to update the user's score
function updateUserScore(username, points) {
    const scoreFile = path.join(scoresDir, `${username}.txt`);
    const currentScore = getUserScore(username);
    const newScore = currentScore + points;

    fs.writeFileSync(scoreFile, newScore.toString());
}

// Export the functions
module.exports = { getUserScore, updateUserScore };
