const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Controller to get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Fetch the total number of course assignments
    const totalCoursesAssigned = await prisma.courseAssignment.count();
    
    // Fetch the total number of completed courses (where progress is 100%)
    const totalCoursesCompleted = await prisma.courseAssignment.count({
      where: {
        progress: 100,
      },
    });

    // Fetch the total number of certificates issued
    const totalCertificatesIssued = await prisma.certificates.count({
      where: {
        is_certified: true,
      },
    });

    // Send the aggregated stats as the response
    res.json({
      totalCoursesAssigned,
      totalCoursesCompleted,
      totalCertificatesIssued,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
};

// Controller to get learning path performance data
const getLearningPathPerformance = async (req, res) => {
  try {
    // Fetch combined average ratings grouped by learning path
    const performanceData = await prisma.performanceSummary.groupBy({
      by: ['learning_path_id'],  // Group by learning path ID
      _avg: {
        average_rating: true,  // Calculate average rating
      },
    });

    // Map the learning path IDs to their titles
    const learningPathData = await prisma.learningPath.findMany({
      where: {
        id: {
          in: performanceData.map((data) => data.learning_path_id), // Fetch only the relevant learning paths
        },
      },
      select: {
        id: true,
        title: true,
      },
    });

    // Create a mapping of learning path IDs to titles for easier access
    const learningPathMap = Object.fromEntries(
      learningPathData.map((path) => [path.id, path.title])
    );

    // Format the data to map the learning path title with the combined average rating
    const formattedData = performanceData.map((summary) => ({
      learningPath: learningPathMap[summary.learning_path_id] || 'Unknown Learning Path', // Fallback if title not found
      averageRating: summary._avg.average_rating,
    }));

    res.json({ performanceData: formattedData });
  } catch (error) {
    console.error('Error fetching learning path performance:', error);
    res.status(500).json({ message: 'Failed to fetch learning path performance' });
  }
};


module.exports = {
  getDashboardStats,
  getLearningPathPerformance,
};
