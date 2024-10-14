import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../pages/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SuggestedLearningPath = () => {
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useAuth(); // Replace this with the actual user ID (can be fetched from context or props)

  useEffect(() => {
    const fetchAvailableCourses = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const response = await axios.get(`http://localhost:5000/api/courses/available/${userId}`);
        setAvailableCourses(response.data);
      } catch (error) {
        console.error('Error fetching available courses:', error);
        toast.error('Failed to fetch available courses. Please try again.'); // Show error toast
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchAvailableCourses();
  }, [userId]);

  const handleEnroll = async (courseId) => {
    try {
      const response = await axios.post('http://localhost:5000/api/assign', {
        userId,
        courseId,
      });
      toast.success('Successfully enrolled in the course!'); // Show success toast
      // Fetch available courses again to refresh the list
      fetchAvailableCourses();
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast.error(error.response.data.error || 'Failed to enroll in the course.'); // Show error toast
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-5 text-center mt-10 ">Available Courses to Enroll</h1>
      {loading ? (
        <p className="text-lg">Loading available courses...</p>
      ) : availableCourses.length > 0 ? (
        <ul className="space-y-4">
          {availableCourses.map(course => (
            <li key={course.id} className="border p-4 rounded shadow-md flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{course.title}</h2>
                <p className="text-gray-500">{course.difficulty_level}</p>
              </div>
              <button
                onClick={() => handleEnroll(course.id)}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
              >
                Enroll Now
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-lg">No available courses to enroll in.</p>
      )}
      <ToastContainer /> {/* Add the ToastContainer for toasts */}
    </div>
  );
};

export default SuggestedLearningPath;
