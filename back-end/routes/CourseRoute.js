// routes/courses.js
const express = require('express');
const router = express.Router();
const coursesController = require('../controllers/coursesController');

router.get('/', coursesController.getCourses);
router.post('/:id', coursesController.editCourse);

module.exports = router;
