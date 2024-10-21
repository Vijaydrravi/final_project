// dashboardController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getDashboardData = async (req, res) => {
  const userId = parseInt(req.params.userId);

  try {
    const enrolledCoursesCount = await prisma.courseAssignment.count({
      where: { user_id: userId },
    });

    const completedCoursesCount = await prisma.courseAssignment.count({
      where: { user_id: userId, progress: 100 },
    });

    const certifiedCoursesCount = await prisma.certificates.count({
      where: { user_id: userId, is_certified: true },
    });

    const totalPerformance = await prisma.performanceRating.aggregate({
      _avg: { rating: true },
      where: { user_id: userId },
    });

    // Fetch performance data for learning paths
    const performanceData = await prisma.performanceSummary.findMany({
      where: { user_id: userId },
      select: {
        learningPath: {
          select: {
            title: true, // Assuming title is in LearningPath model
          },
        },
        average_rating: true,
      },
    });

    // Format the performance data for the frontend
    const formattedPerformanceData = performanceData.map((data) => ({
      learningPathTitle: data.learningPath.title,
      averageRating: data.average_rating,
    }));

    res.json({
      enrolledCourses: enrolledCoursesCount,
      completedCourses: completedCoursesCount,
      certifiedCourses: certifiedCoursesCount,
      totalPerformance: totalPerformance._avg.rating || 0,
      performanceData: formattedPerformanceData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

module.exports = { getDashboardData };
