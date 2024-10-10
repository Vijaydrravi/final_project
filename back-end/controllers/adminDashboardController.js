const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fetch overall dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
      const totalCoursesAssigned = await prisma.courseAssignment.count();
      const totalCoursesCompleted = await prisma.courseAssignment.count({
        where: { progress: 100 },
      });
      const totalCertificatesIssued = await prisma.certificates.count({
        where: { is_certified: true },
      });
  
      res.json({
        totalCoursesAssigned,
        totalCoursesCompleted,
        totalCertificatesIssued,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  // Fetch learning path performance data
  const getLearningPathPerformance = async (req, res) => {
    try {
      const performanceData = await prisma.performanceSummary.groupBy({
        by: ['learning_path_id'],
        _avg: {
          average_rating: true, // Calculate average rating
        },
      });
  
      // Fetch corresponding learning path details
      const learningPathIds = performanceData.map(item => item.learning_path_id);
      const learningPaths = await prisma.learningPath.findMany({
        where: {
          id: {
            in: learningPathIds,
          },
        },
      });
  
      const learningPathMap = {};
      learningPaths.forEach(path => {
        learningPathMap[path.id] = path.title;
      });
  
      // Combine aggregated data with learning path titles
      const aggregatedPerformance = performanceData.map(({ learning_path_id, _avg }) => ({
        learningPath: learningPathMap[learning_path_id],
        averageRating: _avg.average_rating,
      }));
  
      res.json({ performanceData: aggregatedPerformance });
    } catch (error) {
      console.error("Error fetching learning path performance:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  
  // Fetch course progress distribution
  const getCourseProgressDistribution = async (req, res) => {
    try {
      const progressData = await prisma.courseAssignment.findMany({
        select: {
          course: {
            select: {
              title: true,
            },
          },
          progress: true,
        },
      });
  
      const aggregatedProgress = progressData.map(({ course, progress }) => ({
        course: course.title,
        totalProgress: progress,
      }));
  
      res.json({ progressData: aggregatedProgress });
    } catch (error) {
      console.error("Error fetching course progress distribution:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  // Fetch course scores
  const getCourseScores = async (req, res) => {
    try {
      const scoresData = await prisma.courseAssignment.findMany({
        select: {
          course: {
            select: {
              title: true,
            },
          },
          quiz_score: true,
          engagement_score: true,
        },
      });
  
      const aggregatedScores = scoresData.map(({ course, quiz_score, engagement_score }) => ({
        course: course.title,
        quizScore: quiz_score,
        engagementScore: engagement_score,
      }));
  
      res.json({ scores: aggregatedScores });
    } catch (error) {
      console.error("Error fetching course scores:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  module.exports = {
    getDashboardStats,
    getLearningPathPerformance,
    getCourseProgressDistribution,
    getCourseScores,
  };