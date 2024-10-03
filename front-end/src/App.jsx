import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/pages/AuthContext'; // Adjust the path if necessary
import Login from './components/pages/Login'; // Adjust the path if necessary
import SignUp from './components/pages/SignUp'; // Import the Signup component
import HomePage from './components/Admin/HomePage'; // Adjust the path if necessary
import AddCourse from './components/Admin/AddCourse'; // Import the Add Course component
import AssignCourse from './components/Admin/AssignCourse'; // Import the Assign Course component
import AddLearningPath from './components/Admin/AddLearningPath'; // Import the Add Learning Path component
import ViewCourses from './components/Admin/ViewCourses';
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? <Navigate to="/dashboard" /> : children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }>
            {/* Nested routes under the HomePage */}
            <Route path="add-course" element={<AddCourse />} />
            <Route path="assign-course" element={<AssignCourse />} />
            <Route path="add-learning-path" element={<AddLearningPath />} />
            <Route path="view-courses" element={<ViewCourses />}/>
          </Route>
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
