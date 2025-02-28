import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For redirection

const StudentTeacherList = () => {
  const [view, setView] = useState("student");
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const navigate = useNavigate(); // For navigation

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

  // Delete Student
  const deleteStudent = async (studentID) => {
    if (!studentID) {
      console.error("❌ Student ID is missing!");
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:5000/student/${studentID}`);

      if (response.status === 200) {
        setStudents((prevStudents) => prevStudents.filter(student => student.studentID !== studentID));
        console.log("✅ Student deleted successfully.");
      } else {
        console.error("❌ Failed to delete student.");
      }
    } catch (error) {
      console.error("❌ Error deleting student:", error);
    }
  };

  // Delete Teacher
  const deleteTeacher = async (teacherID) => {
    if (!teacherID) {
      console.error("❌ Teacher ID is missing!");
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:5000/teacher/${teacherID}`);

      if (response.status === 200) {
        setTeachers((prevTeachers) => prevTeachers.filter(teacher => teacher.ID !== teacherID));
        console.log("✅ Teacher deleted successfully.");
      } else {
        console.error("❌ Failed to delete teacher.");
      }
    } catch (error) {
      console.error("❌ Error deleting teacher:", error);
    }
  };

  // Edit Record (Redirect to "Add Record" page with data)
  const handleEdit = (data, type) => {
    navigate(`/add-record`, { state: { data, type } });
  };

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
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Subject</th>
                  <th>Image</th>
                  <th>Course</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((student) => (
                    <tr key={student.studentID}>
                      <td>{student.studentID}</td>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.phone}</td>
                      <td>{student.subject || "N/A"}</td>
                      <td>
                           {student.image ? (
                            <img src={student.image} alt={student.name} style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
                             ) : (
                             "No Image"
                              )}
                        </td>
                      <td>{student.course}</td>
                      <td className="editDeleteBtn">
                        <button className="edit-btn" onClick={() => handleEdit(student, "student")}>Edit</button>
                        <button className="delete-btn" onClick={() => deleteStudent(student.studentID)}>Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No students found</td>
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
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Joining Date</th>
                  <th>Course</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.length > 0 ? (
                  teachers.map((teacher) => (
                    <tr key={teacher.ID}>
                      <td>{teacher.ID}</td>
                      <td>{teacher.name}</td>
                      <td>{teacher.email}</td>
                      <td>{teacher.phone}</td>
                      <td>{teacher.joining_date}</td>
                      <td>{teacher.course}</td>
                      <td className="editDeleteBtn">
                        <button className="edit-btn" onClick={() => handleEdit(teacher, "teacher")}>Edit</button>
                        <button className="delete-btn" onClick={() => deleteTeacher(teacher.ID)}>Delete</button>
                      </td>
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
