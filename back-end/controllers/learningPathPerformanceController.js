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
                    performance: {
                      select: {
                        rating: true, // Fetch course ratings from performance
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    console.log('Fetched Learning Paths:', learningPaths); // Log the fetched learning paths

    // Calculate average ratings and course details for each learning path
    const learningPathData = learningPaths.map(path => {
      const coursesWithRatings = path.courses.map(courseData => {
        const assignments = courseData.course.courseAssignments;
        const ratings = assignments.flatMap(assignment => assignment.performance?.rating ?? []);

        const courseAverageRating = ratings.length > 0
          ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
          : 0;

        return {
          courseId: courseData.course.id,
          courseTitle: courseData.course.title,
          progress: assignments.length > 0 ? assignments[0].progress : 0, // Get progress for the first assignment
          courseAverageRating,
        };
      });

      // Calculate the average rating of all courses in the learning path
      const allRatings = coursesWithRatings.flatMap(course => course.courseAverageRating);
      const averageRating = allRatings.length > 0
        ? allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length
        : 0;

      return {
        id: path.id,
        title: path.title,
        description: path.description,
        averageRating, // Learning Path average rating
        courses: coursesWithRatings, // List of courses with their ratings
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
