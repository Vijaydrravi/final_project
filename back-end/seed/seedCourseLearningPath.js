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
      console.log('CSV file successfully processed.');

      try {
        // Insert data into Prisma model
        for (const clp of courseLearningPaths) {
          // Check if the relationship already exists to avoid unique constraint violation
          const existingRelationship = await prisma.courseLearningPath.findUnique({
            where: {
              course_id_learning_path_id: {
                course_id: clp.course_id,
                learning_path_id: clp.learning_path_id,
              },
            },
          });

          if (!existingRelationship) {
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
            console.log(`Successfully added Course ID ${clp.course_id} to Learning Path ID ${clp.learning_path_id}.`);
          } else {
            console.log(`Relationship between Course ID ${clp.course_id} and Learning Path ID ${clp.learning_path_id} already exists. Skipping...`);
          }
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
