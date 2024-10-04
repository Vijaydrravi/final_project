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
    const {
      progress,
      quiz_score,
      interaction_time,
      completion_time,
      engagement_score,
      assignment_grade,
    } = req.body; // Get new fields from the request body

    // Validate that all required fields are provided and are not empty
    if (
      progress === undefined || 
      quiz_score === undefined || 
      interaction_time === undefined || 
      completion_time === undefined || 
      engagement_score === undefined || 
      assignment_grade === undefined ||
      progress === '' || 
      quiz_score === '' || 
      interaction_time === '' || 
      completion_time === '' || 
      engagement_score === '' || 
      assignment_grade === ''
    ) {
      return res.status(400).json({ error: "All fields must be provided and cannot be empty." });
    }

    // Fetch the current course assignment details
    const currentCourse = await prisma.courseAssignment.findUnique({
      where: {
        id: parseInt(courseId), // Ensure you're targeting the right course assignment
      },
    });

    // Check if the course is already completed
    if (currentCourse.progress === 100) {
      return res.status(400).json({ error: "Course is already completed, cannot update." });
    }

    // Update the progress and other details for the specified course assignment
    const updatedCourse = await prisma.courseAssignment.update({
      where: {
        id: parseInt(courseId), // Ensure you're targeting the right course assignment
      },
      data: {
        progress: parseInt(progress), // Update the progress value
        quiz_score: parseFloat(quiz_score) || null, // Update quiz_score, ensure it's a float
        interaction_time: parseFloat(interaction_time) || null, // Update interaction_time, ensure it's a float
        completion_time: parseInt(completion_time) || null, // Update completion_time, ensure it's an integer
        engagement_score: parseInt(engagement_score) || null, // Update engagement_score, ensure it's an integer
        assignment_grade: parseInt(assignment_grade) || null, // Update assignment_grade, ensure it's an integer
      },
    });

    // Calculate the performance rating
    const performanceRating = (progress * 0.3) + 
                              (quiz_score * 0.2) + 
                              ((100 / completion_time) * 0.15) + 
                              (interaction_time * 0.1) + 
                              (engagement_score * 0.1) + 
                              (assignment_grade * 0.15);

    // Update the PerformanceRating record
    await prisma.performanceRating.update({
      where: {
        assignment_id: updatedCourse.id, // Link to the correct assignment
      },
      data: {
        rating: performanceRating, // Update the performance rating
      },
    });

    res.status(200).json(updatedCourse); // Return the updated course assignment
  } catch (error) {
    console.error("Error updating enrolled course:", error);
    res.status(500).json({ error: "Error updating enrolled course" });
  }
}



module.exports = { getEnrolledCourses, updateEnrolledCourse };
