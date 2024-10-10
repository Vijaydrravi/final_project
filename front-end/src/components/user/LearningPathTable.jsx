import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LearningPathTable = () => {
  const [learningPaths, setLearningPaths] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [pathsPerPage] = useState(8); // Number of learning paths per page

  useEffect(() => {
    const fetchLearningPaths = async () => {
      try {
        const userId = localStorage.getItem('userId');
        
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

  // Pagination logic
  const indexOfLastPath = currentPage * pathsPerPage;
  const indexOfFirstPath = indexOfLastPath - pathsPerPage;
  const currentPaths = learningPaths.slice(indexOfFirstPath, indexOfLastPath);
  const totalPages = Math.ceil(learningPaths.length / pathsPerPage);

  return (
    <div className="container mx-auto p-5">
      <h2 className="text-2xl font-bold mb-4 text-center">Learning Path Performance</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full table-auto bg-white border border-gray-200 shadow-md rounded-lg">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-6 text-left text-sm font-semibold">Learning Path</th>
              <th className="py-3 px-6 text-left text-sm font-semibold">Average Rating</th>
            </tr>
          </thead>
          <tbody>
            {currentPaths.length > 0 ? (
              currentPaths.map((path, index) => (
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

export default LearningPathTable;
