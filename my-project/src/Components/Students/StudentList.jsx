import React, { useState, useEffect } from 'react';
import SearchBar from '../Common/SearchBar';
import ViewRecordButton from '../Buttons/ViewRecordButton';
import { students as studentData } from '../../Data/students'; // Adjust the path as needed

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  useEffect(() => {
    // Load the student data from the imported file
    setStudents(studentData);
    setFilteredStudents(studentData);
  }, []);

  const handleSearch = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    const result = students.filter((student) =>
      student.name.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredStudents(result);
  };

  return (
    <div>
      <h2 className="text-xl font-bold">Students List</h2>
      <SearchBar onSearch={handleSearch} />
      <ul className="mt-4">
        {filteredStudents.map((student) => (
          <li key={student.id} className="py-2 border-b flex gap-10">
            <span>{student.name}</span>
            <ViewRecordButton studentId={student.id} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentList;
