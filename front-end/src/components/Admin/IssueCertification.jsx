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

      // Update the user list to remove the approved user
      setUsers((prevUsers) => 
        prevUsers.filter((user) => user.id !== assignmentId)
      );
      
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
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg mt-5">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-2">Employee Name</th>
              <th className="px-4 py-2">Course Name</th>
              <th className="px-4 py-2">Learning Path</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-100">
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
                  ) : null /* No view certificate or certified text needed */
                  }
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
