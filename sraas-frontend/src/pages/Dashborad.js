import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import Card from "../components/Card"; // Custom Card Component
import Header from "../components/Header"; // Custom Header Component
import Sidebar from "../components/Sidebar"; // Custom Sidebar Component
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);
function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the token exists in localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      // If no token, redirect to login page
      navigate("/login");
    }
  }, [navigate]);
  const attendanceData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Attendance %",
        data: [85, 90, 75, 80, 95, 85],
        backgroundColor: "#4F46E5",
        borderColor: "#3730A3",
        borderWidth: 1,
        hoverBackgroundColor: "#6366F1",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#374151",
        },
      },
      tooltip: {
        backgroundColor: "#1F2937",
        titleColor: "#FFF",
        bodyColor: "#FFF",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#374151",
        },
      },
      y: {
        grid: {
          color: "#E5E7EB",
        },
        ticks: {
          color: "#374151",
        },
      },
    },
  };

  return (
    <div className="dashboard-page">
      <Header />
      <div className="main-container">
        <Sidebar />
        <div className="dashboard-content">
          <h1 className="dashboard-title">Dashboard</h1>

          {/* Cards Section */}
          <div className="card-container">
            <Card title="Total Students" value="120" />
            <Card title="Total Teachers" value="15" />
            <Card title="Avg Attendance %" value="87%" />
            <Card title="Notifications" value="3 Pending" />
          </div>

          {/* Chart Section */}
          <div className="chart-container">
            <h2 className="chart-title">Weekly Attendance Overview</h2>
            <div style={{ width: "100%", height: "400px" }}>
              <Bar data={attendanceData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Dashboard;
