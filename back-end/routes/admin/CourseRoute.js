// routes/courses.js
const express = require('express');
const router = express.Router();
const coursesController = require('../../controllers/admin/coursesController');
const verifyToken = require('../../middlewares/verifyToken')

router.get('/', coursesController.getCourses);

// router.post('/:id', coursesController);
router.post('/',coursesController.addCourse)
module.exports = router;
