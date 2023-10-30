const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const fs = require('fs').promises; // Async version of fs
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Sign-up route
app.post('/signup', async (req, res) => {
    try {
        const { username, password, confirmPassword } = req.body;

        console.log("Received login request from:", username);

        // Validate request data
        if (!username || !password || !confirmPassword) {
            return res.status(400).json({ message: "Missing fields" });
        }

        // Check if password and confirmPassword are the same
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // Load existing users
        const rawData = await fs.readFile('./data/users.json', 'utf8'); // Async read
        const parsedData = JSON.parse(rawData);

        if (!parsedData.users) {
            return res.status(500).json({ message: "Server error" });
        }

        // Check if username already exists
        if (parsedData.users.find(user => user.username === username)) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Mmhm salty
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // Add new user
        parsedData.users.push({ username, password: hashedPassword });
        await fs.writeFile('./data/users.json', JSON.stringify(parsedData, null, 2)); // Async write

        res.status(201).json({ message: 'Signup successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});


// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const rawData = await fs.readFile('./data/users.json', 'utf8');
        const parsedData = JSON.parse(rawData);

        const user = parsedData.users.find(user => user.username === username);

        if (!user) {
            return res.status(400).json({ message: 'Username not found' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        // Redirect to generate.html upon successful login -- PLACEHOLDER
        res.status(200).json({ message: 'Login successful', redirect: 'generate.html' });

    } catch (error) {
        // Handle file read or parse errors
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Initialize server
const server = app.listen(3000, () => {
    const address = server.address();
    const host = address.address === '::' ? 'localhost' : address.address;
    const port = address.port;

    console.log(`Server running at http://${host}:${port}/`);
});