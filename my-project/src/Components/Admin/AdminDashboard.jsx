import React from 'react';
import StudentList from '../Students/StudentList';
import Attendance from '../Students/Attendance';

const AdminDashboard = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <StudentList />
      <Attendance />
    </div>
  );
};

export default AdminDashboard;
