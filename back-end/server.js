const express = require('express');
const app = express();
const CourseRoutes = require('./routes/CourseRoute');
const UserRoutes =  require('./routes/UserRoute')



app.use(express.json());





app.use('/api/course',CourseRoutes)
app.use('/api/user',UserRoutes)

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
