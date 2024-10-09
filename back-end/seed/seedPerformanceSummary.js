const fs = require('fs');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const performanceSummaryCsvPath = './performance_summaries.csv';  // Path to your CSV file

// Function to ingest data from CSV into the database
const ingestPerformanceSummaryFromCsv = async () => {
  const performanceSummaries = [];

  // Read the CSV file and store performance summaries in an array
  fs.createReadStream(performanceSummaryCsvPath)
    .pipe(csv())
    .on('data', (row) => {
      performanceSummaries.push({
        user_id: parseInt(row.user_id),  // Ensure it's an integer
        average_rating: parseFloat(row.average_rating),  // Ensure it's a float
        learning_path_id: parseInt(row.learning_path_id),  // Ensure it's an integer
      });
    })
    .on('end', async () => {
      console.log(`CSV file successfully processed. Ingesting data...`);

      // Insert data into the database using Prisma's createMany method
      try {
        await prisma.performanceSummary.createMany({
          data: performanceSummaries,
          skipDuplicates: true,  // Skip if a summary for the same user and learning path already exists
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
ingestPerformanceSummaryFromCsv();
