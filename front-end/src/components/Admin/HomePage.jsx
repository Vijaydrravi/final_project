import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../pages/AuthContext'; // Adjust the path if necessary
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Call the logout function
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-600 p-5 text-white">
        <h1 className="text-2xl font-bold mb-6">Course Management</h1>
        <ul>
          <li className="mb-4">
            <Link to="/dashboard" className="hover:text-blue-300">
              Dashboard
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/dashboard/add-course" className="hover:text-blue-300">
              Add Course
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/dashboard/assign-course" className="hover:text-blue-300">
              Assign Course
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/dashboard/add-learning-path" className="hover:text-blue-300">
              Add Learning Path
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/dashboard/view-courses" className="hover:text-blue-300">
              View Courses
            </Link>
          </li>
        </ul>
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-6"
        >
          Logout
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 p-10">
        <h2 className="text-3xl font-bold">Welcome to the Course Management System</h2>
        
        {/* Outlet for nested routes */}
        <Outlet />
      </div>
    </div>
  );
};

export default HomePage;
