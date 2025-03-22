import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const Dashboard = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [details, setDetails] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [dateRange, setDateRange] = useState(""); // No default value
  const [startDate, setStartDate] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch total students and teachers
  useEffect(() => {
    axios.get("http://localhost:5000/api/totalCounts")
      .then((res) => {
        setTotalStudents(res.data.totalStudents);
        setTotalTeachers(res.data.totalTeachers);
      })
      .catch((err) => console.error("Error fetching totals:", err));
  }, []);

  // Function to set the start date when the button is clicked
  const handleSetDuration = () => {
    const months = Number(dateRange); // Convert string to number
    if (!months || months <= 0) {
      alert("Please enter a valid duration in months.");
      return;
    }
    const today = new Date();
    today.setMonth(today.getMonth() - months);
    setStartDate(today.toISOString().split("T")[0]); // Correct format
  };
  

  // Fetch attendance details based on selection
  const fetchDetails = (type) => {
    if (!startDate) {
      alert("Please set the duration first.");
      return;
    }
    setSelectedType(type);
    setLoading(true); // Show loading
  
    axios.get(`http://localhost:5000/api/getDetails/${type}/${startDate}`)
      .then((res) => {
        setDetails(res.data);
        setLoading(false); // Hide loading
      })
      .catch((err) => {
        console.error(`Error fetching ${type} details:`, err);
        setLoading(false);
      });
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
        <button onClick={handleSetDuration}>Set Duration</button>
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
