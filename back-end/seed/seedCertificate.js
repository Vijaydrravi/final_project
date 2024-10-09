const fs = require('fs');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const certificatesCsvPath = './certificates.csv';  // Path to your CSV file

// Function to ingest data from CSV into the database
const ingestCertificatesFromCsv = async () => {
  const certificates = [];

  // Read the CSV file and store certificates in an array
  fs.createReadStream(certificatesCsvPath)
    .pipe(csv())
    .on('data', (row) => {
      certificates.push({
        is_certified: row.is_certified.toLowerCase() === 'true',  // Convert to boolean
        assignment_id: parseInt(row.assignment_id),  // Ensure it's an integer
        user_id: parseInt(row.user_id),  // Ensure it's an integer
        image: row.image === 'NULL' ? null : null,  // Set as null (or handle image buffer here if needed)
      });
    })
    .on('end', async () => {
      console.log(`CSV file successfully processed. Ingesting data...`);

      // Insert data into the database using Prisma's createMany method
      try {
        await prisma.certificates.createMany({
          data: certificates,
          skipDuplicates: true,  // Skip if a certificate with the same assignment_id already exists
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
ingestCertificatesFromCsv();
