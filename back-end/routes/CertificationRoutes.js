// routes/CertificationRoutes.js
const express = require('express');
const router = express.Router();
const {
  issueCertification,
  approveCertification,
} = require('../controllers/CertificationController');

// Route to get users for certification based on learning path
router.get('/issue-certification', issueCertification);

// Route to approve a certificate
router.post('/approve/:assignmentId', approveCertification);

module.exports = router;
