const express = require('express');
const CourseController = require('../controllers/CourseController')
const router = express.Router()


router.get('/',CourseController.getAllCourses) 
router.get('/:course',CourseController.getCourse) 
router.post('/',CourseController.createCourse)
module.exports = router