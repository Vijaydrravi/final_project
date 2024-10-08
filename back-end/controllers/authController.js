const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const signup = async (req, res) => {
  const { email, password, designation, name } = req.body;

  try {
    // Check for existing user with the same email
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        designation,
        name,
      },
    });

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'User creation failed' });
  }
};

module.exports = { signup };
// Login handler
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        'your-jwt-secret',
        { expiresIn: '1h' }
      );
      req.session.userId = user.id; // Store user ID in session

      // Send token, role, and userId back in the response
      return res.json({ token, role: user.role, userId: user.id });
    }

    res.status(401).json({ error: 'Invalid email or password' });
  } catch (error) {
    console.error(error); // Log the error for debugging
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
  req.session.destroy((err) => {
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
  logout,
};
