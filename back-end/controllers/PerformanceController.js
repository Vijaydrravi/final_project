const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



// Controller function to get learning paths for a user
const getLearningPaths = async (req, res) => {
    try {
      const learningPaths = await prisma.learningPath.findMany({
        select: {
          id: true,
          title: true,
        },
      });
      res.status(200).json(learningPaths);
    } catch (error) {
      console.error('Error fetching learning paths:', error);
      res.status(500).json({ error: 'Failed to fetch learning paths' });
    }
  };
  
  const getPerformanceData = async (req, res) => {
    const { userId, learningPathId } = req.params;
  
    console.log('User ID:', userId); // Log userId
    console.log('Learning Path ID:', learningPathId); // Log learningPathId
  
    try {
      const parsedUserId = parseInt(userId); // Parse userId to integer
      const parsedLearningPathId = learningPathId !== 'all' ? parseInt(learningPathId) : null; // Parse learningPathId if it's not 'all'
  
      // Query to fetch performance data
const performanceData = await prisma.courseAssignment.findMany({
    where: {
      user_id: parsedUserId, // Filter by user ID
      ...(parsedLearningPathId && { // Only filter by learning path if it's specified
        course: {
          learningPaths: {
            some: { // Use 'some' to find courses associated with the learning path
              id: parseInt(parsedLearningPathId), // Ensure the ID is parsed as an integer
            },
          },
        },
      }),
    },
    include: { // Use include for deeper querying
      course: {
        select: {
          id: true, // Select course ID if needed
          title: true, // Select course title
        },
      },
      performance: {
        select: {
          rating: true, // Select performance rating
        },
      },
    },
  });
  
  console.log(performanceData); // Log the raw performance data
  
  // Ensure you have the correct data structure for your response
  const formattedData = performanceData.map((entry) => ({
    courseTitle: entry.course.title,
    courseId: entry.course.id, // Include course ID if needed
    rating: entry.performance?.rating || 'N/A', // Default to 'N/A' if no rating exists
  }));
  
  // Log the formatted data to check what is being returned
  console.log('Formatted Performance Data:', formattedData);
  
  res.status(200).json(formattedData); // Send formatted data as the response
  
      // const courses = await prisma.courseAssignment.findMany({
      //   where: {
      //     user_id: parsedUserId, // Filter by the specific user ID
      //     course: {
      //       learningPaths: {
      //         some: {
      //           learning_path_id: parsedLearningPathId, // Use the learning path ID to filter
      //         },
      //       },
      //     },
      //   },
      //   include: {
      //     course: {
      //       select: {
      //         id: true,
      //         title: true,
      //         duration: true, // Select other fields as needed
      //         difficulty_level: true,
      //       },
      //     },
      //   },
      // });
  
      // // Format the result to only include course details
      // const formattedCourses = courses.map((assignment) => assignment.course);
  
      // console.log(formattedCourses);
      // res.json(formattedCourses)
    
    } catch (error) {
      console.error('Error fetching performance data:', error); // Log error
      res.status(500).json({ error: `Failed to fetch performance data for user ${userId}` }); // Return error response
    }
  };
  
module.exports = {
  getLearningPaths,
  getPerformanceData
};
