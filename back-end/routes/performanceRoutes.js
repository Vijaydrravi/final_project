const express = require('express');
const { getLearningPaths,getPerformanceData } = require('../controllers/PerformanceController');
const router = express.Router();

// Route to fetch performance data for a user

// Route to fetch learning paths for a user
router.get('/:userId/:learningPathId', getPerformanceData);
router.get('/learning-paths', getLearningPaths);

// Route to fetch performance data based on learning path

module.exports = router;
