import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../pages/AuthContext'; // Adjust the path if necessary
import { useNavigate } from 'react-router-dom';
import profileAdminImg from '../../assets/account.png';

const NewHomePage = () => {
  const { logout, user } = useAuth(); // Assuming `user` contains user details
  const navigate = useNavigate();
  const imgUrl = profileAdminImg;

  const handleLogout = () => {
    logout(); // Call the logout function
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-600 p-5 text-white fixed h-full">
        <h1 className="text-2xl font-bold mb-6">Course Management</h1>
        <ul>
          <li className="mb-4">
            <Link to="/employee-home/dashboard  " className="hover:text-blue-300">
              Dashboard
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/employee-home/enrolled-courses" className="hover:text-blue-300">
              Enrolled Courses
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/employee-home/my-performance" className="hover:text-blue-300">
              My Performance
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/employee-home/performance-learningpaths" className="hover:text-blue-300">
              Learning Performance
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/employee-home/my-certification" className="hover:text-blue-300">
              My Certification
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
      <div className="flex-1 p-10 ml-64 overflow-y-auto"> {/* Added ml-64 to push the content to the right */}
        {/* Profile Section */}
        <div className="absolute top-5 right-5 text-center">
          <div className="flex flex-col items-center">
            <img
              src={imgUrl} // Placeholder image
              alt="Profile"
              className="rounded-full w-12 h-12 mb-2"
            />
            <p className="text-black font-semibold">{user?.name || 'User Name'}</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold">Welcome to the Course Management System</h2>
        
        {/* Outlet for nested routes */}
        <Outlet />
      </div>
    </div>
  );
};

export default NewHomePage;
    