const fs = require('fs');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const performanceRatingsCsvPath = './performance_ratings.csv';  // Path to your CSV file

// Function to ingest data from CSV into the database
const ingestPerformanceRatingsFromCsv = async () => {
  const performanceRatings = [];

  // Read the CSV file and store performance ratings in an array
  fs.createReadStream(performanceRatingsCsvPath)
    .pipe(csv())
    .on('data', (row) => {
      performanceRatings.push({
        rating: parseInt(row.rating),  // Ensure it's an integer
        user_id: parseInt(row.user_id),  // Ensure it's an integer
        assignment_id: parseInt(row.assignment_id),  // Ensure it's an integer
      });
    })
    .on('end', async () => {
      console.log(`CSV file successfully processed. Ingesting data...`);

      // Insert data into the database using Prisma's createMany method
      try {
        await prisma.performanceRating.createMany({
          data: performanceRatings,
          skipDuplicates: true,  // Skip if a performance rating for the same assignment already exists
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
ingestPerformanceRatingsFromCsv();
