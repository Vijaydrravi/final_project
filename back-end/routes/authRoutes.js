const express = require('express');
const { signup, login, dashboard, logout } = require('../controllers/authController');

const router = express.Router();

// Signup route
router.post('/signup', signup);

// Login route
router.post('/login', login);

// Protected route example
router.get('/dashboard', dashboard);

// Logout route
router.post('/logout', logout);

module.exports = router;
