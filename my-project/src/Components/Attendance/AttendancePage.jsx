import React, { useState, useEffect } from 'react';
import { students as studentData } from '../../Data/students';

const AttendancePage = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1); // 1-indexed month
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    // Initialize student data
    setStudents(studentData);
    
    // Load attendance data for the current month and year from localStorage
    loadAttendanceData();
  }, [currentMonth, currentYear]);

  const loadAttendanceData = () => {
    const key = `${currentYear}-${currentMonth}`;
    const savedAttendance = JSON.parse(localStorage.getItem(`attendance-${key}`)) || {};
    setAttendance(savedAttendance);
  };

  const handleCheckboxChange = (studentId, day) => {
    const key = `${currentYear}-${currentMonth}`;
    const newAttendance = {
      ...attendance,
      [`${studentId}-${day}`]: !attendance[`${studentId}-${day}`]
    };
    setAttendance(newAttendance);
    // Save to localStorage for the current month and year
    localStorage.setItem(`attendance-${key}`, JSON.stringify(newAttendance));
  };

  const daysInMonth = (month, year) => new Date(year, month, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth(currentMonth, currentYear) }, (_, i) => i + 1);

  const goToPreviousMonth = () => {
    setCurrentMonth(prevMonth => {
      if (prevMonth === 1) {
        setCurrentYear(prevYear => prevYear - 1);
        return 12;
      }
      return prevMonth - 1;
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth(prevMonth => {
      if (prevMonth === 12) {
        setCurrentYear(prevYear => prevYear + 1);
        return 1;
      }
      return prevMonth + 1;
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold">Attendance for {currentMonth}/{currentYear}</h2>
      <div className="flex justify-between mb-4">
        <button onClick={goToPreviousMonth} className="px-4 py-2 bg-blue-500 text-white rounded">Previous</button>
        <button onClick={goToNextMonth} className="px-4 py-2 bg-blue-500 text-white rounded">Next</button>
      </div>
      <table className="min-w-full bg-white border-collapse">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Name</th>
            {daysArray.map((day) => (
              <th key={day} className="py-2 px-4 border">{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td className="py-2 px-4 border">{student.name}</td>
              {daysArray.map((day) => (
                <td key={`${student.id}-${day}`} className="py-2 px-4 border">
                  <input
                    type="checkbox"
                    checked={attendance[`${student.id}-${day}`] || false}
                    onChange={() => handleCheckboxChange(student.id, day)}
                    className={`cursor-pointer ${attendance[`${student.id}-${day}`] ? 'bg-red-500' : 'bg-green-500'}`}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendancePage;



