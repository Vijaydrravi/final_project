const express = require('express');
const { getCoursesByLearningPath, getEmployees, assignCourse,getAvailableCourses } = require('../controllers/assignCourseController');
const router = express.Router();

// Get courses by learning path ID
router.get('/courses/:learningPathId', getCoursesByLearningPath);

// Get all employees with role 'employee'
router.get('/employees', getEmployees);

// Assign course to employee
router.post('/assign', assignCourse);

router.get('/courses/available/:userId', getAvailableCourses);

module.exports = router;
