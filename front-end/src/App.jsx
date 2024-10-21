import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/pages/AuthContext';
import Login from './components/pages/Login';
import SignUp from './components/pages/SignUp';
import AdminHomePage from './components/Admin/AdminHomePage';
import EmployeePage from './components/user/EmployeePage'; // Import Employee Home Page
import AddCourse from './components/Admin/AddCourse';
import AssignCourse from './components/Admin/AssignCourse';
import AddLearningPath from './components/Admin/AddLearningPath';
import ViewCourses from './components/Admin/ViewCourses';
import EnrolledCourses from './components/user/EnrolledCourses'; // Import Enrolled Courses component
import LearningPathTable from './components/user/LearningPathTable';
import MyPerformance from './components/user/MyPerformance';
import IssueCertification from './components/Admin/IssueCertification';
import MyCertification from './components/user/MyCertification';
import EmployeeDashboard from './components/user/EmployeeDashboard';
import EmployeeTable from './components/Admin/EmployeeTable';
import EmployeeProfile from './components/Admin/EmployeeProfile';
import AdminDashboard from './components/Admin/AdminDashboard';
import SuggestedLearningPath from './components/user/SuggestedLearningPath';
import NoAccess from './NoAccess';
import NotFound from './NotFound';
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

const RoleBasedRoute = ({ children, requiredRole }) => {
  const { token } = useAuth();
  const role = localStorage.getItem('role'); // Get the role from localStorage

  if (!token) return <Navigate to="/login" />;

  // Check if the user's role matches the required role
  return role === requiredRole ? children : <Navigate to="/no-access" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/no-access" element={<NoAccess />} />
          <Route path="/not-found" element={<NotFound />} />

          {/* Employee Routes */}
          <Route path="/employee-home" element={
             <RoleBasedRoute requiredRole="employee">
             <EmployeePage />
           </RoleBasedRoute>
        
         
          }>
            <Route path="enrolled-courses" element={<EnrolledCourses />} />
            <Route path="my-performance" element={<MyPerformance />} />
            <Route path="performance-learningpaths" element={<LearningPathTable />} />
            <Route path="my-certification" element={<MyCertification />} />
            <Route path="dashboard" element={<EmployeeDashboard />} />
            <Route path="suggested-path" element={<SuggestedLearningPath />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/dashboard" element={
            <RoleBasedRoute requiredRole="admin">
              <AdminHomePage />
            </RoleBasedRoute>
          }>
            <Route path="admin-dashboard" element={<AdminDashboard />} />
            <Route path="add-course" element={<RoleBasedRoute requiredRole="admin"><AddCourse /></RoleBasedRoute>} />
            <Route path="assign-course" element={<RoleBasedRoute requiredRole="admin"><AssignCourse /></RoleBasedRoute>} />
            <Route path="add-learning-path" element={<RoleBasedRoute requiredRole="admin"><AddLearningPath /></RoleBasedRoute>} />
            <Route path="view-courses" element={<RoleBasedRoute requiredRole="admin"><ViewCourses /></RoleBasedRoute>} />
            <Route path="issue-certification" element={<RoleBasedRoute requiredRole="admin"><IssueCertification /></RoleBasedRoute>} />
            <Route path="employee-performance" element={<RoleBasedRoute requiredRole="admin"><EmployeeTable /></RoleBasedRoute>} />
            <Route path="employee-performance/:id" element={<RoleBasedRoute requiredRole="admin"><EmployeeProfile /></RoleBasedRoute>} /> {/* Add Employee Profile Route */}
          </Route>

          {/* Redirect all other paths to login */}
          <Route path="*" element={<Navigate to="/not-found" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
