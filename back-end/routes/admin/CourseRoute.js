// routes/courses.js
const express = require('express');
const router = express.Router();
const coursesController = require('../../controllers/admin/coursesController');
const verifyToken = require('../../middlewares/verifyToken')

router.get('/',verifyToken('admin'), coursesController.getCourses);
router.post('/:id', coursesController.editCourse);

module.exports = router;
