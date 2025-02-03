import React, { useState } from "react";

const StudenteacherList = () => {
  const [view, setView] = useState("students");

  const students = [
    { id: 1, name: "Alice Johnson", role: "Student", email: "alice@example.com", phone: "123-456-7890", dob: "2005-08-12", address: "123 Main St", course: "Computer Science", status: "Present" },
    { id: 2, name: "Bob Smith", role: "Student", email: "bob@example.com", phone: "987-654-3210", dob: "2004-05-22", address: "456 Oak St", course: "Mathematics", status: "Absent" },
    { id: 38, name: "Nisha Nanaware", role: "Student", email: "nsnanaware@gmail.com", phone: "321-654-3210", dob: "2004-07-31", address: "123 Oak St", course: "BCA", status: "Present" },
  ];

  const teachers = [
    { id: 101, name: "Dr. John Doe", role: "Teacher", email: "johndoe@example.com", phone: "555-234-5678", dob: "1980-02-15", address: "789 Pine St", subject: "Physics", status: "Present" },
    { id: 102, name: "Ms. Emily White", role: "Teacher", email: "emilyw@example.com", phone: "555-678-1234", dob: "1985-09-10", address: "321 Elm St", subject: "Chemistry", status: "Absent" },
  ];

  return (
    <div className="Records_container">
    <h1 className="heading">School Record and Attendance System</h1>
    <div className="button-group">
      <button onClick={() => setView("students")}>View Students</button>
      <button onClick={() => setView("teachers")}>View Teachers</button>
    </div>
  
    {view === "students" && (
      <div className="students-section">
        <h2>Students</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Date of Birth</th>
                <th>Address</th>
                <th>Course</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.phone}</td>
                  <td>{student.dob}</td>
                  <td>{student.address}</td>
                  <td>{student.course}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
  
    {view === "teachers" && (
      <div className="teachers-section">
        <h2>Teachers</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Date of Birth</th>
                <th>Address</th>
                <th>Subject</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td>{teacher.id}</td>
                  <td>{teacher.name}</td>
                  <td>{teacher.email}</td>
                  <td>{teacher.phone}</td>
                  <td>{teacher.dob}</td>
                  <td>{teacher.address}</td>
                  <td>{teacher.subject}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
  
  );
};

export default StudenteacherList;
