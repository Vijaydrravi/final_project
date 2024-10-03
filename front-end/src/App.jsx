import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/pages/AuthContext';
import Login from './components/pages/Login';
import SignUp from './components/pages/SignUp';
import HomePage from './components/Admin/HomePage';
import NewHomePage from './components/pages/NewHomePage'; // Import Employee Home Page
import AddCourse from './components/Admin/AddCourse';
import AssignCourse from './components/admin/AssignCourse';
import AddLearningPath from './components/Admin/AddLearningPath';
import ViewCourses from './components/admin/ViewCourses';
import EnrolledCourses from './components/pages/EnrolledCourses'; // Import Enrolled Courses component

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

const RoleBasedRoute = ({ children }) => {
  const { token } = useAuth();
  const role = localStorage.getItem('role'); // Get the role from localStorage

  if (!token) return <Navigate to="/login" />;

  // Render different homepages based on the role
  return role === 'admin' ? children : <Navigate to="/employee-home" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Employee Routes */}
          <Route path="/employee-home" element={
            <ProtectedRoute>
              <NewHomePage />
            </ProtectedRoute>
          }>
            <Route path="enrolled-courses" element={<EnrolledCourses />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/dashboard" element={
            <RoleBasedRoute>
              <HomePage />
            </RoleBasedRoute>
          }>
            <Route path="add-course" element={<AddCourse />} />
            <Route path="assign-course" element={<AssignCourse />} />
            <Route path="add-learning-path" element={<AddLearningPath />} />
            <Route path="view-courses" element={<ViewCourses />} />
          </Route>

          {/* Redirect all other paths to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
