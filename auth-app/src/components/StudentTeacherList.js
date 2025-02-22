import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For redirection

const StudentTeacherList = () => {
  const [view, setView] = useState("students");
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const navigate = useNavigate(); // For navigation


  // Fetch Students
  useEffect(() => {
    axios.get("http://localhost:5000/api/students")
      .then((response) => setStudents(response.data))
      .catch((error) => console.error("Error fetching students:", error));
  }, []);

  // Fetch Teachers
  useEffect(() => {
    axios.get("http://localhost:5000/api/teachers")
      .then((response) => setTeachers(response.data))
      .catch((error) => console.error("Error fetching teachers:", error));
  }, []);
  
  const deleteStudent = async (id) => {
    if (!id) {
        console.error("Student ID is missing!");
        return;
    }

    try {
        const response = await axios.delete(`http://localhost:5000/students/${id}`); // Adjust the URL based on your backend

        if (response.status === 200) {
            setStudents((prevStudents) => prevStudents.filter(student => student.id !== id));
            console.log("Student deleted successfully.");
        } else {
            console.error("Failed to delete student.");
        }
    } catch (error) {
        console.error("Error deleting student:", error);
    }
};

    
const deleteTeacher = async (id) => {
    if (!id) {
        console.error("Teacher ID is missing!");
        return;
    }

    try {
        const response = await axios.delete(`http://localhost:5000/teachers/${id}`); // Adjust the URL based on your backend

        if (response.status === 200) {
            setTeachers((prevTeachers) => prevTeachers.filter(teacher => teacher.id !== id));
            console.log("Teacher deleted successfully.");
        } else {
            console.error("Failed to delete teacher.");
        }
    } catch (error) {
        console.error("Error deleting teacher:", error);
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
        <button onClick={() => setView("students")}>View Students</button>
        <button onClick={() => setView("teachers")}>View Teachers</button>
      </div>

      {/* Students Table */}
      {view === "students" && (
        <div className="students-section">
          <h2>Students</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>StudentID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Course</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((student) => (
                    <tr key={student.id}>
                      <td>{student.id}</td>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.phone}</td>
                      <td>{student.address}</td>
                      <td>{student.course}</td>
                      <td className="editDeleteBtn">
                        <button className="edit-btn" onClick={() => handleEdit(student, "students")}>Edit</button>
                        <button className="delete-btn" onClick={() => deleteStudent(student.id)}>Delete</button>

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
      {view === "teachers" && (
        <div className="teachers-section">
          <h2>Teachers</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>TeacherID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Joining Date</th>
                  <th>Address</th>
                  <th>Subject</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.length > 0 ? (
                  teachers.map((teacher) => (
                    <tr key={teacher.id}>
                      <td>{teacher.id}</td>
                      <td>{teacher.name}</td>
                      <td>{teacher.email}</td>
                      <td>{teacher.phone}</td>
                      <td>{teacher.joining_date}</td>
                      <td>{teacher.address}</td>
                      <td>{teacher.subject}</td>
                      <td className="editDeleteBtn">
                        <button className="edit-btn" onClick={() => handleEdit(teacher, "teachers")}>Edit</button>
                        <button className="delete-btn" onClick={() => deleteTeacher(teacher.id, "teachers")}>Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">No teachers found</td>
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
