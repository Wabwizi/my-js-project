require('dotenv/config');
const mysql = require('mysql2');
const cors = require('cors');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');

const port = 5500;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.use(session({
    secret: process.env.SESSION_SECRET, // Use a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // Set to true if using HTTPS
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

db.connect((err) => {
    if (err) {
        return console.error('Error connecting to database:', err);
    }
    console.log('Connected to database successfully.');

    // Create the database if it doesn't exist
    db.query('CREATE DATABASE IF NOT EXISTS mental_health_app;', (err) => {
        if (err) {
            return console.error('Error creating database:', err);
        }
        console.log('Database created successfully.');

        // Change to the new database
        db.changeUser({ database: 'mental_health_app' }, (err) => {
            if (err) {
                return console.error('Error changing to database:', err);
            }
            console.log('Changed to database successfully.');

            // Define the users table creation query
            const createUsersTable = `
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(50) NOT NULL UNIQUE,
                    email VARCHAR(100) NOT NULL UNIQUE,
                    password VARCHAR(255) NOT NULL
                );
            `;

            // Create the users table
            db.query(createUsersTable, (err) => {
                if (err) {
                    return console.error('Error creating users table:', err);
                }
                console.log('Users table created successfully.');

                // Define the mood entries table creation query
                const createMoodEntriesTable = `
                    CREATE TABLE IF NOT EXISTS mood_entries (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        user_id INT NOT NULL,
                        mood VARCHAR(50) NOT NULL,
                        mood_note TEXT,
                        entry_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                    );
                `;

                // Create the mood entries table
                db.query(createMoodEntriesTable, (err) => {
                    if (err) {
                        return console.error('Error creating mood entries table:', err);
                    }
                    console.log('Mood entries table created successfully.');
                });
            });
        });
    });
});

// Authentication middleware
const authenticate = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    req.userId = req.session.user.id;
    next();
};

// Register route
app.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // Basic validation
        if (!email || !username || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Check if the email already exists
        const emailQuery = 'SELECT * FROM users WHERE email = ?';
        const [existingEmail] = await db.promise().query(emailQuery, [email]);

        if (existingEmail.length > 0) {
            return res.status(409).json({ message: 'Email is already in use.' });
        }

        // Check if the username already exists
        const usernameQuery = 'SELECT * FROM users WHERE username = ?';
        const [existingUsername] = await db.promise().query(usernameQuery, [username]);

        if (existingUsername.length > 0) {
            return res.status(409).json({ message: 'Username is already in use.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const insertUserQuery = 'INSERT INTO users (email, username, password) VALUES (?, ?, ?)';
        await db.promise().query(insertUserQuery, [email, username, hashedPassword]);

        // Respond with success
        return res.status(201).json({ message: 'User created successfully.' });

    } catch (err) {
        console.error('Error during user registration:', err);
        return res.status(500).json({ message: 'Internal server error.', error: err.message });
    }
});

// Login route
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Query the database for the user by username
        const query = 'SELECT * FROM users WHERE username = ?';
        db.query(query, [username], async (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database query error' });
            }

            // Check if user exists
            if (result.length === 0) {
                return res.status(401).json({ message: 'Invalid credentials.' });
            }

            const user = result[0];

            // Compare provided password with stored hash
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(401).json({ message: 'Invalid credentials.' });
            }

            // If credentials are correct, respond with a success message
            req.session.user = { id: user.id, username: user.username };
            return res.status(200).json({ message: 'Login successful' });
        });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Mood tracking route
app.post('/track_mood', authenticate, async (req, res) => {
    try {
        const { mood, mood_note } = req.body;
        const userId = req.userId;

        // Basic validation
        if (!mood) {
            return res.status(400).json({ message: 'Mood is required.' });
        }

        // Insert the mood entry into the database
        const insertMoodQuery = 'INSERT INTO mood_entries (user_id, mood, mood_note) VALUES (?, ?, ?)';
        await db.promise().query(insertMoodQuery, [userId, mood, mood_note || null]);

        return res.status(201).json({ message: 'Mood tracked successfully.' });

    } catch (err) {
        console.error('Error tracking mood:', err);
        return res.status(500).json({ message: 'Internal server error.', error: err.message });
    }
});

// Get mood statistics
app.get('/mood_statistics', authenticate, async (req, res) => {
    try {
        const userId = req.userId;

        const moodStatsQuery = `
            SELECT mood, COUNT(*) as count FROM mood_entries
            WHERE user_id = ?
            GROUP BY mood
            ORDER BY count DESC
        `;
        const [moodStats] = await db.promise().query(moodStatsQuery, [userId]);

        return res.status(200).json(moodStats);

    } catch (err) {
        console.error('Error fetching mood statistics:', err);
        return res.status(500).json({ message: 'Internal server error.', error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});
