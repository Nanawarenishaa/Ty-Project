import React from "react";
import { useNavigate } from "react-router-dom";

const AttendanceList = () => {
  const navigate = useNavigate();

  const attendanceData = [
    { id: 1, name: "TYbca[A]", date: "2025-02-01", role: "Student" },
    { id: 2, name: "TYbca[B]", date: "2025-02-01", role: "Student" },
    { id: 3, name: "SYbca[c]", date: "2025-02-01", role: "Student" },
    { id: 4, name: "SYbca[D]", date: "2025-02-01", role: "Student" },
  ];

  // Function to navigate to ViewAttendance with the relevant attendance data
  const handleViewAttendance = (attendance) => {
    navigate("/view-attendance", { state: { attendance } });
  };

  return (
    <div className="attendance-list-container">
      <h1 className="title">Attendance Records by Date</h1>

      <table className="attendance-table">
        <thead>
          <tr>
            <th>Attendance Name</th>
            <th>Date</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.map((attendance) => (
            <tr key={attendance.id}>
              <td>{attendance.name}</td>
              <td>{attendance.date}</td>
              <td>{attendance.role}</td>
              <td>
                <button
                  className="Att-List-Btn"
                  onClick={() => handleViewAttendance(attendance)}
                >
                  View
                </button>
                <button
                  className="Att-List-Btn"
                  onClick={() => alert(`Deleting record for ${attendance.name}`)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="button-group">
        <button
          onClick={() => navigate("/attendance")}
          className="secondary-button"
        >
          Back to Attendance Page
        </button>
      </div>
    </div>
  );
};

export default AttendanceList;
