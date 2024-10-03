import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext'; // Adjust the path if necessary

const EnrolledCourses = () => {
  const { userId } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newProgress, setNewProgress] = useState('');

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (userId) {
        try {
          const response = await fetch(`http://localhost:5000/api/enrolled-courses/${userId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch enrolled courses');
          }
          const data = await response.json();

          // Sort courses by title and then by courseAssignmentId
          data.sort((a, b) => {
            const titleComparison = a.course.title.localeCompare(b.course.title);
            if (titleComparison !== 0) return titleComparison; // If titles are different, return comparison
            return a.courseAssignmentId - b.courseAssignmentId; // If titles are the same, compare by courseAssignmentId
          });

          setEnrolledCourses(data);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false); // Ensure loading is set to false if userId is not defined
      }
    };

    fetchEnrolledCourses();
  }, [userId]);

  const handleCardClick = (course) => {
    setSelectedCourse(course);
    setNewProgress(course.progress); // Pre-fill progress
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedCourse(null);
    setNewProgress('');
  };

  const handleProgressUpdate = async (e) => {
    e.preventDefault();
    if (selectedCourse) {
      try {
        const response = await fetch(`http://localhost:5000/api/enrolled-courses/update-progress/${selectedCourse.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ progress: newProgress }),
        });

        if (!response.ok) {
          throw new Error('Failed to update progress');
        }

        // Update the progress of the selected course in the state directly
        setEnrolledCourses((prevCourses) =>
          prevCourses.map((course) =>
            course.id === selectedCourse.id ? { ...course, progress: newProgress } : course
          )
        );

        handleDialogClose(); // Close dialog on success
      } catch (error) {
        setError(error.message);
      }
    }
  };

  if (loading) {
    return <p>Loading enrolled courses...</p>; // Loading state message
  }

  return (
    <div className="mt-6 p-4">
      <h3 className="text-2xl font-bold mb-4">Enrolled Courses</h3>
      {error && <p className="text-red-500">{error}</p>} {/* Error message */}
      {enrolledCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {enrolledCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer"
              onClick={() => handleCardClick(course)} // Open dialog on card click
            >
              <img
                src={course.course.image || 'https://via.placeholder.com/300'} // Placeholder image if none provided
                alt={course.course.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h4 className="text-lg font-semibold text-center">{course.course.title}</h4>
                <p className="text-gray-600 text-center">Duration: {course.course.duration} hours</p>
                <p className="text-gray-600 text-center">Progress: {course.progress}%</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No enrolled courses found.</p>
      )}

      {/* Dialog for updating progress */}
      {isDialogOpen && selectedCourse && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Update Progress for {selectedCourse.course.title}</h2>
            <form onSubmit={handleProgressUpdate}>
              <label htmlFor="progress" className="block mb-2 text-gray-700">
                Progress (%)
              </label>
              <input
                id="progress"
                type="number"
                min="0"
                max="100"
                value={newProgress}
                onChange={(e) => setNewProgress(e.target.value)}
                className="border border-gray-300 p-2 rounded w-full mb-4"
                required
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleDialogClose}
                  className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;
