import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AssignCourse = () => {
  const [learningPaths, setLearningPaths] = useState([]);
  const [courses, setCourses] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedLearningPath, setSelectedLearningPath] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');

  // Fetch learning paths
  useEffect(() => {
    const fetchLearningPaths = async () => {
      const response = await fetch('http://localhost:5000/api/learning-paths');
      const data = await response.json();
      setLearningPaths(data);
    };
    fetchLearningPaths();
  }, []);

  // Fetch courses based on selected learning path
  useEffect(() => {
    if (selectedLearningPath) {
      const fetchCourses = async () => {
        const response = await fetch(`http://localhost:5000/api/courses/${selectedLearningPath}`);
        const data = await response.json();
        setCourses(data);
      };
      fetchCourses();
    } else {
      setCourses([]); // Reset courses when learning path is not selected
    }
  }, [selectedLearningPath]);

  // Fetch all employees
  useEffect(() => {
    const fetchEmployees = async () => {
      const response = await fetch('http://localhost:5000/api/employees');
      const data = await response.json();
      setEmployees(data);
    };
    fetchEmployees();
  }, []);

  // Handle course assignment
  const handleAssignCourse = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/api/assign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: selectedEmployee,
        courseId: selectedCourse,
      }),
    });

    if (response.ok) {
      toast.success('Course assigned successfully');
      // Reset the form fields
      setSelectedLearningPath('');
      setSelectedCourse('');
      setSelectedEmployee('');
    } else {
      const errorResponse = await response.json();
      toast.error(errorResponse.error || 'Failed to assign course');
    }
  };

  return (
    <div>
      <ToastContainer /> {/* Toast container for notifications */}
      <h1 className="text-3xl font-bold">Assign Course</h1>
      <form onSubmit={handleAssignCourse}>
        {/* Select Learning Path */}
        <div>
          <label className="block mb-2">Select Learning Path</label>
          <select
            className="border p-2 w-full"
            value={selectedLearningPath}
            onChange={(e) => setSelectedLearningPath(e.target.value)}
          >
            <option value="">Select a learning path</option>
            {learningPaths.map((lp) => (
              <option key={lp.id} value={lp.id}>
                {lp.title}
              </option>
            ))}
          </select>
        </div>

        {/* Select Course */}
        <div>
          <label className="block mb-2 mt-4">Select Course</label>
          <select
            className="border p-2 w-full"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            disabled={!selectedLearningPath}
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        {/* Select Employee */}
        <div>
          <label className="block mb-2 mt-4">Select Employee</label>
          <select
            className="border p-2 w-full"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            disabled={!selectedCourse}
          >
            <option value="">Select an employee</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>

        {/* Assign Button */}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-4">
          Assign Course
        </button>
      </form>
    </div>
  );
};

export default AssignCourse;
