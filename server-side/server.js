const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure your SQL Server connection
const config = {
  user: 'WebsiteAdmin',
  password: 'temp_password34$#',
  server: 'DP16959\\SQLEXPRESS',
  database: 'WebsiteHost1',
  options: {
    encrypt: true, // Use this if you're on Windows Azure
  },
  port: 1433, // Change this to the actual port used by your SQL Server instance
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' folder
//app.use(express.static('public'));

// Register route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('username', sql.NVarChar, username)
      .input('password', sql.NVarChar, password)
      .query('INSERT INTO users (username, password) VALUES (@username, @password)');

    console.log(result);
    res.status(201).send('User registered successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to serve the registration form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});