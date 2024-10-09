import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';

const EmployeeTable = () => {
    const [employees, setEmployees] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [employeesPerPage, setEmployeesPerPage] = useState(10); // State for employees per page
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

    // Logic for pagination
    const indexOfLastEmployee = currentPage * employeesPerPage; // Index of the last employee
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage; // Index of the first employee
    const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee); // Get current employees

    const totalPages = Math.ceil(employees.length / employeesPerPage); // Calculate total pages

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1); // Move to the next page
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1); // Move to the previous page
        }
    };

    const handleChangeEmployeesPerPage = (e) => {
        setEmployeesPerPage(Number(e.target.value)); // Update the employees per page
        setCurrentPage(1); // Reset to the first page
    };

    return (
        <div className="overflow-x-auto mt-4">
            <h1 className="text-xl font-bold mb-4">Employee Performance</h1>
            <div className="mb-4">
                <label htmlFor="employeesPerPage" className="mr-2">Show:</label>
                <select 
                    id="employeesPerPage" 
                    value={employeesPerPage} 
                    onChange={handleChangeEmployeesPerPage}
                    className="border border-gray-300 rounded p-2"
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                </select>
                <span className="ml-2">employees per page</span>
            </div>
            <table className="min-w-full table-auto bg-white border border-gray-200 shadow-md rounded-lg">
                <thead className="bg-blue-600 text-white">
                    <tr>
                        <th className="py-3 px-6 text-left text-sm font-semibold">Name</th>
                        <th className="py-3 px-6 text-left text-sm font-semibold">Designation</th>
                        <th className="py-3 px-6 text-left text-sm font-semibold">Overall Performance</th>
                    </tr>
                </thead>
                <tbody>
                    {currentEmployees.length > 0 ? (
                        currentEmployees.map((employee, index) => (
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
            <div className="flex justify-between mt-4">
                <button onClick={handlePrevPage} disabled={currentPage === 1} className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages} className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">
                    Next
                </button>
            </div>
        </div>
    );
};

export default EmployeeTable;
