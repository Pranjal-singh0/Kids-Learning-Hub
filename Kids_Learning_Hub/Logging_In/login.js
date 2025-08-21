const fs = require("fs");

function loginUser(username, password) {
    if (!fs.existsSync("users.txt")) {
        return false;
    }

    const users = fs.readFileSync("users.txt", "utf8").split("\n").filter(Boolean);

    for (let user of users) {
        const [storedUsername, storedPassword] = user.split("|");
        if (storedUsername === username && storedPassword === password) {
            return true;
        }
    }

    return false;
}

module.exports = { loginUser };
