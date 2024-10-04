const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.addCourse = async (req, res) => {
  const { title, duration, difficultyLevel, learningPathId } = req.body;

  try {
    // Check if the course with the same title already exists
    const existingCourse = await prisma.course.findFirst({
      where: { title },
    });

    if (existingCourse) {
      return res.status(400).json({ error: 'A course with this title already exists.' });
    }

    // Ensure that all required fields are present
    if (!title || !duration || !difficultyLevel || !learningPathId) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Create the course
    const course = await prisma.course.create({
      data: {
        title,
        duration: parseInt(duration),
        difficulty_level: difficultyLevel,
      },
    });

    // Create a CourseLearningPath entry
    await prisma.courseLearningPath.create({
      data: {
        course_id: course.id,
        learning_path_id: parseInt(learningPathId),
      },
    });

    res.status(201).json(course);
  } catch (error) {
    console.error('Error adding course:', error);
    res.status(500).json({ error: 'An error occurred while adding the course.' });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany();
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
