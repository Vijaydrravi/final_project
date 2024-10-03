// controllers/userController.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

// Handle user signup
const signup = async (req, res) => {
  const { email, password, designation, name } = req.body;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      designation,
      name,
    },
  });

  res.status(201).json({ message: 'User created successfully', user });
};

// Handle user login
const login = async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  // Check password
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  // Return success response (you can also issue a JWT token here)
  res.status(200).json({ message: 'Login successful', user });
};

// Export the controller functions
module.exports = {
  signup,
  login,
};


