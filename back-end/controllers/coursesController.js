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
      include: {
        courseAssignments: {
          select: {
            id: true, // Include the id or any other field if necessary
          },
        },
      },
    });

    // Map through courses to include the count of enrolled members
    const coursesWithEnrollmentCount = courses.map(course => ({
      ...course,
      enrolledMembers: course.courseAssignments.length, // Count the number of assignments to get enrolled members
    }));

    res.json(coursesWithEnrollmentCount);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'An error occurred while fetching the courses.' });
  }
};



exports.editCourse = async (req, res) => {
  const { id } = req.params;
  const { title, duration, difficulty_level } = req.body;

  console.log('ID:', id);
  console.log('Request Body:', req.body);

  try {
    const updatedCourse = await prisma.course.update({
      where: { id: Number(id) },
      data: {
        title,
        duration: parseInt(duration), // Ensure duration is an integer
        difficulty_level,
      },
    });
    res.json(updatedCourse);
  } catch (error) {
    console.error('Error:', error); // Log the exact error
    res.status(500).json({ message: 'Error updating the course', error });
  }
};

