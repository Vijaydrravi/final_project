const fs = require('fs');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const learningCsvPath = './file/learning_paths.csv';

const seedLearningPaths = async () => {
  const learningPaths = [];

  // Read the CSV file
  fs.createReadStream(learningCsvPath)
    .pipe(csv())
    .on('data', (row) => {
      learningPaths.push({
        title: row.title,
        description: row.description,
        created_at: new Date(row.created_at),
      });
    })
    .on('end', async () => {
      console.log('CSV file successfully processed');

      try {
        // Ingest data into the database using createMany to avoid duplicates
        await prisma.learningPath.createMany({
          data: learningPaths,
          skipDuplicates: true, // Skip any records that violate unique constraints
        });

        console.log('Learning Paths have been ingested successfully');
      } catch (error) {
        console.error('Error while seeding learning paths:', error);
      } finally {
        await prisma.$disconnect();
      }
    });
};

seedLearningPaths();
