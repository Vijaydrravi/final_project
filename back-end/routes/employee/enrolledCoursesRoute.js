const express = require('express');
const { getEnrolledCourses,updateEnrolledCourse } = require('../../controllers/employee/enrolledCoursesController');
const router = express.Router();

router.get('/:userId', getEnrolledCourses);
router.put('/update-progress/:courseId', updateEnrolledCourse);

module.exports = router;
