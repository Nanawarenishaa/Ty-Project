import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import AddRecord from "./components/AddRecords"; 
import Sidebar from "./components/sidebar";
import Header from "./components/Header";
import Logout from "./components/Logout";
import StudentTeacherList from "./components/StudentTeacherList";
import ManageAttendance from "./components/ManageAttendance";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes (Login & Signup) */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        {isAuthenticated ? (
          <Route
            path="/*"
            element={
              <div className="page-container">
                <Sidebar isSidebarOpen={isSidebarOpen} />
                <div className={`main-content ${isSidebarOpen ? "sidebar-open" : ""}`}>
                  <Header toggleSidebar={toggleSidebar} />
                  <Routes> 
                    <Route path="/attendanceTable" element={<ManageAttendance />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/add-record" element={<AddRecord />} />
                    <Route path="/students-teachers" element={<StudentTeacherList />} />
                    <Route path="/logout" element={<Logout setIsAuthenticated={setIsAuthenticated} />} />
                    <Route path="*" element={<Navigate to="/dashboard" />} /> {/* Redirect unknown routes */}
                  </Routes>
                </div>
              </div>
            }
          />
        ) : (
          <Route path="*" element={<Navigate to="/" />} /> // Redirect unauthenticated users
        )}
      </Routes>
    </Router>
  );
};

export default App;
