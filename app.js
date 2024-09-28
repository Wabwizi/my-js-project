const express = require('express');
const session = require('express-session');
const path = require('path');
const authRoutes = require('./auth');
require('dotenv').config(); // Load environment variables

const app = express();

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

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

// Authentication routes
app.use('/auth', authRoutes);

// Serve mood tracking page
app.get('/mood_tracking', (req, res) => {
    res.sendFile(path.join(__dirname, 'mood_tracking.html')); // Serve mood_tracking.html
});

// Start the server
const PORT = process.env.PORT || 3000; // This checks the PORT variable from .env
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`); // Confirm the port
});
