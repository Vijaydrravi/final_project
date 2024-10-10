import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyPerformance = () => {
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [learningPaths, setLearningPaths] = useState([]);
  const [selectedLearningPath, setSelectedLearningPath] = useState('all'); // Default to show all
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [coursesPerPage] = useState(7); // Number of courses per page

  const userId = localStorage.getItem('userId'); // Assuming the user ID is stored in localStorage

  useEffect(() => {
    const fetchLearningPaths = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/learning-paths'); // Adjust this endpoint accordingly
        setLearningPaths(response.data); // Assuming this returns an array of learning paths
      } catch (error) {
        console.error('Failed to fetch learning paths:', error);
      }
    };

    fetchLearningPaths();
  }, []);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/my-performance/${userId}/${selectedLearningPath}`);
        setPerformanceData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch performance data:', error);
      }
    };

    // Fetch performance data only if userId is available
    if (userId) {
      fetchPerformanceData();
    }
  }, [userId, selectedLearningPath]); // Fetch data whenever the learning path changes

  if (loading) {
    return <p className="text-center mt-6">Loading...</p>;
  }

  // Pagination logic
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = performanceData.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(performanceData.length / coursesPerPage);

  return (
    <div className="container mx-auto p-6">
      <p className="text-2xl font-bold mb-4 text-center ">My Performance</p>

      {/* Dropdown for Learning Paths */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">Select Learning Path:</label>
        <select 
          value={selectedLearningPath} 
          onChange={(e) => {
            setSelectedLearningPath(e.target.value);
            setCurrentPage(1); // Reset to the first page on path change
          }} 
          className="p-2 border border-gray-300 rounded"
        >
          <option value="all">All Learning Paths</option>
          {learningPaths.map((path) => (
            <option key={path.id} value={path.id}>{path.title}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-white border border-gray-200 shadow-md rounded-lg">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-6 text-left text-sm font-semibold">Course Title</th>
              <th className="py-3 px-6 text-left text-sm font-semibold">Duration (hrs)</th>
              <th className="py-3 px-6 text-left text-sm font-semibold">Difficulty Level</th>
              <th className="py-3 px-6 text-left text-sm font-semibold">Rating</th>
            </tr>
          </thead>
          <tbody>
            {currentCourses.length > 0 ? (
              currentCourses.map((course, index) => (
                <tr
                  key={course.id} // Using course.id as the key for better uniqueness
                  className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100`}
                >
                  <td className="py-4 px-6 text-sm font-medium text-gray-700">{course.title}</td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-700">{course.duration}</td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-700">{course.difficulty_level}</td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-700">{course.rating}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4 px-6 text-center text-sm text-gray-500">
                  No performance data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 border border-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="p-2 border border-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MyPerformance;
