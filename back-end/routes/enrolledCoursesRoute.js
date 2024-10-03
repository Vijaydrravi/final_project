const express = require('express');
const { getEnrolledCourses,updateEnrolledCourse } = require('../controllers/enrolledCoursesController');
const router = express.Router();

router.get('/:userId', getEnrolledCourses);
router.put('/update-progress/:courseId', updateEnrolledCourse);

module.exports = router;
