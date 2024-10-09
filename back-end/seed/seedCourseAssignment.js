const fs = require('fs');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const courseAssignmentsCsvPath = './course_assignments.csv';  // Path to your CSV file

// Function to ingest data from CSV into the database
const ingestCourseAssignmentsFromCsv = async () => {
  const courseAssignments = [];

  // Read the CSV file and store course assignments in an array
  fs.createReadStream(courseAssignmentsCsvPath)
    .pipe(csv())
    .on('data', (row) => {
      courseAssignments.push({
        user_id: parseInt(row.user_id),  // Make sure to parse IDs as integers
        course_id: parseInt(row.course_id),
        progress: parseInt(row.progress),  // Assuming progress is an integer
        assignment_date: new Date(row.assignment_date),  // Convert to Date object
        quiz_score: parseFloat(row.quiz_score),  // Assuming quiz_score is a float
        engagement_score: parseInt(row.engagement_score),  // Assuming engagement_score is an integer
        assignment_grade: parseInt(row.assignment_grade),  // Assuming assignment_grade is an integer
      });
    })
    .on('end', async () => {
      console.log(`CSV file successfully processed. Ingesting data...`);

      // Insert data into the database using Prisma's createMany method
      try {
        for (const ca of courseAssignments) {
          await prisma.courseAssignment.create({
            data: {
              user: {
                connect: {
                  id: ca.user_id,  // Connect to User by user_id
                },
              },
              course: {
                connect: {
                  id: ca.course_id,  // Connect to Course by course_id
                },
              },
              progress: ca.progress,
              assignment_date: ca.assignment_date,
              quiz_score: ca.quiz_score,
              engagement_score: ca.engagement_score,
              assignment_grade: ca.assignment_grade,
              // If you have performance or certificates, handle them here
              // performance: { ... },
              // certificates: { ... }
            },
          });
        }

        console.log('Data successfully ingested into the database.');
      } catch (error) {
        console.error('Error ingesting data:', error);
      } finally {
        await prisma.$disconnect();
      }
    });
};

// Run the ingestion
ingestCourseAssignmentsFromCsv();
