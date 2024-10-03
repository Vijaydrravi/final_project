// routes/courses.js
const express = require('express');
const router = express.Router();
const coursesController = require('../controllers/coursesController');

router.get('/', coursesController.getCourses);
router.post('/', coursesController.addCourse);
router.put('/courses/:id', coursesController.updateCourse);

module.exports = router;
