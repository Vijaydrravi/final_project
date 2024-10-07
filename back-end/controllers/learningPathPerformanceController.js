const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getLearningPathsWithPerformance = async (req, res) => {
  const userId = parseInt(req.params.userId); // Get userId from request parameters
 
  try {
    console.log('User ID:', userId); // Log the user ID

    // Fetch learning paths and their courses with course assignments for the user
    const learningPaths = await prisma.learningPath.findMany({
      include: {
        courses: {
          include: {
            course: {
              include: {
                courseAssignments: {
                  where: {
                    user_id: userId, // Filter course assignments by userId
                  },
                  select: {
                    performance: {
                      select: {
                        rating: true, // Get ratings from performance
                      }
                    }
                  },
                },
              }
            },
          },
        },
      },
    });

    console.log('Fetched Learning Paths:', learningPaths); // Log the fetched learning paths

    // Calculate average ratings for each learning path
    const learningPathData = learningPaths.map(path => {
      // Get all ratings for the courses associated with the learning path
      const ratings = path.courses.flatMap(courseData =>
        courseData.course.courseAssignments
          .flatMap(assignment => assignment.performance ? assignment.performance.rating : [])
      );

      const averageRating = ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
        : 0;

      // Get course details along with ratings
      const coursesWithRatings = path.courses.map(courseData => {
        const courseRatings = courseData.course.courseAssignments
          .filter(assignment => assignment.user_id === userId)
          .flatMap(assignment => assignment.performance ? assignment.performance.rating : []);

        const courseAverageRating = courseRatings.length > 0
          ? courseRatings.reduce((sum, rating) => sum + rating, 0) / courseRatings.length
          : 0;

        return {
          courseId: courseData.course.id,
          courseTitle: courseData.course.title,
          courseAverageRating,
        };
      });

      return {
        id: path.id,
        title: path.title,
        description: path.description,
        averageRating, // Learning Path average rating
        courses: coursesWithRatings, // List of courses with their average ratings
      };
    }).filter(path => path.averageRating > 0); // Filter out paths with zero average ratings

    console.log('Calculated Learning Path Data:', learningPathData); // Log calculated data
    res.status(200).json(learningPathData);
  } catch (error) {
    console.error('Error fetching learning paths:', error);
    res.status(500).json({ error: 'Failed to fetch learning paths' });
  }
};

module.exports = {
  getLearningPathsWithPerformance,
};
