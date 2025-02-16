import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";


Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Attendance %",
        data: [85, 90, 75, 80, 95],
        backgroundColor: ["#0077b6", "#00a8e8", "#0096c7", "#005f73", "#90e0ef"],
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: "Weekly Attendance" },
    },
  };

  const handleLogout = () => {
    alert("Logged out!");
  };

  return (
    <div className="dashboard-container">
      <Sidebar onLogout={handleLogout} />
      <div className="dashboard-content">
        <Header />
        <div className="chart-container">
          <h2>Weekly Attendance Overview</h2>
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
