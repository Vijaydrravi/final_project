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
            engagement_score,
            assignment_grade,
        } = req.body; // Get new fields from the request body

        // Validate that all required fields are provided and are not empty
        if (
            progress === undefined || 
            quiz_score === undefined || 
            engagement_score === undefined || 
            assignment_grade === undefined ||
            progress === '' || 
            quiz_score === '' || 
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
            include: {
                certificates: true, // Include certificates to check if user is certified
            },
        });

        // Check if the user has been certified for this course
        const isCertified = currentCourse.certificates.some(cert => cert.is_certified);
        if (isCertified) {
            return res.status(400).json({ error: "User is certified, cannot update course." });
        }

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
                engagement_score: parseInt(engagement_score) || null, // Update engagement_score, ensure it's an integer
                assignment_grade: parseInt(assignment_grade) || null, // Update assignment_grade, ensure it's an integer
            },
        });

        // Calculate the performance rating
        const performanceRating = (progress * 0.15) + (quiz_score * 0.35) + 
                                  (assignment_grade * 0.35) + 
                                  (engagement_score * 0.15);

        // Update the PerformanceRating record
        await prisma.performanceRating.update({
            where: {
                assignment_id: updatedCourse.id, // Link to the correct assignment
            },
            data: {
                rating: performanceRating, // Update the performance rating
            },
        });

        // Find the learning path
        const { learning_path_id } = await prisma.courseLearningPath.findFirst({
            where: {
                course_id: currentCourse.course_id
            }
        });

        // Fetch all performance ratings for the user and learning path
        const ratings = await prisma.performanceRating.findMany({
            where: { 
                user_id: currentCourse.user_id,  // Ensure you're targeting the right user
                courseAssignment: {
                    course: {
                        learningPaths: {
                            some: { learning_path_id: learning_path_id }  // Same learning path
                        }
                    }
                }
            },
            select: { rating: true },
        });

        // Calculate the new average rating
        const totalRatings = ratings.reduce((sum, rating) => sum + rating.rating, 0);
        const averageRating = ratings.length > 0 ? totalRatings / ratings.length : 0;

        // Update the PerformanceSummary with the new average rating
        const performanceSummary = await prisma.performanceSummary.findFirst({
            where: {             
                user_id: currentCourse.user_id, // The user
                learning_path_id: learning_path_id, // The learning path               
            }
        });

        // Check if the performance summary exists
        if (performanceSummary) {
            await prisma.performanceSummary.update({
                where: {
                    id: performanceSummary.id, // Use the found summary's ID directly
                },
                data: {
                    average_rating: parseFloat(averageRating), // Ensure this matches the schema field name
                }
            });
        }

        res.status(200).json(updatedCourse); // Return the updated course assignment
    } catch (error) {
        console.error("Error updating enrolled course:", error);
        res.status(500).json({ error: "Error updating enrolled course" });
    }
}


  


module.exports = { getEnrolledCourses, updateEnrolledCourse };
