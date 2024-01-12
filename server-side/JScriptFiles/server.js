const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const database = require('./database'); // Import the database module

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define your routes
app.get('/', (req, res) => {
    // Assuming you have an index.html file in the HTML_Files folder
    res.sendFile(path.join(__dirname, 'HTML_files', 'index.html'));
  });

  // Serve CSS files from the CSS folder
  app.use('/CSS', express.static(path.join(__dirname, 'CSS')));

  // Serve static files from the "public" directory
  app.use(express.static('HTML_Files'));
  
  app.get('/register', (req, res) => {
    // Assuming you have a register.html file in the HTML_Files folder
    res.sendFile(path.join(__dirname, 'HTML_Files', 'register.html'));
  });
  
  app.get('/login', (req, res) => {
    // Assuming you have a register.html file in the HTML_Files folder
    res.sendFile(path.join(__dirname, 'HTML_Files', 'login.html'));
  });
  
  app.get('/mainPage', (req, res) => {
    res.sendFile(path.join(__dirname, 'HTML_Files', 'mainPage.html')); // or render a success page
  });

app.post('/register', async (req, res) => {
  const { FirstName, LastName, email, username, password } = req.body;

  try {
    const hashedPassword = await database.hashPassword(password);

    const query = 'INSERT INTO userinfo (FirstName, LastName, Email, Username, Password) VALUES (?, ?, ?, ?, ?)';
    database.connection.query(query, [FirstName, LastName, email, username, hashedPassword], (queryErr) => {
      if (queryErr) {
        console.error('Error inserting data into MySQL:', queryErr);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      // Send a JSON response for successful registration
      res.status(200).json({ message: 'Registration successful' });
    });
  } catch (hashError) {
    console.error('Error hashing password:', hashError);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const UserHashedPasswordEntry = bcrypt.hash(password, 10);
  
  const query = `SELECT * FROM userinfo WHERE username = ?`;

  database.connection.query(query, [username, UserHashedPasswordEntry], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      res.redirect('/mainPage');
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});