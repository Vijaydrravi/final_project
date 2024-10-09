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
        user_id: parseInt(userId), // Simple direct comparison
        course_id: parseInt(courseId), // Simple direct comparison
      },
    });

    if (existingAssignment) {
      return res.status(400).json({ error: 'Course is already assigned to this employee.' });
    }

    // Create a new course assignment
    const assignment = await prisma.courseAssignment.create({
      data: {
        user_id: parseInt(userId),
        course_id: parseInt(courseId),
        progress: 0, // Default progress is 0
      },
    });

    // Create a new PerformanceRating with a default rating of 0
    await prisma.performanceRating.create({
      data: {
        rating: 0, // Default rating is 0
        user_id: parseInt(userId),
        assignment_id: assignment.id, // Correctly using the assignment's id
      },
    });

    // Create a new certificate with is_certified set to false
    await prisma.certificates.create({
      data: {
        is_certified: false,  // Set certification status to false initially
        assignment_id: assignment.id,  // Link to the course assignment
        user_id: parseInt(userId),  // Link to the user
      },
    });

    // Find the associated learning path for the course
    const courseLearningPath = await prisma.courseLearningPath.findFirst({
      where: {
        course_id: parseInt(courseId),
      },
    });

    if (!courseLearningPath) {
      return res.status(404).json({ error: 'Learning path not found for this course.' });
    }

    const { learning_path_id } = courseLearningPath;

    // Check if a performance summary already exists for this user and learning path
    const getPerformanceSummary = await prisma.performanceSummary.findFirst({
      where: {
        user_id: parseInt(userId),
        learning_path_id: parseInt(learning_path_id),
      },
    });

    // If no performance summary exists, create one with an average rating of 0
    if (!getPerformanceSummary) {
      await prisma.performanceSummary.create({
        data: {
          user_id: parseInt(userId),
          average_rating: 0, // Default average rating is 0
          learning_path_id: parseInt(learning_path_id),
        },
      });
      console.log("Performance summary created successfully.");
    }

    // Send the newly created assignment as a response
    res.json(assignment);
  } catch (error) {
    console.error('Error assigning course:', error);
    res.status(500).json({ error: 'Failed to assign course' });
  }
};
