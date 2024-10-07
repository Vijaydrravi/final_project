const express = require('express');
const router = express.Router();
const { getDashboardData } = require('../controllers/dashboardController'); // Require the controller

// Route to get user dashboard
router.get('/:userId', getDashboardData);

module.exports = router;
