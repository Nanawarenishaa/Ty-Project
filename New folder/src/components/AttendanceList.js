import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, Edit, Trash2 } from "lucide-react";

const AttendanceList = () => {
  const [studentAttendance, setStudentAttendance] = useState([]);
  const [teacherAttendance, setTeacherAttendance] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/attendance");
      setStudentAttendance(data.filter((item) => item.attendanceType === "student"));
      setTeacherAttendance(data.filter((item) => item.attendanceType === "teacher"));
    } catch (error) {
      console.error("Error fetching attendance records:", error);
    }
  };

  const deleteAttendance = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axios.delete(`http://localhost:5000/api/attendance/${id}`);
        setStudentAttendance((prev) => prev.filter((item) => item.attendanceID !== id));
        setTeacherAttendance((prev) => prev.filter((item) => item.attendanceID !== id));
      } catch (error) {
        console.error("Error deleting attendance record:", error);
      }
    }
  };

  const renderTable = (title, data) => (
    <div className="mb-10">
      <h3 className="text-xl font-semibold mb-4 text-center">{title}</h3>
      <div className="overflow-x-auto">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>Time Up</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.attendanceID}>
                <td>{item.attendanceID}</td>
                <td>{item.attendanceName}</td>
                <td>{item.date}</td>
                <td>{item.startTime}</td>
                <td>{item.timeUp}</td>
                <td>{item.attendanceType}</td>
                <td>
                  <div className="attendance-actions">
                    <button className="attendance-btn view-btn" onClick={() => navigate(`/view-attendance/${item.attendanceID}`)}>
                      <Eye size={16} />
                    </button>
                    <button className="attendance-btn edit-btn" onClick={() => navigate(`/edit-attendance/${item.attendanceID}`)}>
                      <Edit size={16} />
                    </button>
                    <button className="attendance-btn delete-btn" onClick={() => deleteAttendance(item.attendanceID)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="attendance-container">
      <h2 className="text-2xl font-semibold mb-6 text-center">Attendance Records</h2>
      {renderTable("Student Attendance", studentAttendance)}
      {renderTable("Teacher Attendance", teacherAttendance)}
    </div>
  );
};

export default AttendanceList;
