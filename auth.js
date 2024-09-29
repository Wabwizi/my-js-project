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

    // Check if the username or email already exists
    const checkUserQuery = 'SELECT * FROM users WHERE email = ? OR username = ?';
    db.query(checkUserQuery, [email, username], async (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).send('Internal Server Error');
        }

        if (results.length > 0) {
            return res.status(400).send('Username or email already taken.');
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
            return res.status(401).send('Invalid username or password.');
        }

        const user = results[0];

        // Compare the hashed password with the input password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).send('Invalid username or password.');
        }

        // Login successful, set session
        req.session.userId = user.id; // Store user ID in session
        res.redirect('/moodTracking.html'); // Redirect to mood tracking page
    });
});

// Render mood statistics page
router.get('/moodStatistics.html', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/auth/login'); // Ensure user is logged in
    }
    res.sendFile(path.join(__dirname, 'moodStatistics.html')); // Serve moodStatistics.html from the same directory
});

// Logout route to end the session
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error logging out:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.redirect('/auth/login'); // Redirect to the login page after logout
    });
});

// Fetch latest mood for the logged-in user
router.get('/api/latestMood', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send('User not authenticated.'); // Ensure user is logged in
    }

    const sql = 'SELECT mood, mood_note, timestamp FROM moods WHERE user_id = ? ORDER BY timestamp DESC LIMIT 1';
    db.query(sql, [req.session.userId], (err, results) => {
        if (err) {
            console.error('Error fetching latest mood:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length > 0) {
            res.json(results[0]); // Return the latest mood
        } else {
            res.json({ mood: 'none', mood_note: '', timestamp: '' }); // No mood recorded
        }
    });
});

// Fetch mood trend for the logged-in user
router.get('/api/moodTrend', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send('User not authenticated.'); // Ensure user is logged in
    }

    const sql = `
        SELECT mood, COUNT(*) as count 
        FROM moods 
        WHERE user_id = ? 
        GROUP BY mood 
        ORDER BY count DESC
    `;
    db.query(sql, [req.session.userId], (err, results) => {
        if (err) {
            console.error('Error fetching mood trend:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(results); // Return the mood trend data
    });
});

// Fetch all moods for the logged-in user
router.get('/api/moods', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send('User not authenticated.'); // Ensure user is logged in
    }

    const sql = 'SELECT * FROM moods WHERE user_id = ?'; // Adjust if you want to filter by user
    db.query(sql, [req.session.userId], (err, results) => {
        if (err) {
            console.error('Error fetching moods:', err);
            return res.status(500).send('Internal Server Error');
        }
        // Send the results as a JSON response
        res.json(results);
    });
});

// Export the router
module.exports = router;
