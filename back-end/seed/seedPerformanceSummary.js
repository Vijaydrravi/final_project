const fs = require('fs');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const performanceSummaryCsvPath = './performance_summaries.csv'; // Path to your CSV file

// Function to check if user and learning path exist
const checkReferencesExist = async (userId, learningPathId) => {
  const userExists = await prisma.user.findUnique({ where: { id: userId } });
  const learningPathExists = await prisma.learningPath.findUnique({ where: { id: learningPathId } });
  return userExists && learningPathExists;
};

// Function to ingest data from CSV into the database
const ingestPerformanceSummaryFromCsv = async () => {
  const performanceSummaries = [];

  // Read the CSV file and store performance summaries in an array
  fs.createReadStream(performanceSummaryCsvPath)
    .pipe(csv())
    .on('data', (row) => {
      performanceSummaries.push({
        user_id: parseInt(row.user_id), // Ensure it's an integer
        average_rating: parseFloat(row.average_rating), // Ensure it's a float
        learning_path_id: parseInt(row.learning_path_id), // Ensure it's an integer
      });
    })
    .on('end', async () => {
      console.log('CSV file successfully processed. Ingesting data...');

      for (const summary of performanceSummaries) {
        const { user_id, average_rating, learning_path_id } = summary;

        // Validate references before insertion
        const referencesExist = await checkReferencesExist(user_id, learning_path_id);
        
        if (!referencesExist) {
          console.error(`Skipping entry: User ID ${user_id} or Learning Path ID ${learning_path_id} does not exist.`);
          continue; // Skip this summary if references are invalid
        }

        // Insert data into the database using Prisma's upsert method
        try {
          await prisma.performanceSummary.upsert({
            where: {
              user_id_learning_path_id: { // Using a composite unique key
                user_id,
                learning_path_id,
              },
            },
            update: {
              average_rating, // Update if it already exists
            },
            create: {
              user_id,
              average_rating,
              learning_path_id,
            },
          });
        } catch (error) {
          console.error(`Error ingesting data for User ID ${user_id}, Learning Path ID ${learning_path_id}:`, error);
        }
      }

      console.log('Data ingestion completed.');
      await prisma.$disconnect();
    });
};

// Run the ingestion
ingestPerformanceSummaryFromCsv();
