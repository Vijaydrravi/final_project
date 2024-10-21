const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Controller to create a new learning path
const createLearningPath = async (req, res) => {
  const { title, description } = req.body;

  try {
    // Check if the description meets the minimum length requirement
    if (!description || description.length < 45) {
      return res.status(400).json({ error: 'Description must be at least 45 characters long.' });
    }

    // Check if the learning path already exists using findFirst
    const existingPath = await prisma.learningPath.findFirst({
      where: { title }, // Use findFirst instead of findUnique
    });

    // If it exists, return a message or handle it as needed
    if (existingPath) {
      return res.status(400).json({ error: 'Learning path with this title already exists.' });
    }

    // Create the new learning path if it doesn't exist and description is valid
    const newLearningPath = await prisma.learningPath.create({
      data: { title, description },
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
    // Optionally check for description length and existence here as well
    if (description && description.length < 45) {
      return res.status(400).json({ error: 'Description must be at least 45 characters long.' });
    }

    const updatedLearningPath = await prisma.learningPath.update({
      where: { id: parseInt(id) },
      data: { title, description },
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
  updateLearningPath,
};
