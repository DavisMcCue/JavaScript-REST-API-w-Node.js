const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const ejs = require('ejs');
const dotenv = require('dotenv');
const database = require('./database'); // Import the database module

const app = express();
const port = 3000;

// Load environment variables from a .env file
dotenv.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set up sessions with a secret from the environment variable
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret', // Use an environment variable or a fallback
  resave: false,
  saveUninitialized: true
}));

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

  // Assuming the structure: ID, FirstName, LastName, Username, Password
  const query = 'SELECT ID, FirstName, LastName, Username, Password FROM userinfo WHERE Username = ?';

  database.connection.query(query, [username], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }

    console.log('Database Results:', results); // Log the results for debugging

    if (results.length > 0) {
      const hashedPasswordFromDB = results[0].Password;

      if (hashedPasswordFromDB) {
        bcrypt.compare(password, hashedPasswordFromDB, (compareErr, isMatch) => {
          if (compareErr) {
            console.error('Error comparing passwords:', compareErr);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
          }

          console.log('Password Comparison Result:', isMatch); // Log the comparison result for debugging

          if (isMatch) {
            // Store user information in the session
            req.session.userId = results[0].ID;
            req.session.username = results[0].Username;

            // Render mainPage.ejs and pass the username as a variable
            res.render('mainPage', { username: results[0].Username });
          } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
          }
        });
      } else {
        res.status(500).json({ success: false, message: 'Hashed password not found in database' });
      }
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  });
});

// Add this route in your server.js
app.post('/logout', (req, res) => {
  // Clear the session
  req.session.destroy(err => {
      if (err) {
          console.error('Error destroying session:', err);
          return res.status(500).json({ success: false, message: 'Internal Server Error' });
      }

      // Redirect to the login page
      res.redirect('/login'); // Update the path to your login page
  });
});

app.get('/mainPage', (req, res) => {
  // Check if the user is authenticated before serving the main page
  if (req.session.userId && req.session.username) {
    res.sendFile(__dirname + 'HTML_Files', 'mainPage.html');
  } else {
    res.redirect('/login'); // Redirect to login if not authenticated
  }
});

app.get('/getUserInfo', (req, res) => {
  if (req.session.userId && req.session.username) {
    res.json({ success: true, username: req.session.username });
  } else {
    res.status(401).json({ success: false });
  }
});

app.post('/logout', (req, res) => {
  // Clear the session
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json({ success: true });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});