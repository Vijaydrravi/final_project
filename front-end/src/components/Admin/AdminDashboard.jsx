import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
Chart.register(...registerables);

const AdminDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalCoursesAssigned: 0,
    totalCoursesCompleted: 0,
    totalCertificatesIssued: 0,
  });
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await axios.get('http://localhost:5000/api/admin-dashboard/dashboard-stats');
        setDashboardStats(statsRes.data);

        const performanceRes = await axios.get('http://localhost:5000/api/admin-dashboard/learning-path-performance');
        setPerformanceData(performanceRes.data.performanceData);
      } catch (error) {
        setError('Failed to fetch data. Please try again later.');
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Stop loading after fetch completes
      }
    };

    fetchData();
  }, []);

  // Bar Chart Data for Learning Path Performance
  const learningPathBarChartData = {
    labels: performanceData.map((data) => data.learningPath), // Titles of Learning Paths
    datasets: [
      {
        label: 'Average Rating',
        data: performanceData.map((data) => data.averageRating), // Average Performance Ratings
        backgroundColor: '#4BC0C0',
        borderColor: '#36A2EB',
        borderWidth: 1,
      },
    ],
  };

  // Display loading state
  if (loading) {
    return <div className="text-center mt-8 text-gray-500">Loading dashboard data...</div>;
  }

  // Display error state
  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="mt-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-700">Total Courses Assigned</h3>
          <p className="text-2xl font-bold text-blue-600">{dashboardStats.totalCoursesAssigned}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-700">Completed Courses</h3>
          <p className="text-2xl font-bold text-green-600">{dashboardStats.totalCoursesCompleted}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-700">Issued Certificates</h3>
          <p className="text-2xl font-bold text-purple-600">{dashboardStats.totalCertificatesIssued}</p>
        </div>
      </div>

      {/* Bar Chart for Learning Path Performance */}
      <h3 className="text-xl font-bold mb-4 mt-8">Learning Path Performance</h3>
      <div className="flex justify-center mb-8">
        <div style={{ height: '75vh', width: '70vw' }} className="border rounded-lg shadow-lg p-4 bg-white">
          <Bar
            data={learningPathBarChartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: true,
                  position: 'top',
                },
                tooltip: {
                  enabled: true,
                },
              },
              scales: {
                x: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Learning Paths',
                    color: '#666',
                  },
                },
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Average Rating',
                    color: '#666',
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
