// AssignCourse.js
import React from 'react';

const AssignCourse = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold">Assign Course</h1>
      {/* Form for assigning a course can go here */}
      <form>
        <div>
          <label className="block mb-2">Select Course</label>
          <select className="border p-2 w-full">
            <option>Select a course</option>
            {/* Add course options dynamically here */}
          </select>
        </div>
        <div>
          <label className="block mb-2">Select User</label>
          <select className="border p-2 w-full">
            <option>Select a user</option>
            {/* Add user options dynamically here */}
          </select>
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-4">
          Assign Course
        </button>
      </form>
    </div>
  );
};

export default AssignCourse;
