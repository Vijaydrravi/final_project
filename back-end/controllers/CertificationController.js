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
        // Fetch user details
        const { name, courseTitle } = await getUserDetails(assignmentId); 

        // Generate certificate image
        const canvas = createCanvas(name, courseTitle); // Pass name and courseTitle to createCanvas
        const imageData = canvas.toDataURL('image/png'); // Get the image data as Base64
        
        // Extract base64 string from the data URL
        const base64Image = imageData.split(',')[1]; // Get only the Base64 part

        // Update the certification status for the user
        const certification = await prisma.certificates.update({
            where: { assignment_id: parseInt(assignmentId) },
            data: { 
                is_certified: true,
                image: base64Image // Store the pure Base64 image
            },
        });

        // Send the certification data back to the client
        res.status(200).json({ message: "Certification approved successfully", certification });
    } catch (error) {
        console.error("Error approving certification:", error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Record to update not found.' });
        }
        res.status(500).json({ error: "Failed to approve certification" });
    }
};

// Function to create the certificate canvas and draw on it
const createCanvas = (name, courseTitle) => {
    const { createCanvas } = require('canvas'); // Use 'canvas' library to create the image
    const canvas = createCanvas(600, 400); // Increased size for better design
    const ctx = canvas.getContext('2d');

    // Draw the background
    ctx.fillStyle = '#F0F0F0'; // Light gray background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw a border
    ctx.strokeStyle = '#4B0082'; // Indigo color for border
    ctx.lineWidth = 10;
    ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10); // Draw border

    // Draw the title
    ctx.fillStyle = '#000000'; // Black color for text
    ctx.font = '24px Arial';
    ctx.textAlign = 'center'; // Center alignment for title
    ctx.fillText('Certificate of Completion', canvas.width / 2, 50);

    // Draw a decorative line
    ctx.strokeStyle = '#4B0082'; // Indigo color
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(50, 80);
    ctx.lineTo(canvas.width - 50, 80);
    ctx.stroke();

    // Draw certificate details
    ctx.fillStyle = '#000000'; // Black color for text
    ctx.font = '20px Arial';
    ctx.textAlign = 'left'; // Left alignment for other text
    ctx.fillText('This certifies that', 50, 120);
    ctx.font = '22px Arial';
    ctx.fillText(name, 50, 160); // User's name
    ctx.font = '20px Arial';
    ctx.fillText('has completed the course', 50, 200);
    ctx.fillText(courseTitle, 50, 230); // Course title

    // Draw a decorative element (like a star or circle)
    ctx.fillStyle = '#FFD700'; // Gold color for decoration
    ctx.beginPath();
    ctx.arc(canvas.width - 100, 300, 30, 0, Math.PI * 2, true); // Decorative circle
    ctx.fill();

    return canvas; // Return the created canvas
};


// Function to fetch user details based on assignment ID
const getUserDetails = async (assignmentId) => {
    // Fetch user details using the assignment ID
    const certificate = await prisma.certificates.findUnique({
        where: { assignment_id: parseInt(assignmentId) },
        include: { 
            user: true,
            courseAssignment: {
                include: {
                    course: true // Include course details through CourseAssignment
                }
            }
        }
    });

    // Ensure certificate exists
    if (!certificate) {
        throw new Error('Certificate not found');
    }

    return {
        name: certificate.user.name,
        courseTitle: certificate.courseAssignment.course.title, // Access course title from CourseAssignment
    };
};


// Controller function to fetch certificates for a specific user
const getCertificates = async (req, res) => {
  const userId = parseInt(req.params.userId); // Get user ID from route params
  console.log(userId);

  try {
      const certificates = await prisma.certificates.findMany({
          where: {
              user_id: userId,
              is_certified: true, // Only fetch certified certificates
          },
          include: {
              courseAssignment: {
                  include: {
                      course: true, // Include course details
                  },
              },
          },
      });

      // If no certificates are found, return an empty array
      if (certificates.length === 0) {
          return res.status(200).json({ message: "No certified certificates found for this user.", data: [] });
      }

      res.status(200).json({ data: certificates }); // Return the certificates in the 'data' field
  } catch (error) {
      console.error("Error fetching certificates:", error);
      res.status(500).json({ error: "Failed to fetch certificates" });
  }
};



module.exports = {
  issueCertification,
  approveCertification,
  getCertificates
};
