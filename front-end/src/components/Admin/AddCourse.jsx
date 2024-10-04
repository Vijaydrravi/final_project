import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddCourse = () => {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('Beginner');
  const [learningPaths, setLearningPaths] = useState([]);
  const [selectedLearningPath, setSelectedLearningPath] = useState('');

  useEffect(() => {
    // Fetch learning paths from the backend
    const fetchLearningPaths = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/learning-paths');
        const data = await response.json();
        setLearningPaths(data);
      } catch (error) {
        toast.error('Error fetching learning paths');
        console.error('Error fetching learning paths:', error);
      }
    };

    fetchLearningPaths();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (!title || !duration || !selectedLearningPath) {
      toast.error('All fields must be filled');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          duration: parseInt(duration),
          difficultyLevel,
          learningPathId: selectedLearningPath,
        }),
      });

      if (response.status === 400) {
        const errorData = await response.json();
        toast.error(errorData.error); // Show error message from backend
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to add course');
      }

      // Success notification
      toast.success('Course Added Successfully!');
      
      // Optionally reset form after successful submission
      setTitle('');
      setDuration('');
      setDifficultyLevel('Beginner');
      setSelectedLearningPath('');
    } catch (error) {
      console.error('Error adding course:', error);
      toast.error('Error adding course');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Add Course</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="block mb-2">Course Title</label>
          <input
            type="text"
            className="border p-2 w-full"
            placeholder="Enter course title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-2">Duration (in hours)</label>
          <input
            type="number"
            className="border p-2 w-full"
            placeholder="Enter duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-2">Difficulty Level</label>
          <select
            className="border p-2 w-full"
            value={difficultyLevel}
            onChange={(e) => setDifficultyLevel(e.target.value)}
            required
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        <div>
          <label className="block mb-2">Select Learning Path</label>
          <select
            className="border p-2 w-full"
            value={selectedLearningPath}
            onChange={(e) => setSelectedLearningPath(e.target.value)}
            required
          >
            <option value="">Choose a learning path</option>
            {learningPaths.map((path) => (
              <option key={path.id} value={path.id}>
                {path.title}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-4">
          Add Course
        </button>
      </form>
      
      {/* Toast Container for displaying notifications */}
      <ToastContainer />
    </div>
  );
};

export default AddCourse;
