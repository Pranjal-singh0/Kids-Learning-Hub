const express = require("express");
const querystring = require("querystring");
const { registerUser } = require("./register");
const { loginUser } = require("./login");

const app = express();
const PORT = 3000;

// Home route - Ask the user if they have an account
app.get("/", (req, res) => {
    res.send(`
        <!DOCTYPE html>
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
                .login-btn:hover { background: #1a5ac7; }
                .register-btn { background: #28a745; }
                .register-btn:hover { background: #218838; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Do you have an account?</h2>
                <button class="login-btn" onclick="window.location.href='/login'">Login</button>
                <button class="register-btn" onclick="window.location.href='/register'">Register</button>
            </div>
        </body>
        </html>
    `);
});

// Registration form route
app.get("/register", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Register</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; font-family: Arial, sans-serif; }
                body { display: flex; justify-content: center; align-items: center; height: 100vh; background: #28a745; }
                .container { background: #fff; padding: 30px; border-radius: 10px; text-align: center; width: 350px; }
                h2 { margin-bottom: 20px; color: #333; }
                input { width: 100%; padding: 12px; margin: 10px 0; border-radius: 5px; border: 1px solid #ccc; font-size: 16px; }
                button { width: 100%; padding: 12px; border-radius: 5px; border: none; font-size: 16px; cursor: pointer; background: #218838; color: white; }
                button:hover { background: #1a5ac7; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Register</h2>
                <form action="/auth" method="post">
                    <input type="text" name="username" placeholder="Enter Username" required>
                    <input type="password" name="password" placeholder="Enter Password" required>
                    <input type="hidden" name="action" value="register">
                    <button type="submit">Register</button>
                </form>
                <p><a href="/">Go back</a></p>
            </div>
        </body>
        </html>
    `);
});

// Login form route
app.get("/login", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Login</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; font-family: Arial, sans-serif; }
                body { display: flex; justify-content: center; align-items: center; height: 100vh; background: #2575fc; }
                .container { background: #fff; padding: 30px; border-radius: 10px; text-align: center; width: 350px; }
                h2 { margin-bottom: 20px; color: #333; }
                input { width: 100%; padding: 12px; margin: 10px 0; border-radius: 5px; border: 1px solid #ccc; font-size: 16px; }
                button { width: 100%; padding: 12px; border-radius: 5px; border: none; font-size: 16px; cursor: pointer; background: #1a5ac7; color: white; }
                button:hover { background: #0e4eac; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Login</h2>
                <form action="/auth" method="post">
                    <input type="text" name="username" placeholder="Enter Username" required>
                    <input type="password" name="password" placeholder="Enter Password" required>
                    <input type="hidden" name="action" value="login">
                    <button type="submit">Login</button>
                </form>
                <p><a href="/">Go back</a></p>
            </div>
        </body>
        </html>
    `);
});

// Handle authentication (login or register)
app.post("/auth", (req, res) => {
    let body = "";

    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on("end", () => {
        const formData = querystring.parse(body);
        const { username, password, action } = formData;

        if (!username || !password) {
            return res.send("Username and password are required.");
        }

        if (action === "register") {
            return registerUser(username, password, res);
        } else if (action === "login") {
            return loginUser(username, password, res);
        } else {
            return res.send("Invalid action.");
        }
    });
});


// Start the Express server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
