import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";


const Dashboard = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [details, setDetails] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [dateRange, setDateRange] = useState(6); // Default 6 months

  // Fetch total students and teachers
  useEffect(() => {
    axios.get("http://localhost:5000/api/totalCounts")
      .then((res) => {
        setTotalStudents(res.data.totalStudents);
        setTotalTeachers(res.data.totalTeachers);
      })
      .catch((err) => console.error("Error fetching totals:", err));
  }, []);

  // Fetch attendance details based on selection
  const fetchDetails = (type) => {
    setSelectedType(type);
    axios.get(`http://localhost:5000/api/getDetails/${type}/${dateRange}`)
      .then((res) => setDetails(res.data))
      .catch((err) => console.error(`Error fetching ${type} details:`, err));
  };

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>

      {/* Dashboard Stats */}
      <div className="dashboard-cards">
        <div className="card" onClick={() => fetchDetails("student")}>
          <p>Total Students</p>
          <h2>{totalStudents}</h2>
        </div>
        <div className="card" onClick={() => fetchDetails("teacher")}>
          <p>Total Teachers</p>
          <h2>{totalTeachers}</h2>
        </div>
      </div>

      {/* Date Range Selection */}
      <div className="date-range">
        <label>Select Duration (months):</label>
        <input 
          type="number" 
          value={dateRange} 
          onChange={(e) => setDateRange(e.target.value)} 
          min="1"
        />
      </div>

      {/* Details Table */}
      {selectedType && (
        <div className="details-section">
          <h3>{selectedType === "student" ? "Student" : "Teacher"} Details</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Attendance %</th>
              </tr>
            </thead>
            <tbody>
              {details.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.attendancePercentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Attendance Chart */}
      <div className="chart-container">
        <h3>Attendance Overview</h3>
        <Bar 
          data={{
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
            datasets: [{
              label: "Attendance %",
              data: [80, 70, 85, 90, 75],
              backgroundColor: "#7A33C9",
            }],
          }} 
        />
      </div>
    </div>
  );
};

export default Dashboard;
