import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

// Register the necessary components
Chart.register(...registerables);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    enrolledCourses: 0,
    completedCourses: 0,
    certifiedCourses: 0,
    totalPerformance: 0,
    performanceData: [], // Performance data for learning paths
  });

  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/dashboard/${userId}`);
        setDashboardData(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data');
      }
    };

    fetchDashboardData();
  }, [userId]);

  if (error) {
    return <div>{error}</div>;
  }

  // Pie Chart Data
  const pieChartData = {
    labels: ['Enrolled Courses', 'Completed Courses', 'Certified Courses'],
    datasets: [
      {
        label: 'Course Statistics',
        data: [
          dashboardData.enrolledCourses,
          dashboardData.completedCourses,
          dashboardData.certifiedCourses,
        ],
        backgroundColor: ['#36A2EB', '#4BC0C0', '#FF6384'],
        hoverOffset: 4,
      },
    ],
  };

  // Bar Chart Data for Course Statistics
  const barChartData = {
    labels: ['Enrolled', 'Completed', 'Certified'],
    datasets: [
      {
        label: 'Number of Courses',
        data: [
          dashboardData.enrolledCourses,
          dashboardData.completedCourses,
          dashboardData.certifiedCourses,
        ],
        backgroundColor: ['#FFCE56', '#FF6384', '#36A2EB'],
      },
    ],
  };

  // Bar Chart Data for Learning Path Performance
  const learningPathBarChartData = {
    labels: dashboardData.performanceData.map((data) => data.learningPathTitle), // Titles of Learning Paths
    datasets: [
      {
        label: 'Learning Path Performance',
        data: dashboardData.performanceData.map((data) => data.averageRating), // Average Performance Ratings
        backgroundColor: '#4BC0C0',
      },
    ],
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>

      {/* Pie Chart */}
      <div className="flex justify-center mb-8">
        <div style={{ height: '35vh', width: '35vw' }} className="border rounded-lg shadow-lg p-4 bg-white">
          <Doughnut data={pieChartData} />
        </div>
      </div>

      {/* Bar Chart for Course Statistics */}
      <div className="flex justify-center mb-8">
        <div style={{ height: '35vh', width: '35vw' }} className="border rounded-lg shadow-lg p-4 bg-white">
          <Bar data={barChartData} options={{ responsive: true }} />
        </div>
      </div>

      {/* Bar Chart for Learning Path Performance */}
      <div className="flex justify-center mb-8">
        <div style={{ height: '35vh', width: '35vw' }} className="border rounded-lg shadow-lg p-4 bg-white">
          <Bar data={learningPathBarChartData} options={{ responsive: true }} />
        </div>
      </div>

      {/* Dashboard Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {/* Enrolled Courses Card */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-700">Enrolled Courses</h3>
          <p className="text-2xl font-bold text-blue-600">{dashboardData.enrolledCourses}</p>
        </div>

        {/* Completed Courses Card */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-700">Completed Courses</h3>
          <p className="text-2xl font-bold text-green-600">{dashboardData.completedCourses}</p>
        </div>

        {/* Certified Courses Card */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-700">Certified Courses</h3>
          <p className="text-2xl font-bold text-purple-600">{dashboardData.certifiedCourses}</p>
        </div>

        {/* Total Performance Card */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-700">Total Performance</h3>
          <p className="text-2xl font-bold text-red-600">{dashboardData.totalPerformance.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
