import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddLearningPath = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [learningPaths, setLearningPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null); // State to track the ID of the learning path being edited

  // Fetch existing learning paths
  useEffect(() => {
    const fetchLearningPaths = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/learning-paths');
        if (!response.ok) {
          throw new Error('Failed to fetch learning paths');
        }
        const data = await response.json();
        setLearningPaths(data);
      } catch (error) {
        console.error('Error fetching learning paths:', error);
        toast.error('Error fetching learning paths. Please try again later.'); // Error toast for fetching
      } finally {
        setLoading(false);
      }
    };

    fetchLearningPaths();
  }, []);

  // Handle form submission for adding/updating learning path
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for minimum description length
    if (description.length < 45) {
      toast.error('Description must be at least 45 characters long.');
      return;
    }

    try {
      const method = editingId ? 'PUT' : 'POST'; // Determine if it's an update or create operation
      const url = editingId 
        ? `http://localhost:5000/api/learning-paths/${editingId}` 
        : 'http://localhost:5000/api/learning-paths';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });

      if (!response.ok) {
        const errorMessage = editingId ? 'Failed to update learning path.' : 'Failed to add learning path.';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Reset form fields after successful submission
      setTitle('');
      setDescription('');
      setEditingId(null); // Reset editing ID

      // Refetch the learning paths after a successful addition or update
      const updatedResponse = await fetch('http://localhost:5000/api/learning-paths');
      const updatedData = await updatedResponse.json();
      setLearningPaths(updatedData);

      // Show success notification using Toastify
      toast.success(editingId ? 'Learning Path Updated Successfully!' : 'Learning Path Added Successfully!');
    } catch (error) {
      console.error('Error adding/updating learning path:', error);
      // Show error notification using Toastify
      toast.error(editingId ? 'Error updating learning path. Please try again.' : 'Error adding learning path. Please try again.');
    }
  };

  // Handle edit button click
  const handleEdit = (path) => {
    setTitle(path.title);
    setDescription(path.description);
    setEditingId(path.id);
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit' : 'Add'} Learning Path</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className='grid '>
          <label className="block mb-2" htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring focus:ring-blue-400"
       
          />
        </div>
        <div>
          <label className="block mb-2" htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring focus:ring-blue-400"
         
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
          {editingId ? 'Update Learning Path' : 'Add Learning Path'}
        </button>
      </form>

      <h3 className="text-xl font-semibold mt-6">Existing Learning Paths</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ width: '100%', overflowX: 'auto' }}> {/* Set the width of the table to 50% */}
          <table className="min-w-full mt-4 border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border-b px-4 py-2 text-left">ID</th>
                <th className="border-b px-4 py-2 text-left">Title</th>
                <th className="border-b px-4 py-2 text-left">Description</th>
                <th className="border-b px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {learningPaths.map((path) => (
                <tr key={path.id} className="hover:bg-gray-50">
                  <td className="border-b px-4 py-2">{path.id}</td>
                  <td className="border-b px-4 py-2">{path.title}</td>
                  <td className="border-b px-4 py-2" style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'wrap' }}>
                    {path.description || 'N/A'}
                  </td>
                  <td className="border-b px-4 py-2">
                    <button
                      onClick={() => handleEdit(path)}
                      className="bg-yellow-500 text-white py-1 px-2 rounded"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Toast container for notifications */}
      <ToastContainer />
    </div>
  );
};

export default AddLearningPath;
