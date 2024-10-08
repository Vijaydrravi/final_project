const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// Get all employees with their overall performance
const getAllEmployees = async (req, res) => {
    try {
        console.log("get all employeesX")
        const employees = await prisma.user.findMany({
            where: {
                role: 'employee'
            },
            select: {
                id: true,
                name: true,
                designation: true,
                performanceSummary: {
                    select: {
                        average_rating: true,
                        learningPath: {
                            select: {
                                title: true,
                                description: true
                            }
                        }
                    }
                }
            }
        });
        res.json(employees);
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ error: "Error fetching employees" });
    }
};

// Get user profile by ID
const getUserProfile = async (req, res) => {
    const { id } = req.params; // Get user ID from request parameters

    try {
        const userProfile = await prisma.user.findUnique({
            where: { id: parseInt(id) },
            include: {
                courseAssignments: {
                    include: {
                        course: true, // Include course details
                        performance: true, // Include performance rating
                    }
                },
                performanceSummary: {
                    include: {
                        learningPath: true // Include learning path details
                    }
                },
                certificates: true // Include certificates if needed
            }
        });

        if (!userProfile) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(userProfile);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ error: "Error fetching user profile" });
    }
};

module.exports = {
    getAllEmployees,
    getUserProfile
};
