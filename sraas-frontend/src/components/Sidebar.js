import React, { useState } from "react";
import { FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";


const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove JWT token
    navigate("/login"); // Redirect to login immediately
  };

  return (
    <>
      {/* Sidebar Toggle Icon */}
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </div>

      {/* Sidebar Navigation */}
      <nav className={`sidebar ${isOpen ? "open" : ""}`}>
        <ul className="menu-list">
          <li className="menu-item">
            <Link to="/dashboard" className="menu-link" onClick={toggleSidebar}>Dashboard</Link>
          </li>
          <li className="menu-item">
            <Link to="/add-record" className="menu-link" onClick={toggleSidebar}>Add Records</Link>
          </li>
          <li className="menu-item">
            <Link to="/attendance-list" className="menu-link" onClick={toggleSidebar}>Attendance List</Link>
          </li>
          <li className="menu-item">
            <Link to="/attendance" className="menu-link" onClick={toggleSidebar}>Manage Attendance</Link>
          </li>
          <li className="menu-item">
            <Link to="/student-teacher-list" className="menu-link" onClick={toggleSidebar}>Student/Teacher List</Link>
          </li>
          <li className="menu-item">
            <Link to="/reports" className="menu-link" onClick={toggleSidebar}>Reports</Link>
          </li>
          <li className="menu-item">
            <Link to="/signup" className="menu-link" onClick={toggleSidebar}>Signup</Link>
          </li>
          {/* Logout Button */}
          <li className="menu-item">
            <button className="menu-link logout-btn" onClick={handleLogout}>
              <FaSignOutAlt size={18} style={{ marginRight: "8px" }} />
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;
