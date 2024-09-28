const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // Include bcrypt for password hashing
const db = require('./db'); // Import the database connection
const path = require('path');

// Middleware to parse URL-encoded data
router.use(express.urlencoded({ extended: true }));

// Render registration form
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html')); // Serve register.html from the same directory
});

// Handle registration form submission
router.post('/register', async (req, res) => {
    const { email, username, password, 'confirm-password': confirmPassword } = req.body;

    // Basic input validation
    if (!email || !username || !password || !confirmPassword) {
        return res.status(400).send('Email, username, password, and confirm password are required.');
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match.');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to the database
    const sql = 'INSERT INTO users (email, username, password) VALUES (?, ?, ?)';
    db.query(sql, [email, username, hashedPassword], (err, result) => {
        if (err) {
            console.error('Error saving user:', err);
            return res.status(500).send('Internal Server Error');
        }
        // Redirect to the login page after successful registration
        res.redirect('/auth/login');
    });
});

// Render login form
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html')); // Serve login.html from the same directory
});

// Handle login form submission
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Basic input validation
    if (!username || !password) {
        return res.status(400).send('Username and password are required.');
    }

    // Query to find the user by username
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], async (err, results) => {
        if (err) {
            console.error('Error querying user:', err);
            return res.status(500).send('Internal Server Error');
        }

        if (results.length === 0) {
            return res.status(401).send('Invalid username or password');
        }

        const user = results[0];

        // Compare the hashed password with the input password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).send('Invalid username or password');
        }

        // Login successful, set session
        req.session.userId = user.id; // Store user ID in session
        res.redirect('/mood_tracking.html'); // Redirect to mood tracking page
    });
});

// Export the router
module.exports = router;
