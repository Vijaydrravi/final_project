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
    const courses = await prisma.course.findMany({
      orderBy: {
        id: 'asc', // Change this to 'desc' if you want descending order
      },
    });
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'An error occurred while fetching the courses.' });
  }
};


exports.editCourse = async (req, res) => {
  const { id } = req.params;
  const { title, duration, difficulty_level } = req.body;
 console.log(req.params)
  try {
    // Check if the course exists
    const courseExists = await prisma.course.findUnique({
      where: { id: parseInt(id) }, // Ensure ID is an integer
    });

    if (!courseExists) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Convert duration to an integer
    const durationInt = parseInt(duration, 10);

    // Check if duration is a valid positive integer
    if (!Number.isInteger(durationInt) || durationInt <= 0) {
      return res.status(400).json({ error: 'Invalid duration provided' });
    }

    const updatedCourse = await prisma.course.update({
      where: { id: parseInt(id) }, // Ensure ID is an integer
      data: {
        title,
        duration: durationInt, // Use the converted integer duration
        difficulty_level,
      },
    });

    res.json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
};
