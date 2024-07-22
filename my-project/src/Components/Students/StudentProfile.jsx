import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { students as studentData } from '../../Data/students';

const StudentProfile = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    // Fetch student data based on ID
    const fetchStudent = () => {
      try {
        const foundStudent = studentData.find((s) => s.id === parseInt(id, 10));
        if (!foundStudent) {
          throw new Error('Student not found');
        }
        setStudent(foundStudent);
        setImage(foundStudent.image || null); // Set image if available
      } catch (error) {
        setError(error.message);
      }
    };

    fetchStudent();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        // Update student data with the new image URL
        // In a real app, you would also save this to a server
        // Optionally update studentData or a backend here
      };
      reader.readAsDataURL(file);
    }
  };

  if (error) return <div>Error: {error}</div>;
  if (!student) return <div>Loading...</div>;

  const daysInMonth = (month, year) => new Date(year, month, 0).getDate();
  const currentMonth = new Date().getMonth() + 1; // Month is 1-indexed
  const currentYear = new Date().getFullYear();
  const daysArray = Array.from({ length: daysInMonth(currentMonth, currentYear) }, (_, i) => i + 1);

  return (
    <div>
      <h2 className="text-2xl font-bold">{student.name}'s Profile</h2>
      <div className="mt-4">
        <p><strong>Email:</strong> {student.email}</p>
        <p><strong>Age:</strong> {student.age}</p>
        <p><strong>Address:</strong> {student.address}</p>
        <p><strong>Phone:</strong> {student.phone}</p>
        <p><strong>Enrollment Date:</strong> {student.enrollmentDate}</p>
        <h3 className="text-xl font-semibold mt-4">Courses</h3>
        <ul>
          {student.courses.map((course, index) => (
            <li key={index}>{course.courseName}: {course.grade}</li>
          ))}
        </ul>
        <h3 className="text-xl font-semibold mt-4">Attendance for {currentMonth}/{currentYear}</h3>
        <table className="min-w-full bg-white">
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
              {daysArray.map((day, index) => (
                <td key={index} className={`py-2 px-4 border ${student.attendance && student.attendance[index] && student.attendance[index].status === 'Absent' ? 'bg-red-500' : 'bg-green-500'}`}>
                  <input
                    type="checkbox"
                    checked={student.attendance && student.attendance[index] && student.attendance[index].status === 'Absent'}
                    readOnly
                    className="cursor-pointer"
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        <h3 className="text-xl font-semibold mt-4">Profile Image</h3>
        <div className="relative">
          {image && <img src={image} alt="Profile" className="w-32 h-32 object-cover" />}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="absolute inset-0 opacity-0"
            id="uploadImage"
          />
          <label
            htmlFor="uploadImage"
            className="absolute inset-0 bg-gray-500 bg-opacity-30 flex justify-center items-center cursor-pointer"
          >
            <span className="text-black text-lg">Add Image</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
