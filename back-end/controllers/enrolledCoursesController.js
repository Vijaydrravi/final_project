const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getEnrolledCourses(req, res) {
    try {
      const userId = req.params.userId; // Get userId from the request
  
      // Query the database for course assignments for the given user
      const enrolledCourses = await prisma.courseAssignment.findMany({
        where: {
          user_id: parseInt(userId), // Ensure user_id matches
        },
        include: {
          course: true, // Include course details
        },
      });
  
      res.status(200).json(enrolledCourses);
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
      res.status(500).json({ error: "Error fetching enrolled courses" });
    }
  }

  async function updateEnrolledCourse(req, res) {
    try {
      const { courseId } = req.params; // Get courseId from the request parameters
      const { progress } = req.body; // Get the new progress from the request body
  
      // Update the progress for the specified course assignment
      const updatedCourse = await prisma.courseAssignment.update({
        where: {
          id: parseInt(courseId), // Ensure you're targeting the right course assignment
        },
        data: {
          progress: parseInt(progress), // Update the progress value
        },
      });
  
      res.status(200).json(updatedCourse); // Return the updated course assignment
    } catch (error) {
      console.error("Error updating enrolled course:", error);
      res.status(500).json({ error: "Error updating enrolled course" });
    }
  }
  
  
  module.exports = { getEnrolledCourses,updateEnrolledCourse };