import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyPerformance = () => {
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [learningPaths, setLearningPaths] = useState([]);
  const [selectedLearningPath, setSelectedLearningPath] = useState('all'); // Default to show all

  const userId = localStorage.getItem('userId'); // Assuming the user ID is stored in localStorage

  useEffect(() => {
    const fetchLearningPaths = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/learning-paths`); // Adjust this endpoint accordingly
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

    fetchPerformanceData();
  }, [userId, selectedLearningPath]); // Fetch data whenever the learning path changes

  if (loading) {
    return <p className="text-center mt-6">Loading...</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">My Performance</h2>

      {/* Dropdown for Learning Paths */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">Select Learning Path:</label>
        <select 
          value={selectedLearningPath} 
          onChange={(e) => setSelectedLearningPath(e.target.value)} 
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
              <th className="py-3 px-6 text-left text-sm font-semibold">Rating</th>
            </tr>
          </thead>
          <tbody>
            {performanceData.length > 0 ? (
              performanceData.map((course, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  } hover:bg-gray-100`}
                >
                  <td className="py-4 px-6 text-sm font-medium text-gray-700">{course.courseTitle}</td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-700">{course.rating}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="py-4 px-6 text-center text-sm text-gray-500">
                  No performance data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyPerformance;
