const fs = require('fs');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const seedCourseLearningPath = async () => {
  const courseLearningPaths = [];

  const filePath = 'course_learning_path.csv'; // Path to your CSV file

  // Read the CSV file and parse data
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      courseLearningPaths.push({
        course_id: parseInt(row.course_id),
        learning_path_id: parseInt(row.learning_path_id),
      });
    })
    .on('end', async () => {
      try {
        // Insert data into Prisma model
        for (const clp of courseLearningPaths) {
          await prisma.courseLearningPath.create({
            data: {
              course: {
                connect: { id: clp.course_id },
              },
              learningPath: {
                connect: { id: clp.learning_path_id },
              },
            },
          });
        }
        console.log('CourseLearningPath data has been seeded successfully.');
      } catch (error) {
        console.error('Error seeding CourseLearningPath:', error);
      } finally {
        await prisma.$disconnect();
      }
    });
};

seedCourseLearningPath();
