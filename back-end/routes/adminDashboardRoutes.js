const express = require('express');
const { getDashboardStats, getLearningPathPerformance } = require('../controllers/adminDashboardController');

const router = express.Router();

// Route to fetch dashboard statistics
router.get('/dashboard-stats', getDashboardStats);

// Route to fetch learning path performance data
router.get('/learning-path-performance', getLearningPathPerformance);

module.exports = router;
