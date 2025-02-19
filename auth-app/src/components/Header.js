import React from "react";
import { FaUserCircle, FaMoon, FaBars } from "react-icons/fa";

const Header = ({ toggleSidebar }) => {
  return (
    <header className="header">
      <FaBars className="menu-icon" onClick={toggleSidebar} title="Toggle Sidebar" />

      <h2>School Attendance System</h2>

      <div className="right-icons">
        <FaMoon className="icon" title="Dark Mode" />
        <FaUserCircle className="icon" title="Admin" />
      </div>
    </header>
  );
};

export default Header;
