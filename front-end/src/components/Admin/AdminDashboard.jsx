import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const AdminDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({});
  const [performanceData, setPerformanceData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await axios.get('http://localhost:5000/api/admin-dashboard/dashboard-stats');
        setDashboardStats(statsRes.data);

        const performanceRes = await axios.get('http://localhost:5000/api/admin-dashboard/learning-path-performance');
        setPerformanceData(performanceRes.data.performanceData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {/* Stats Cards */}
      <div style={styles.cardContainer}>
        <div style={styles.card}>
          <h4>Total Courses</h4>
          <p>{dashboardStats.totalCoursesAssigned}</p>
        </div>
        <div style={styles.card}>
          <h4>Completed Courses</h4>
          <p>{dashboardStats.totalCoursesCompleted}</p>
        </div>
        <div style={styles.card}>
          <h4>Issued Certificates</h4>
          <p>{dashboardStats.totalCertificatesIssued}</p>
        </div>
      </div>

      {/* Performance Chart */}
      <h3>Learning Path Performance</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={performanceData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="learningPath"
            angle={-10} // Rotate labels
            textAnchor="end" // Align text to end
            interval={0} // Show all labels
            tick={{ fontSize: 12 }} // Adjust font size
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="averageRating" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Styles
const styles = {
  cardContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '20px',
  },
  card: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    width: '30%', // Adjust width as needed
    textAlign: 'center', // Center align text
  },
};

export default AdminDashboard;
