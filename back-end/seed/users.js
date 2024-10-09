const fs = require('fs');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const usersCsvPath = './users.csv';  // Path to your CSV file

// Function to ingest data from CSV into the database
const ingestUsersFromCsv = async () => {
  const users = [];

  // Read the CSV file and store users in an array
  fs.createReadStream(usersCsvPath)
    .pipe(csv())
    .on('data', (row) => {
      users.push({
        email: row.email,
        password: row.password, // Assuming password is already hashed in CSV
        designation: row.designation || null, // Optional field
        name: row.name,
        role: row.role || 'employee'  // Default to 'employee'
      });
    })
    .on('end', async () => {
      console.log(`CSV file successfully processed. Ingesting data...`);

      // Insert data into the database using Prisma's createMany method
      try {
        await prisma.user.createMany({
          data: users,
          skipDuplicates: true,  // Skip if a user with the same email already exists
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
ingestUsersFromCsv();
