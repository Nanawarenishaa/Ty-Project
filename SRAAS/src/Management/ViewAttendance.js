import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const ViewAttendance = () => {
  const { date } = useParams();
  const navigate = useNavigate();

  const students = [
    { id: 1, name: "Alice Johnson", role: "Student", status: "Present" },
    { id: 2, name: "Bob Smith", role: "Student", status: "Absent" },
    { id: 38, name: "Nisha Nanaware", role: "Student", status: "Present" },
  ];

  const teachers = [
    { id: 101, name: "Dr. John Doe", role: "Teacher", status: "Present" },
    { id: 102, name: "Ms. Emily White", role: "Teacher", status: "Absent" },
  ];

  const handleEdit = (id, role) => {
    alert(`Editing record of ${role} with ID: ${id}`);
    // Implement edit functionality here (e.g., navigate to an edit page or open a modal)
  };

  const handleDelete = (id, role) => {
    alert(`Deleting record of ${role} with ID: ${id}`);
    // Implement delete functionality here
  };

  return (
    <div className="view-attendance-container">
      <h1 className="title">Attendance for {date}</h1>

      <div className="students-section">
        <h2>Students</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
              <th>Id</th>
                <th>Name</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                   <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.role}</td>
                  <td>{student.status}</td>
                  <td>
                    <button onClick={() => handleEdit(student.id, student.role)} className="edit-btn">Edit</button>
                    <button onClick={() => handleDelete(student.id, student.role)} className="delete-btn">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="teachers-section">
        <h2>Teachers</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td>{teacher.id}</td>
                  <td>{teacher.name}</td>
                  <td>{teacher.role}</td>
                  <td>{teacher.status}</td>
                  <td>
                    <button onClick={() => handleEdit(teacher.id, teacher.role)} className="edit-btn">Edit</button>
                    <button onClick={() => handleDelete(teacher.id, teacher.role)} className="delete-btn">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="button-group">
        <button
          onClick={() => navigate("/attendance-list")}
          className="secondary-button"
        >
          Back to Attendance List
        </button>
      </div>
    </div>
  );
};

export default ViewAttendance;
