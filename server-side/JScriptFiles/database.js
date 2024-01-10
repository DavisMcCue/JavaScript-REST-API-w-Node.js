// Database.js
const mysql = require('mysql2');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');

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

app.get('/login', (req, res) => {
  // Assuming you have a register.html file in the HTML_Files folder
  res.sendFile(path.join(__dirname, 'HTML_Files', 'login.html'));
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

// Registration route
app.post('/register', async (req, res) => {
  const { FirstName, LastName, email, username, password } = req.body;

  try {
    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the registration data into the 'userinfo' table
    const query = 'INSERT INTO userinfo (FirstName, LastName, Email, Username, Password) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [FirstName, LastName, email, username, hashedPassword], (queryErr) => {
      if (queryErr) {
        console.error('Error inserting data into MySQL:', queryErr);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      // Registration successful
      res.status(200).json({ message: 'Registration successful' });
    });
  } catch (hashError) {
    console.error('Error hashing password:', hashError);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if the user exists in the database
  const query = 'SELECT * FROM userinfo WHERE username = ?';
  connection.query(query, [username], (err, results) => {
    if (err) {
      console.error('Error querying MySQL:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.length === 0) {
      // User not found
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    // User found, compare hashed password
    const hashedPassword = results[0].password;
    bcrypt.compare(password, hashedPassword, (bcryptErr, match) => {
      if (bcryptErr) {
        console.error('Error comparing passwords:', bcryptErr);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      if (match) {
        // Passwords match, login successful
        res.status(200).json({ message: 'Login successful' });
        // Redirect to a different form or perform other actions here
      } else {
        // Passwords do not match
        res.status(401).json({ error: 'Invalid username or password' });
      }
    });
  });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// Export the pool for use in other modules
module.exports = connection;

