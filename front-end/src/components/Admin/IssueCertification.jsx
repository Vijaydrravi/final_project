import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const IssueCertification = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch users eligible for certification
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/certifications/issue-certification');
        setUsers(response.data.users);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch eligible users.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleApprove = async (assignmentId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/certifications/approve/${assignmentId}`);
      toast.success("Certification approved successfully!");

      // Update the user with the new certification data
      const updatedUser = {
        ...users.find((user) => user.id === assignmentId),
        certificates: { ...response.data.certification } // Add the newly generated certificate data
      };

      setUsers((prevUsers) => 
        prevUsers.map((user) => (user.id === assignmentId ? updatedUser : user))
      ); // Update the specific user with the new data
      
    } catch (error) {
      console.error("Error approving certificate:", error);
      toast.error("Failed to approve certification.");
    }
  };

  return (
    <div className="p-6">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Issue Certificates</h1>
      {loading ? (
        <p>Loading...</p>
      ) : users.length === 0 ? (
        <p>No users are eligible for certification.</p>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2">Employee Name</th>
              <th className="px-4 py-2">Course Name</th>
              <th className="px-4 py-2">Learning Path</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="border px-4 py-2">{user.user.name}</td>
                <td className="border px-4 py-2">{user.course.title}</td>
                <td className="border px-4 py-2">
                  {user.course.learningPaths.map((lp) => lp.learningPath.title).join(', ')}
                </td>
                <td className="border px-4 py-2">
                  {!user.certificates.is_certified ? (
                    <button
                      onClick={() => handleApprove(user.id)}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Approve
                    </button>
                  ) : (
                    <span className="text-green-600">
                      Certified
                      <a href={user.certificates.image} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500">View Certificate</a>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default IssueCertification;
