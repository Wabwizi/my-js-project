// db.js
const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '16317admission',
    database: process.env.DB_NAME || 'mental_health_app'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to the MySQL database.');
});

module.exports = connection;
