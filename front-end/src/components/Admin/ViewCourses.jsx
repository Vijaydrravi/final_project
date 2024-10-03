import React, { useState, useEffect } from 'react';

const ViewCourses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/courses'); // Adjust the API endpoint as needed
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
            <div key={course.id} className="bg-white rounded shadow-md p-4">
              {/* Course Image */}
              <img 
                src={`https://via.placeholder.com/300?text=Course+Image+${course.id}`} 
                alt={course.title}
                className="w-full h-40 object-cover rounded-t"
              />
              {/* Course Title */}
              <h4 className="font-bold text-lg mt-4">{course.title}</h4>
              {/* Course Description */}
              <p className="text-gray-600 mt-2">{course.description || 'No description available'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewCourses;
