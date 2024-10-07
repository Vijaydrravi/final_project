// routes/learningPathRoutes.js

const express = require('express');
const { getLearningPathsWithPerformance } = require('../controllers/learningPathPerformanceController');

const router = express.Router();

// Route to get learning paths with performance summary average rating
router.get('/learning-paths/:userId', getLearningPathsWithPerformance);

module.exports = router;
