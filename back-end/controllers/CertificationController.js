const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fetch eligible users for certification
const issueCertification = async (req, res) => {
    try {
      // Step 1: Get users who have not been certified yet and have progress above 80%
      const users = await prisma.courseAssignment.findMany({
        where: {
          certificates: {
            some: {
              is_certified: false,  // Filter users with non-certified status
            },
          },
          progress: {
            gt: 80, // Filter users with progress greater than 80%
          },
        },
        include: {
          user: true,  // Include user details
          course: {
            include: {
              learningPaths: {
                include: {
                  learningPath: true,  // Include learning path details
                },
              },
            },
          },
          certificates: true,  // Include certificate details
        },
      });
  
      // Step 2: Return the filtered users
      res.status(200).json({ users });
    } catch (error) {
      console.error("Error fetching eligible users:", error);
      res.status(500).json({ error: "Failed to fetch eligible users" });
    }
  };
// Approve certification for a user
const approveCertification = async (req, res) => {
  const { assignmentId } = req.params;

  try {
    // Update the certification status for the user
    const certification = await prisma.certificates.update({
      where: { assignment_id: parseInt(assignmentId) },
      data: { is_certified: true },
    });

    res.status(200).json({ message: "Certification approved successfully", certification });
  } catch (error) {
    console.error("Error approving certification:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Record to update not found.' });
    }
    res.status(500).json({ error: "Failed to approve certification" });
  }
};

module.exports = {
  issueCertification,
  approveCertification,
};
