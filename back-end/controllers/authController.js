const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Signup handler
const signup = async (req, res) => {
  const { email, password, designation, name } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        designation,
        name
      }
    });
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'User creation failed' });
  }
};

// Login handler
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ userId: user.id }, 'your-jwt-secret', { expiresIn: '1h' });
      req.session.userId = user.id; // Store user ID in session
      return res.json({ token });
    }

    res.status(401).json({ error: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

// Protected route example
const dashboard = (req, res) => {
  if (req.session.userId) {
    return res.json({ message: 'Welcome to the dashboard!' });
  }
  res.status(403).json({ error: 'Unauthorized access' });
};

// Logout handler
const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Failed to log out' });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
};

module.exports = {
  signup,
  login,
  dashboard,
  logout
};
