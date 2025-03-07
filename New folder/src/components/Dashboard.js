import React from "react";

import { Bar } from "react-chartjs-2";
import "chart.js/auto";


const Dashboard = () => {
  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Attendance %",
        data: [80, 70, 85, 90, 75],
        backgroundColor: "#7A33C9",
      },
    ],
  };
  return (
    <div className="dashboard-container">
      <div className="main-content">
      <h2>Dashboard</h2>
     
     
        {/* Dashboard Stats */}
        <div className="dashboard-cards">
          <div className="card">
            <p>Total Teachers</p>
            <h2>15</h2>
          </div>
          <div className="card">
            <p>Avg Attendance %</p>
            <h2>87%</h2>
          </div>
          <div className="card">
            <p>Notifications</p>
            <h2 className="highlight">3 Pending</h2>
          </div>
        </div>

        
          {/* Chart */}
          <div className="chart-container">
            <h3>Attendance Overview</h3>
            <Bar data={chartData} />
          </div>
      </div>
    </div>
  );
};

export default Dashboard;
