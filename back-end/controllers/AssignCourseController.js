const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fetch courses by learning path
exports.getCoursesByLearningPath = async (req, res) => {
  const { learningPathId } = req.params;

  try {
    const courses = await prisma.courseLearningPath.findMany({
      where: {
        learning_path_id: parseInt(learningPathId),
      },
      include: {
        course: true,
      },
    });

    res.json(courses.map((clp) => clp.course));
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

// Fetch all employees
exports.getEmployees = async (req, res) => {
  try {
    const employees = await prisma.user.findMany({
      where: {
        role: 'employee',
      },
      select: {
        id: true,
        name: true,
      },
    });

    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
};

// Assign course to employee
exports.assignCourse = async (req, res) => {
  const { userId, courseId } = req.body;

  try {
    // Check if the course is already assigned to the employee
    const existingAssignment = await prisma.courseAssignment.findFirst({
      where: {
        user_id: parseInt(userId),
        course_id: parseInt(courseId),
      },
    });

    if (existingAssignment) {
      return res.status(400).json({ error: 'Course is already assigned to this employee.' });
    }

    // Create a new assignment
    const assignment = await prisma.courseAssignment.create({
      data: {
        user_id: parseInt(userId),
        course_id: parseInt(courseId),
        progress: 0, // Default progress is 0
      },
    });

    res.json(assignment);
  } catch (error) {
    console.error('Error assigning course:', error);
    res.status(500).json({ error: 'Failed to assign course' });
  }
};