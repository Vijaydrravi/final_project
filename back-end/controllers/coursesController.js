// controllers/coursesController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.addCourse = async (req, res) => {
  const { title, duration, difficultyLevel, learningPathId } = req.body;

  try {
    // Create the course
    const course = await prisma.course.create({
      data: {
        title,
        duration,
        difficulty_level: difficultyLevel,
      },
    });

    // Create a CourseLearningPath entry
    await prisma.courseLearningPath.create({
      data: {
        course_id: course.id,
        learning_path_id: parseInt(learningPathId), // Convert to integer
      },
    });

    res.status(201).json(course);
  } catch (error) {
    console.error('Error adding course:', error);
    res.status(500).json({ error: 'An error occurred while adding the course' });
  }
};

   exports.getCourses = async (req, res) => {
    try {
      const courses = await prisma.course.findMany(); // Assuming you have a 'course' model
      res.json(courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({ error: 'An error occurred while fetching the courses.' });
    }
  };


  exports.updateCourse = async (req, res) => {
    const { id } = req.params;
    const { title } = req.body; // Only expect the title in the request body
  
    try {
      const updatedCourse = await prisma.course.update({
        where: { id: parseInt(id) },
        data: { title }, // Update only the title
      });
      res.json(updatedCourse);
    } catch (error) {
      console.error('Error updating course:', error);
      res.status(500).json({ error: 'An error occurred while updating the course.' });
    }
  };