const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Initialize server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
