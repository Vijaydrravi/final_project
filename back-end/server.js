const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/authRoutes'); // Import the routes
const learningPathRoutes = require('./routes/learningPathRoutes');
const coursesRoutes = require('./routes/CourseRoute');
const assignCourseRoutes = require('./routes/assignCourseRoutes');
const enrolledCoursesRoute = require('./routes/enrolledCoursesRoute')
const performanceRoutes = require('./routes/performanceRoutes')
const learningPathPerformanceRoutes = require('./routes/learningPathPerformanceRoutes')
const CertificationRoutes = require('./routes/CertificationRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')
const employeeRoutes = require('./routes/employeeRoutes')
const adminDashboardRoutes = require('./routes/adminDashboardRoutes')


const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Use the auth routes
app.use('/auth', authRoutes);
app.use('/api/learning-paths', learningPathRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/enrolled-courses',enrolledCoursesRoute)
app.use('/api', assignCourseRoutes);
app.use('/api/my-performance',performanceRoutes)
app.use('/api/learningpath-performance',learningPathPerformanceRoutes)
app.use('/api/certifications',CertificationRoutes)
app.use('/api/dashboard',dashboardRoutes)
app.use('/api/employee',employeeRoutes)
app.use('/api/admin-dashboard',adminDashboardRoutes)

// app.js



// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
