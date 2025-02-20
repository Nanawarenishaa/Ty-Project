import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import AddRecord from "./components/AddRecords"; // Add Record Page
import Sidebar from "./components/sidebar";
import Header from "./components/Header";
import Logout from "./components/Logout";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isAuthenticated = !!localStorage.getItem("token"); // Check login

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <Router>
      <Routes>
        {/* Show Login/Signup First */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Layout Wrapper (Header + Sidebar) */}
        {isAuthenticated && (
          <Route
            path="/*"
            element={
              <div className="page-container">
                <Sidebar isSidebarOpen={isSidebarOpen} />
                <div className={`main-content ${isSidebarOpen ? "sidebar-open" : ""}`}>
                  <Header toggleSidebar={toggleSidebar} />
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/add-record" element={<AddRecord />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="*" element={<Navigate to="/dashboard" />} /> {/* Redirect unknown routes */}
                  </Routes>
                </div>
              </div>
            }
          />
        )}
      </Routes>
    </Router>
  );
};

export default App;
