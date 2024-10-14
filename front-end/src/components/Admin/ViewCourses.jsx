import React, { useState, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa'; // Import an edit icon from react-icons

const ViewCourses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null); // For holding selected course for editing
  const [isEditing, setIsEditing] = useState(false); // Modal visibility

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/courses');
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        setCourses(data);
        setFilteredCourses(data); // Initially set filteredCourses to all courses
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);
    
    const filtered = courses.filter(course => 
      course.title.toLowerCase().includes(searchValue)
    );
    setFilteredCourses(filtered);
  };

  const openEditModal = (course) => {
    setSelectedCourse(course);
    setIsEditing(true);
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedCourse((prevCourse) => ({
      ...prevCourse,
      [name]: value,
    }));
  };

  const handleUpdateCourse = async () => {
    // if (!selectedCourse) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/courses/${selectedCourse.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: selectedCourse.title,
          duration: parseInt(selectedCourse.duration, 10), // Ensure duration is a number
          difficulty_level: selectedCourse.difficulty_level,
        }),
      });

      // Check if the response is okay
      if (!response.ok) {
        const errorText = await response.text(); // Get the response text
        console.error('Failed to update course:', errorText);
        return; // Exit the function on error
      }

      // Try to parse the response as JSON
      const updatedCourse = await response.json();
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === updatedCourse.id ? updatedCourse : course
        )
      );
      setFilteredCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === updatedCourse.id ? updatedCourse : course
        )
      );
      handleCloseModal();
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  return (
    <div className="mt-10">
      <h3 className="text-xl font-semibold mt-6">All Courses</h3>

      {/* Search Bar */}
      <input 
        type="text" 
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search courses by title..." 
        className="border p-2 mt-4 w-full max-w-lg mb-6"
      />
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div 
              key={course.id} 
              className="bg-white rounded shadow-md p-4 relative"
            >
              {/* Course Image */}
              <img 
                src={`https://via.placeholder.com/300?text=Course+Image+${course.id}`} 
                alt={course.title}
                className="w-full h-40 object-cover rounded-t"
              />
              {/* Course Title */}
              <h4 className="font-bold text-lg mt-4 text-center">{course.title}</h4>
              {/* Course Description */}
        
              
              {/* Enrolled Members Count */}
              <p className="text-gray-500 mt-2 text-center">Enrolled Members: {course.enrolledMembers || 0}</p>
              
              {/* Edit Icon */}
              <FaEdit 
                className="absolute top-2 right-2 cursor-pointer text-blue-500" 
                onClick={() => openEditModal(course)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Modal for Editing */}
      {isEditing && selectedCourse && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-lg w-full">
            <h3 className="text-lg font-semibold mb-4">Edit Course</h3>

            <label className="block mb-2">
              Title:
              <input 
                type="text" 
                name="title" 
                value={selectedCourse.title} 
                onChange={handleInputChange} 
                className="border p-2 w-full"
              />
            </label>

            <label className="block mb-2">
              Duration (in hours):
              <input 
                type="number" 
                name="duration" 
                value={selectedCourse.duration} 
                onChange={handleInputChange} 
                className="border p-2 w-full"
              />
            </label>

            <label className="block mb-2">
              Difficulty Level:
              <input 
                type="text" 
                name="difficulty_level" 
                value={selectedCourse.difficulty_level} 
                onChange={handleInputChange} 
                className="border p-2 w-full"
              />
            </label>

            <div className="flex justify-end mt-4">
              <button 
                onClick={handleCloseModal} 
                className="bg-gray-500 text-white p-2 rounded mr-2"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateCourse} 
                className="bg-blue-500 text-white p-2 rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewCourses;
