import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';

const EmployeeTable = () => {
    const [employees, setEmployees] = useState([]);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/employee'); // Adjust the API endpoint
                setEmployees(response.data);
            } catch (error) {
                console.error("Error fetching employees:", error);
            }
        };

        fetchEmployees();
    }, []);

    const handleEmployeeClick = (id) => {
        navigate(`/dashboard/employee-performance/${id}`); // Navigate to the employee profile using the correct route
    };

    return (
        <div className="overflow-x-auto mt-4">
            <h1 className="text-xl font-bold mb-4">Employee Performance</h1>
            <table className="min-w-full table-auto bg-white border border-gray-200 shadow-md rounded-lg">
                <thead className="bg-blue-600 text-white">
                    <tr>
                        <th className="py-3 px-6 text-left text-sm font-semibold">Name</th>
                        <th className="py-3 px-6 text-left text-sm font-semibold">Designation</th>
                        <th className="py-3 px-6 text-left text-sm font-semibold">Overall Performance</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.length > 0 ? (
                        employees.map((employee, index) => (
                            <tr
                                key={employee.id}
                                onClick={() => handleEmployeeClick(employee.id)}
                                style={{ cursor: 'pointer' }}
                                className={`${
                                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                } hover:bg-gray-100 transition duration-150`}
                            >
                                <td className="py-4 px-6 text-sm font-medium text-gray-700">{employee.name}</td>
                                <td className="py-4 px-6 text-sm font-medium text-gray-700">{employee.designation}</td>
                                <td className="py-4 px-6 text-sm font-medium text-gray-700">
                                    {employee.performanceSummary.length > 0 ? employee.performanceSummary[0].average_rating : 'N/A'}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="py-4 px-6 text-center text-sm text-gray-500">
                                No employees available.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default EmployeeTable;
