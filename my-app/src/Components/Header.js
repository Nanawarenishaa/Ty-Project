import React from "react";


const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <h1 className="header-title">School Attendance System</h1>
        <div className="header-actions">
          <button className="dark-mode-btn">Dark Mode</button>
          <span className="admin-label">Admin</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
