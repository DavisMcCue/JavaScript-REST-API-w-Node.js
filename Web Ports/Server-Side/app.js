const express = require('express');
const User = require('./models/User');
const session = require('express-session');
const passport = require('passport');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const apiRoutes = require('./routes/api');
const db = require('./database/db');

//const express = require('express');
const sql = require('mssql');
const app = express();
const port = 3000;

app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport');

// Include your API routes
app.use('/auth', authRoutes);
app.use('/protected', protectedRoutes);
app.use('/api', apiRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

/*
// Database configuration
const config = {
  user: 'WebsiteAdmin',
  password: 'temp_password34$#',
  server: 'DP16959\SQLEXPRESS', // You may need to specify the instance as well, like 'your_server_address\\instance_name'
  database: 'WebsiteHost1',
  options: {
    encrypt: true, // Use this option if you're on Windows Azure
  },
};

// Define a simple route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Node.js and SQL Server API!');
});

// Define a route with database interaction
app.get('/api/greeting', async (req, res) => {
  try {
    // Connect to the database
    await sql.connect(config);

    // Query the database
    const result = await sql.query`SELECT 'Hello, world!' AS greeting`;

    // Send the result as JSON
    res.json({ message: result.recordset[0].greeting });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    // Close the database connection
    await sql.close();
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
*/