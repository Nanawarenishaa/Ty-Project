import React from "react";
import { FaUserCircle } from "react-icons/fa";


const Header = () => {
  return (
    <header className="header">
      <h1 className="header-title">Attendance Dashboard</h1>
      <div className="header-user">
        <FaUserCircle className="user-icon" />
        <span>Admin</span>
      </div>
    </header>
  );
};

export default Header;
