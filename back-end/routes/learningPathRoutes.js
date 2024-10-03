const express = require('express');
const router = express.Router();
const {
  createLearningPath,
  getLearningPaths,
  updateLearningPath,
} = require('../controllers/learningPathController');

// GET all learning paths
router.get('/', getLearningPaths);

// POST a new learning path
router.post('/', createLearningPath);

// PUT to update a learning path by ID
router.put('/:id', updateLearningPath); // Add this line for update functionality

module.exports = router;
