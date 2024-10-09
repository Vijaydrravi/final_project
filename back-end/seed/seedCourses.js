const fs = require('fs');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const seedCourses = async () => {
  const courses = [];

  // Correct file path for the CSV file
  const filePath = 'courses.csv'; // Make sure this is the correct path

  // Check if the file path is correct and a valid string
  if (typeof filePath !== 'string') {
    throw new Error('The file path should be a string.');
  }

  // Read the CSV file
  fs.createReadStream(filePath) // Ensure filePath is a string
    .pipe(csv())
    .on('data', (row) => {
      courses.push({
        id: parseInt(row.id),            // Course ID
        title: row.title,                // Course title
        duration: parseInt(row.duration),// Duration of the course in hours/minutes
        difficulty_level: row.difficulty_level, // Difficulty level (Beginner, Intermediate, etc.)
      });
    })
    .on('end', async () => {
      console.log('CSV file successfully processed');

      try {
        // Ingest data into the database
        for (const course of courses) {
          await prisma.course.create({
            data: {
              id: course.id, // If you're manually specifying the ID
              title: course.title,
              duration: course.duration,
              difficulty_level: course.difficulty_level,
            },
          });
        }

        console.log('Courses have been ingested successfully');
      } catch (error) {
        console.error('Error while seeding courses:', error);
      } finally {
        await prisma.$disconnect();
      }
    });
};

seedCourses();
