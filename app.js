const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const bcrypt = require('bcryptjs');
const fs = require('fs');


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Sign-up route
app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Load existing users
    const rawData = fs.readFileSync('users.json');
    const parsedData = JSON.parse(rawData);

    // Check if username already exists
    if (parsedData.users.find(user => user.username === username)) {
        return res.status(400).send('Username already exists');
    }

    // Add new user
    parsedData.users.push({ username, password: hashedPassword });
    fs.writeFileSync('users.json', JSON.stringify(parsedData));

    res.status(200).send('Signup successful');

});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const rawData = fs.readFileSync('./data/users.json');
    const parsedData = JSON.parse(rawData);

    const user = parsedData.users.find(user => user.username === username);

    if (!user) {
        return res.status(400).send('Username not found');
    }

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);

    if (!isPasswordCorrect) {
        return res.status(400).send('Incorrect password');
    }

    // Redirect to generate.html upon successful login -- PLACEHOLDER
    return res.redirect('generate.html');
});

// Initialize server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
