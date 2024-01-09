// Database.js
const mysql = require('mysql2');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors());

// Serve the favicon.ico file
//app.use(favicon(path.join(__dirname, 'Falco', 'favicon.ico')));

// Assuming database.js is in the "Jscriptfiles" folder
const indexPath = path.join(__dirname, 'HTML_files', 'index.html');

// Serve CSS files from the CSS folder
app.use('/CSS', express.static(path.join(__dirname, 'CSS')));

// Serve static files from the 'JScriptFiles' folder
app.use('/JScriptFiles', express.static('JScriptFiles'));


// Define your routes
app.get('/', (req, res) => {
  // Assuming you have an index.html file in the HTML_Files folder
  res.sendFile(path.join(__dirname, 'HTML_files', 'index.html'));
});

app.get('/register', (req, res) => {
  // Assuming you have a register.html file in the HTML_Files folder
  res.sendFile(path.join(__dirname, 'HTML_Files', 'register.html'));
});


// MySQL database connection details
// Create a connection pool
const connection = mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'newuser',
  password: process.env.DB_PASSWORD || 'temper_user34$#',
  database: process.env.DB_DATABASE || 'websitehost1',
  waitForConnections: true,
  connectionLimit: process.env.DB_CONNECTION_LIMIT || 10,
  queueLimit: 0,
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

app.post('/register', (req, res) => {
    const { FirstName, LastName, email, username, password } = req.body;

    // Insert the registration data into the 'userinfo' table
    const query = 'INSERT INTO userinfo (FirstName, LastName, email, username, password) VALUES (?, ?, ?, ?, ?)';
    
    connection.query(query, [FirstName, LastName, email, username, password], (queryErr) => {
        if (queryErr) {
            console.error('Error inserting data into MySQL:', queryErr);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        // Registration successful
        res.status(200).json({ message: 'Registration successful' });
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// Export the pool for use in other modules
module.exports = connection;

