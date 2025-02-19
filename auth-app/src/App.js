import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Sidebar from "./components/sidebar";
import Header from "./components/Header";
import Logout from "./components/Logout";

const App = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <Router>
      <div className="page-container">
        {/* Sidebar with state */}
        <Sidebar isSidebarOpen={isSidebarOpen} />
        
        <div className={`main-content ${isSidebarOpen ? "sidebar-open" : ""}`}>
          <Header toggleSidebar={toggleSidebar} />

          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
