import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";


const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Add Records", path: "/add-record" },
    { name: "Attendance List", path: "/attendance-list" },
    { name: "Manage Attendance", path: "/attendance" },
    { name: "Student/Teacher List", path: "/student-teacher-list" },
    { name: "Reports", path: "/reports" },
    { name: "Logout", path: "/logout" },
  ];

  return (
    <>
      {/* Sidebar Toggle Icon */}
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </div>

      {/* Sidebar */}
      <nav className={`sidebar ${isOpen ? "open" : ""}`}>
        <ul className="menu-list">
          {menuItems.map((item, index) => (
            <li key={index} className="menu-item">
              <Link to={item.path} className="menu-link" onClick={toggleSidebar}>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;
