const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

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

module.exports = {
  connection,
  hashPassword: async (password) => await bcrypt.hash(password, 10),
};
