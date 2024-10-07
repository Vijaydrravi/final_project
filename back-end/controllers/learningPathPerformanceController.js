// controllers/learningPathController.js

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getLearningPathsWithPerformance = async (req, res) => {
  try {
    const learningPaths = await prisma.learningPath.findMany({
      include: {
        performanceSummaries: {
          select: {
            average_rating: true,
          },
        },
      },
    });

    // Calculate average ratings for each learning path
    const learningPathData = learningPaths.map(path => {
      const averageRating = path.performanceSummaries.length > 0
        ? path.performanceSummaries.reduce((sum, summary) => sum + summary.average_rating, 0) / path.performanceSummaries.length
        : 0;

      return {
        id: path.id,
        title: path.title,
        description: path.description,
        averageRating,
      };
    });

    res.status(200).json(learningPathData);
  } catch (error) {
    console.error('Error fetching learning paths:', error);
    res.status(500).json({ error: 'Failed to fetch learning paths' });
  }
};

module.exports = {
  getLearningPathsWithPerformance,
};
