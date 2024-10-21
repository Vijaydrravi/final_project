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
      if(learningPathId === 'all'){
        const performanceData = await prisma.courseAssignment.findMany({
          where: {
            user_id: parsedUserId, // Filter by user ID
            ...(learningPathId !== 'all' && { // Only filter by learning path if specified
              course: {
                learningPaths: {
                  some: {
                    id: parsedLearningPathId, // Use parsed learning path ID
                  },
                },
              },
            }),
          },
          include: { // Use include for deeper querying
            course: {
              select: {
                id: true, // Select course ID
                title: true, // Select course title
                duration: true, // Select course duration
                difficulty_level: true, // Select difficulty level
              },
            },
            performance: {
              select: {
                rating: true, // Select performance rating
              },
            },
          },
        });
        
        // Log the raw performance data
        console.log(performanceData);
        
        // Ensure you have the correct data structure for your response
        const formattedData = performanceData.map((entry) => ({
          id: entry.course.id, // Course ID
          title: entry.course.title, // Course title
          duration: entry.course.duration, // Course duration
          difficulty_level: entry.course.difficulty_level, // Difficulty level
          rating: entry.performance?.rating || 'N/A', // Default to 'N/A' if no rating exists
        }));
        
        // Log the formatted data to check what is being returned
        console.log('Formatted Performance Data:', formattedData);
        
        // Send formatted data as the response
        res.status(200).json(formattedData);
      }
      else
      {
        const courses = await prisma.courseAssignment.findMany({
          where: {
            user_id: parsedUserId, // Replace with your specific user ID
            course: {
              learningPaths: {
                some: {
                  learning_path_id: parsedLearningPathId, // Use the learning path ID to filter
                },
              },
            },
          },
          include: {
            course: {
              select: {
                id: true,
                title: true,
                duration: true,
                difficulty_level: true,
              },
            },
            performance: { // Include the performance rating
              select: {
                rating: true, // Assuming 'rating' is what you want to show as the course score
              },
            },
          },
        });
        
        // Format the result to include course details and scores
        const formattedCourses = courses.map((assignment) => ({
          id: assignment.course.id,
          title: assignment.course.title,
          duration: assignment.course.duration,
          difficulty_level: assignment.course.difficulty_level,
          rating: assignment.performance ? assignment.performance.rating : 'N/A', // Default to 'N/A' if no rating exists
        }));
        
        console.log(formattedCourses);
        res.json(formattedCourses);
        
      }
  
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
