const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Controller to create a new learning path
const createLearningPath = async (req, res) => {
  const { title, description } = req.body;

  try {
    const newLearningPath = await prisma.learningPath.create({
      data: {
        title,
        description,
      },
    });
    res.status(201).json(newLearningPath);
  } catch (error) {
    console.error('Error creating learning path:', error);
    res.status(500).json({ error: 'An error occurred while creating the learning path.' });
  }
};

// Function to get all learning paths
const getLearningPaths = async (req, res) => {
  try {
    const learningPaths = await prisma.learningPath.findMany();
    res.json(learningPaths);
  } catch (error) {
    console.error('Error fetching learning paths:', error);
    res.status(500).json({ error: 'An error occurred while fetching the learning paths.' });
  }
};

// Function to update a learning path
const updateLearningPath = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const updatedLearningPath = await prisma.learningPath.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
      },
    });
    res.json(updatedLearningPath);
  } catch (error) {
    console.error('Error updating learning path:', error);
    res.status(500).json({ error: 'An error occurred while updating the learning path.' });
  }
};

// Export the controller functions
module.exports = {
  createLearningPath,
  getLearningPaths,
  updateLearningPath, // Add this line for update functionality
};
