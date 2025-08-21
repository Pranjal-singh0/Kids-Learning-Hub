const fs = require("fs");

function registerUser(username, password) {
    if (!fs.existsSync("users.txt")) {
        fs.writeFileSync("users.txt", "");
    }

    const users = fs.readFileSync("users.txt", "utf8").split("\n").filter(Boolean);
    
    for (let user of users) {
        const [existingUsername] = user.split("|");
        if (existingUsername === username) {
            return false; 
        }
    }

    fs.appendFileSync("users.txt", `${username}|${password}\n`);
    return true; 
}

module.exports = { registerUser };
