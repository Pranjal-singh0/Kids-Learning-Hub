const express = require("express");
const fs = require("fs");
const { registerUser } = require("./Logging_In/register");
const { loginUser } = require("./Logging_In/login");
const mathRoutes = require("./Problems/mathModule");
const quizRoutes = require("./Problems/quizModule");

const app = express();
const PORT = 3000;

let loggedInUser = null;

app.use(express.static("Interface")); // Serving static files from Interface
app.use(express.urlencoded({ extended: true })); // Ensure form data is parsed properly

// Middleware to restrict access to protected routes
app.use((req, res, next) => {
    if ((req.path.startsWith("/math") || req.path.startsWith("/quiz") || req.path === "/home") && !loggedInUser) {
        return res.redirect("/");
    }
    next();
});

// Updated Home Route with Login/Register Page
app.get("/", (req, res) => {
    if (loggedInUser) {
        res.redirect("/home");
    } else {
        res.send(`<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Authentication</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; font-family: Arial, sans-serif; }
                body { display: flex; justify-content: center; align-items: center; height: 100vh; background: linear-gradient(to right, #6a11cb, #2575fc); }
                .container { background: #fff; padding: 30px; border-radius: 10px; text-align: center; width: 350px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2); }
                h2 { margin-bottom: 20px; color: #333; }
                button { width: 100%; padding: 12px; margin: 10px 0; border-radius: 5px; border: none; font-size: 16px; cursor: pointer; color: white; }
                .login-btn { background: #2575fc; }
                .register-btn { background: #28a745; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Do you have an account?</h2>
                <button class="login-btn" onclick="window.location.href='/login'">Login</button>
                <button class="register-btn" onclick="window.location.href='/register'">Register</button>
            </div>
        </body>
        </html>`);
    }
});

// Serve Home Page After Login
app.get("/home", (req, res) => {
    if (loggedInUser) {
        res.sendFile(__dirname + "/Interface/Home.html");
    } else {
        res.redirect("/");
    }
});

// Serve Register & Login Pages
app.get("/register", (req, res) => {
    res.sendFile(__dirname + "/Interface/register.html");
});

app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/Interface/login.html");
});

// Handle Registration & Login
app.post("/auth", (req, res) => {
    const { username, password, action } = req.body;

    if (!username || !password) {
        return res.send("Username and password are required.");
    }

    if (action === "register") {
        if (registerUser(username, password)) {
            loggedInUser = username;
            res.redirect("/home");
        } else {
            res.send("User already exists! Choose a different username.");
        }
    } else if (action === "login") {
        if (loginUser(username, password)) {
            loggedInUser = username;
            res.redirect("/home");
        } else {
            res.send("Invalid username or password!");
        }
    } else {
        res.send("Invalid action.");
    }
});

// Logout Route
app.get("/logout", (req, res) => {
    loggedInUser = null;
    res.redirect("/");
});

// Use Math and Quiz Routes
app.use("/math", mathRoutes);
app.use("/quiz", quizRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
