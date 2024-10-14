const fs = require('fs');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const suggestedLearningPathCsvPath = './suggested_learning_path.csv';  // Path to your CSV file

// Function to ingest data from CSV into the SuggestedLearningPath model
const ingestSuggestedLearningPathsFromCsv = async () => {
  const suggestedLearningPaths = [];

  // Read the CSV file and store suggested learning paths in an array
  fs.createReadStream(suggestedLearningPathCsvPath)
    .pipe(csv())
    .on('data', (row) => {
      suggestedLearningPaths.push({
        user_id: parseInt(row.user_id),  // Ensure user_id is an integer
        learning_path_id: parseInt(row.learning_path_id) // Ensure learning_path_id is an integer
      });
    })
    .on('end', async () => {
      console.log(`CSV file successfully processed. Ingesting data...`);

      // Insert data into the database using Prisma's createMany method
      try {
        await prisma.suggestedLearningPath.createMany({
          data: suggestedLearningPaths,
          skipDuplicates: true,  // Skip if a user already has a recommendation for the same learning path
        });

        console.log('Data successfully ingested into the database.');
      } catch (error) {
        console.error('Error ingesting data:', error);
      } finally {
        await prisma.$disconnect();
      }
    });
};

// Run the ingestion
ingestSuggestedLearningPathsFromCsv();
