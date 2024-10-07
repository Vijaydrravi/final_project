import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LearningPathTable = () => {
  const [learningPaths, setLearningPaths] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLearningPaths = async () => {
      try {
        // Retrieve userId from localStorage
        const userId = localStorage.getItem('userId');
        
        // Check if userId is present
        if (!userId) {
          setError('User ID not found');
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/learningpath-performance/learning-paths/${userId}`);
        setLearningPaths(response.data);
      } catch (error) {
        console.error('Error fetching learning paths:', error);
        setError('Error fetching learning paths');
      }
    };

    fetchLearningPaths();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Learning Path Performance</h2>
      {error && <p className="text-red-500 text-center">{error}</p>} {/* Display error if present */}
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full table-auto bg-white border border-gray-200 shadow-md rounded-lg">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-6 text-left text-sm font-semibold">Learning Path</th>
              <th className="py-3 px-6 text-left text-sm font-semibold">Average Rating</th>
            </tr>
          </thead>
          <tbody>
            {learningPaths.length > 0 ? (
              learningPaths.map((path, index) => (
                <tr
                  key={path.id}
                  className={`${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  } hover:bg-gray-100`}
                >
                  <td className="py-4 px-6 text-sm font-medium text-gray-700">{path.title}</td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-700">{path.averageRating.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="py-4 px-6 text-center text-sm text-gray-500">
                  No learning paths available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LearningPathTable;
