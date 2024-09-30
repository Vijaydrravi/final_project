const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Helper function to create a JWT token
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Sign up route
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  // Check if the user already exists
  const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

  if (userExists.rows.length > 0) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert the new user into the database
  const newUser = await pool.query(
    'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id',
    [email, hashedPassword]
  );

  // Generate a JWT token
  const token = generateAccessToken(newUser.rows[0].id);
  res.status(201).json({ token });
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists
  const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

  if (user.rows.length === 0) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  // Validate the password
  const validPassword = await bcrypt.compare(password, user.rows[0].password);

  if (!validPassword) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  // Generate a JWT token
  const token = generateAccessToken(user.rows[0].id);
  res.json({ token });
});

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization').split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Example protected route
app.get('/dashboard', authenticateToken, (req, res) => {
  res.send('This is a protected route');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
