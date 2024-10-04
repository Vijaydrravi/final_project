import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext'; // Adjust the path if necessary
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS

const EnrolledCourses = () => {
  const { userId } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newProgress, setNewProgress] = useState('');
  const [quizScore, setQuizScore] = useState('');
  const [engagementScore, setEngagementScore] = useState('');
  const [assignmentGrade, setAssignmentGrade] = useState('');
  
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (userId) {
        try {
          const response = await fetch(`http://localhost:5000/api/enrolled-courses/${userId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch enrolled courses');
          }
          const data = await response.json();
          data.sort((a, b) => a.course.title.localeCompare(b.course.title));
          setEnrolledCourses(data);
        } catch (error) {
          toast.error(error.message); // Display error using toast
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [userId]);

  const handleCardClick = (course) => {
    setSelectedCourse(course);
    setNewProgress(course.progress); // Pre-fill progress
    setQuizScore(course.quiz_score || ''); // Pre-fill quiz score
    setEngagementScore(course.engagement_score || ''); // Pre-fill engagement score
    setAssignmentGrade(course.assignment_grade || ''); // Pre-fill assignment grade
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedCourse(null);
    setNewProgress('');
    setQuizScore('');
    setEngagementScore('');
    setAssignmentGrade('');
  };

  const handleProgressUpdate = async (e) => {
    e.preventDefault();

    // Validate fields
    if (!newProgress || newProgress < 0 || newProgress > 100) {
      toast.error('Please enter a valid progress percentage (0-100).');
      return;
    }

    if (!quizScore && quizScore !== 0) {
      toast.error('Please enter a valid quiz score (0-100) or leave blank.');
      return;
    }
    if (quizScore < 0 || quizScore > 100) {
      toast.error('Please enter a valid quiz score (0-100).');
      return;
    }

    if (!engagementScore && engagementScore !== 0) {
      toast.error('Please enter a valid engagement score (0-100) or leave blank.');
      return;
    }
    if (engagementScore < 0 || engagementScore > 100) {
      toast.error('Please enter a valid engagement score (0-100).');
      return;
    }

    if (!assignmentGrade && assignmentGrade !== 0) {
      toast.error('Please enter a valid assignment grade (0-100) or leave blank.');
      return;
    }
    if (assignmentGrade < 0 || assignmentGrade > 100) {
      toast.error('Please enter a valid assignment grade (0-100).');
      return;
    }

    if (selectedCourse) {
      try {
        const response = await fetch(`http://localhost:5000/api/enrolled-courses/update-progress/${selectedCourse.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            progress: newProgress,
            quiz_score: quizScore,
            engagement_score: engagementScore,
            assignment_grade: assignmentGrade,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update progress');
        }

        // Update the course data in the state directly
        setEnrolledCourses((prevCourses) =>
          prevCourses.map((course) =>
            course.id === selectedCourse.id
              ? {
                  ...course,
                  progress: newProgress,
                  quiz_score: quizScore,
                  engagement_score: engagementScore,
                  assignment_grade: assignmentGrade,
                }
              : course
          )
        );

        handleDialogClose(); // Close dialog on success
        toast.success('Progress updated successfully!'); // Display success message
      } catch (error) {
        toast.error(error.message); // Display error using toast
      }
    }
  };

  if (loading) {
    return <p>Loading enrolled courses...</p>;
  }

  return (
    <div className="mt-6 p-4">
      <h3 className="text-2xl font-bold mb-4">Enrolled Courses</h3>
      {enrolledCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {enrolledCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer"
              onClick={() => handleCardClick(course)}
            >
              <img
                src={course.course.image || 'https://via.placeholder.com/300'}
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
              <label htmlFor="progress" className="block mb-2 text-gray-700">Progress (%)</label>
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
              <label htmlFor="quizScore" className="block mb-2 text-gray-700">Quiz Score</label>
              <input
                id="quizScore"
                type="number"
                value={quizScore}
                onChange={(e) => setQuizScore(e.target.value)}
                className="border border-gray-300 p-2 rounded w-full mb-4"
              />
              <label htmlFor="engagementScore" className="block mb-2 text-gray-700">Engagement Score</label>
              <input
                id="engagementScore"
                type="number"
                value={engagementScore}
                onChange={(e) => setEngagementScore(e.target.value)}
                className="border border-gray-300 p-2 rounded w-full mb-4"
              />
              <label htmlFor="assignmentGrade" className="block mb-2 text-gray-700">Assignment Grade</label>
              <input
                id="assignmentGrade"
                type="number"
                value={assignmentGrade}
                onChange={(e) => setAssignmentGrade(e.target.value)}
                className="border border-gray-300 p-2 rounded w-full mb-4"
              />
          
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleDialogClose}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick />
    </div>
  );
};

export default EnrolledCourses;
