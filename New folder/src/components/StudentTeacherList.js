import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentTeacherList = () => {
  const [view, setView] = useState("student");
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedClass, setSelectedClass] = useState("FYBCA"); // Default selected class

  // Fetch Students
  useEffect(() => {
    axios.get("http://localhost:5000/api/student")
      .then((response) => setStudents(response.data))
      .catch((error) => console.error("Error fetching students:", error));
  }, []);

  // Fetch Teachers
  useEffect(() => {
    axios.get("http://localhost:5000/api/teacher")
      .then((response) => setTeachers(response.data))
      .catch((error) => console.error("Error fetching teachers:", error));
  }, []);

  // Filter students based on selected class
  const filteredStudents = students.filter(
    student => student.studentClass.toLowerCase() === selectedClass.toLowerCase()
  );
  


  console.log("Selected Class:", selectedClass);
  console.log("Filtered Students:", filteredStudents);

  return (
    <div className="Records_container">
      <h1 className="heading">School Record and Attendance System</h1>
      <div className="button-group">
        <button onClick={() => setView("student")}>View Students</button>
        <button onClick={() => setView("teacher")}>View Teachers</button>
      </div>

      {/* Students Table */}
      {view === "student" && (
        <div className="student-section">
          <h2>Students</h2>

          {/* Dropdown to select class */}
          <label htmlFor="classFilter">Select Class: </label>
          <select id="classFilter" onChange={(e) => setSelectedClass(e.target.value)} value={selectedClass}>
          <option value="FYBCA">FYBCA</option>
            <option value="SYBCA">SYBCA</option>
            <option value="TYBCA">TYBCA</option>
          </select>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Custom ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Class</th>
                  <th>Course</th>
                  <th>Image</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.studentID}>
                      <td>{student.studentID}</td>
                      <td>{student.custom_studentID}</td>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.phone}</td>
                      <td>{student.studentClass}</td>{/* ✅ Fixed field */}
                      <td>{student.course}</td>
                      <td>
                        {student.image ? (
                          <img src={student.image} alt={student.name} style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
                        ) : (
                          "No Image"
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">No students found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Teachers Table */}
      {view === "teacher" && (
        <div className="teacher-section">
          <h2>Teachers</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Teacher ID</th>
                  <th>Custom ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Course</th>
                  <th>Joining Date</th>
                </tr>
              </thead>
              <tbody>
                {teachers.length > 0 ? (
                  teachers.map((teacher) => (
                    <tr key={teacher.ID}>
                      <td>{teacher.ID}</td>
                      <td>{teacher.custom_teacherID}</td>
                      <td>{teacher.name}</td>
                      <td>{teacher.email}</td>
                      <td>{teacher.phone}</td>
                      <td>{teacher.course}</td>
                      <td>{teacher.joining_date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No teachers found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentTeacherList;
