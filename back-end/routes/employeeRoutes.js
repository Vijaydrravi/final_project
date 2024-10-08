const express = require('express');
const { getAllEmployees, getUserProfile } = require('../controllers/employeeController'); // Adjust path accordingly

const router = express.Router();

// Route to get all employees
router.get('/', getAllEmployees);

// Route to get a specific employee's profile by ID
router.get('/:id', getUserProfile);

module.exports = router;
