import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { AuthProvider } from './Contexts/AuthContext';
import Login from './Components/Auth/Login';
import Signup from './Components/Auth/Signup';
import AdminDashboard from './Components/Admin/AdminDashboard';
import StudentProfile from './Components/Students/StudentProfile';
import Navigation from './Components/Layout/Navigation';
import AttendancePage from './Components/Attendance/AttendancePage';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <div className="container mx-auto mt-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/students/:id" element={<StudentProfile />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/" element={<AdminDashboard />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
