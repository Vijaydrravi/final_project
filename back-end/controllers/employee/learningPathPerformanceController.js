const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getLearningPathsWithPerformance = async (req, res) => {
  const userId = parseInt(req.params.userId); // Get userId from request parameters

  try {
    console.log('User ID:', userId); // Log the user ID

    // Fetch learning paths where the user is enrolled in at least one course (based on course assignments)
    const learningPaths = await prisma.learningPath.findMany({
      where: {
        courses: {
          some: {
            course: {
              courseAssignments: {
                some: {
                  user_id: userId, // Filter courses where user is enrolled
                },
              },
            },
          },
        },
      },
      include: {
        courses: {
          include: {
            course: {
              include: {
                courseAssignments: {
                  where: {
                    user_id: userId, // Only include course assignments for the current user
                  },
                  select: {
                    progress: true, // Fetch course progress for the user
                  },
                },
              },
            },
          },
        },
      },
    });

    console.log('Fetched Learning Paths:', learningPaths); // Log the fetched learning paths

    // Fetch average ratings from the PerformanceSummary model
    const performanceSummaries = await prisma.performanceSummary.findMany({
      where: {
        user_id: userId,
        learning_path_id: {
          in: learningPaths.map(path => path.id), // Filter by learning paths the user is enrolled in
        },
      },
      select: {
        learning_path_id: true,
        average_rating: true,
      },
    });

    // Map performance summaries to learning paths
    const learningPathData = learningPaths.map(path => {
      const performanceSummary = performanceSummaries.find(ps => ps.learning_path_id === path.id);
      const averageRating = performanceSummary ? performanceSummary.average_rating : 0; // Default to 0 if no summary found

      return {
        id: path.id,
        title: path.title,
        description: path.description,
        averageRating, // Learning Path average rating from PerformanceSummary
        courses: path.courses.map(courseData => ({
          courseId: courseData.course.id,
          courseTitle: courseData.course.title,
          progress: courseData.course.courseAssignments.length > 0 
            ? courseData.course.courseAssignments[0].progress 
            : 0, // Get progress for the first assignment
        })), // List of courses with their ratings
      };
    });

    console.log('Calculated Learning Path Data:', learningPathData); // Log calculated data

    // Respond with all learning paths the user is enrolled in
    res.status(200).json(learningPathData);
  } catch (error) {
    console.error('Error fetching learning paths:', error);
    res.status(500).json({ error: 'Failed to fetch learning paths' });
  }
};

module.exports = {
  getLearningPathsWithPerformance,
};
