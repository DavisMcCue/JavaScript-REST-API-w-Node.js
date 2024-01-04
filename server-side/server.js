const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');  // Import the 'path' module
//const fs = require('fs');  // Import the 'fs' module

const app = express();
const port = 3000;


// Set the path for serving static files (like HTML)
app.use(express.static(path.join(__dirname, 'HTML files')));

// Welcome message for the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'HTML files', 'index.html'));  // Adjust the path as needed
});

const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'newuser',
    password: process.env.DB_PASSWORD || 'temper_user34$#',
    database: process.env.DB_DATABASE || 'websitehost1',
    waitForConnections: true,
    connectionLimit: process.env.DB_CONNECTION_LIMIT || 10,
    queueLimit: 0,
    /*ssl: {
      ca: fs.readFileSync(process.env.DB_CA_PATH || '/path/to/ca-cert.pem'),
      key: fs.readFileSync(process.env.DB_KEY_PATH || '/path/to/client-key.pem'),
      cert: fs.readFileSync(process.env.DB_CERT_PATH || '/path/to/client-cert.pem')
    }*/
  });


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/HTML files/register.html');
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Implement your registration logic here
  pool.query('INSERT INTO userloginfo (username, password) VALUES (?, ?)', [username, password], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error registering user.');
    } else {
      res.redirect('/');
      //res.send('Registration successful!');
    }
  });
});

// ... (other routes)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});