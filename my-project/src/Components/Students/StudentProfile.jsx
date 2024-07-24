import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { students as studentData } from '../../Data/students';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faShare } from '@fortawesome/free-solid-svg-icons';


const StudentProfile = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [error, setError] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [attendance, setAttendance] = useState({});
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchStudent = () => {
      try {
        const foundStudent = studentData.find((s) => s.id === parseInt(id, 10));
        if (!foundStudent) {
          throw new Error('Student not found');
        }
        setStudent(foundStudent);
        setImage(foundStudent.image); 
      } catch (error) {
        setError(error.message);
      }
    };

    const fetchAttendance = () => {
      const key = `${currentYear}-${currentMonth}`;
      const savedAttendance = JSON.parse(localStorage.getItem(`attendance-${key}`)) || {};
      setAttendance(savedAttendance);
    };

    fetchStudent();
    fetchAttendance();
  }, [id, currentMonth, currentYear]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        const updatedStudent = { ...student, image: reader.result };
        setStudent(updatedStudent);
        localStorage.setItem('studentData', JSON.stringify(studentData.map(s => s.id === student.id ? updatedStudent : s)));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    const profileData = {
      student,
      attendance,
    };
    const json = JSON.stringify(profileData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${student.name}_profile.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const profileData = {
      student,
      attendance,
    };
    const json = JSON.stringify(profileData, null, 2);
    try {
      await navigator.share({
        title: `${student.name}'s Profile`,
        text: 'Check out this student profile:',
        files: [new File([json], `${student.name}_profile.json`, { type: 'application/json' })],
      });
    } catch (error) {
      console.error('Error sharing profile:', error);
    }
  };

  if (error) return <div>Error: {error}</div>;
  if (!student) return <div>Loading...</div>;

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
      <h2 className="text-2xl font-bold">{student.name}'s Profile</h2>
      <div className="mt-4 flex items-center">
      
        <img
          src={image}
          alt={student.name}
          className="w-24 h-24 rounded-full object-cover mr-4"
        />
        <div>
          <p><strong>Email:</strong> {student.email}</p>
          <p><strong>Age:</strong> {student.age}</p>
          <p><strong>Address:</strong> {student.address}</p>
          <p><strong>Phone:</strong> {student.phone}</p>
          <p><strong>Enrollment Date:</strong> {student.enrollmentDate}</p>
        </div>
      </div>
      <div className="mt-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-2"
        />
      </div>
      <h3 className="text-xl font-semibold mt-4">Grades:</h3>
      <ul>
        {student.courses.map((course, index) => (
          <li key={index}>{course.courseName}: {course.grade}</li>
        ))}
      </ul>
      <h3 className="text-xl font-semibold mt-4">Attendance for {currentMonth}/{currentYear}</h3>
      <div className="flex justify-between mb-4">
        <button onClick={goToPreviousMonth} className="px-4 py-2 bg-blue-500 text-white rounded">Previous</button>
        <button onClick={goToNextMonth} className="px-4 py-2 bg-blue-500 text-white rounded">Next</button>
      </div>
      <table className="min-w-full bg-white border-collapse">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Day</th>
            {daysArray.map((day) => (
              <th key={day} className="py-2 px-4 border">{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-2 px-4 border">{student.name}</td>
            {daysArray.map((day) => (
              <td key={day} className={`py-2 px-4 border ${attendance[`${student.id}-${day}`] ? 'checkbox-red' : 'checkbox-green'}`}>
                <input
                  type="checkbox"
                  checked={attendance[`${student.id}-${day}`] || false}
                  readOnly
                  className="cursor-pointer"
                />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <div className="mt-4 flex space-x-4">
        <button onClick={handleDownload} className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center">
          <FontAwesomeIcon icon={faDownload} />
        </button>
        {navigator.share && (
          <button onClick={handleShare} className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faShare} />
          </button>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;










