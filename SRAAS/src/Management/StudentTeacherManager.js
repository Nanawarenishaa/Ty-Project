import React, { useState } from "react";
import AddStudentTeacher from "./AddStudentTeacher";
import StudentTeacherList from "./StudentTeacherList";

const StudentTeacherManager = () => {
  const [records, setRecords] = useState([
    { id: "S1", name: "John Doe", role: "Student" },
    { id: "T1", name: "Jane Smith", role: "Teacher" },
  ]);

  // Function to add a new record to the list
  const addRecord = (newRecord) => {
    setRecords((prevRecords) => [...prevRecords, newRecord]);
  };

  return (
    <div>
      <AddStudentTeacher addRecord={addRecord} /> {/* Pass the function here */}
      <StudentTeacherList records={records} />
    </div>
  );
};

export default StudentTeacherManager;
