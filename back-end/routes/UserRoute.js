const express = require('express')
const router  = express.Router()


const userController = require('../controllers/UserController')
const { createCourse } = require('../controllers/CourseController')


router.get('/',userController.getUsers)
router.get('/:user',userController.getUser)


module.exports = router
