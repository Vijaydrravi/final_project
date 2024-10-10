const express = require('express');
const {
  getDashboardStats,
  getLearningPathPerformance,
  getCourseProgressDistribution,
  getCourseScores,
} = require('../controllers/adminDashboardController');

const router = express.Router();

router.get('/dashboard-stats', getDashboardStats);
router.get('/learning-path-performance', getLearningPathPerformance);
router.get('/course-progress-distribution', getCourseProgressDistribution);
router.get('/course-scores', getCourseScores);

module.exports = router;