const express = require('express');
const session = require('express-session');
const path = require('path');
const authRoutes = require('./auth');
const db = require('./db'); // Import db to interact with the database
require('dotenv').config(); // Load environment variables

const app = express();

// Middleware to parse form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Ensure you can handle JSON request bodies

// Setup session management
app.use(session({
    secret: process.env.SESSION_SECRET || 'wabwizi', // Use environment variable for session secret
    resave: false,
    saveUninitialized: true,
}));

// Serve static files (CSS, JS, HTML)
app.use(express.static(path.join(__dirname))); // Serve from the root directory

// Define a route for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Serve index.html
});

// Authentication routes (register, login)
app.use('/auth', authRoutes);

// Middleware to check if the user is authenticated for mood tracking routes
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next(); // User is authenticated, proceed
    }
    res.redirect('/auth/login'); // Redirect to login if not authenticated
};

// Serve mood tracking page with authentication check
app.get('/moodTracking.html', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'moodTracking.html')); // Serve moodTracking.html
});

// Serve mood statistics page with authentication check
app.get('/moodStatistics.html', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'moodStatistics.html')); // Serve moodStatistics.html
});

// Endpoint to handle mood tracking form submission (POST request)
app.post('/moodTracking', isAuthenticated, (req, res) => {
    const { mood, mood_note } = req.body;

    // Validate the mood field
    if (!mood) {
        return res.status(400).json({ error: 'Mood is required' });
    }

    // Insert the mood data into the database
    const sql = 'INSERT INTO moods (user_id, mood, mood_note) VALUES (?, ?, ?)';
    db.query(sql, [req.session.userId, mood, mood_note || null], (err, result) => {
        if (err) {
            console.error('Error saving mood entry:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Send a success response back to the client
        res.json({ message: 'Mood recorded successfully' });
    });
});

// Endpoint to fetch all moods for the user (GET request)
app.get('/api/moods', isAuthenticated, (req, res) => {
    const sql = 'SELECT mood FROM moods WHERE user_id = ?';
    db.query(sql, [req.session.userId], (err, results) => {
        if (err) {
            console.error('Error fetching moods:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(results); // Return the array of moods
    });
});

// Endpoint to fetch the latest mood for the user (GET request)
app.get('/api/latestMood', isAuthenticated, (req, res) => {
    const sql = 'SELECT mood, mood_note, timestamp FROM moods WHERE user_id = ? ORDER BY timestamp DESC LIMIT 1';
    db.query(sql, [req.session.userId], (err, results) => {
        if (err) {
            console.error('Error fetching latest mood:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (results.length > 0) {
            res.json(results[0]); // Return the latest mood
        } else {
            res.json({ mood: 'none', mood_note: '', timestamp: '' }); // No mood recorded
        }
    });
});

// Endpoint to fetch mood trends for the user (GET request)
app.get('/api/moodTrend', isAuthenticated, (req, res) => {
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
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(results); // Return the mood trend data
    });
});

// Endpoint to analyze trends for the user (GET request)
app.get('/api/trendAnalysis', isAuthenticated, (req, res) => {
    const sql = `
        SELECT 
            SUM(mood = 'stressed') > 3 as highStress,
            SUM(mood = 'sad') > 2 as recurrentSadness,
            COUNT(DISTINCT mood) > 2 as positiveTrend
        FROM moods 
        WHERE user_id = ?
    `;
    db.query(sql, [req.session.userId], (err, results) => {
        if (err) {
            console.error('Error fetching trend analysis:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        const analysis = results[0];
        res.json({
            highStress: analysis.highStress,
            recurrentSadness: analysis.recurrentSadness,
            positiveTrend: analysis.positiveTrend,
        }); // Return the trend analysis data
    });
});

// Start the server
const PORT = process.env.PORT || 3000; // This checks the PORT variable from .env
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`); // Confirm the port
});
