import React, { useState } from "react";
import { FaTachometerAlt, FaUserGraduate, FaChalkboardTeacher, FaSignOutAlt, FaBars } from "react-icons/fa";


const Sidebar = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        <FaBars />
      </button>
      <ul className="sidebar-menu">
        <li>
          <FaTachometerAlt />
          {isOpen && <span>Dashboard</span>}
        </li>
        <li>
          <FaUserGraduate />
          {isOpen && <span>Students</span>}
        </li>
        <li>
          <FaChalkboardTeacher />
          {isOpen && <span>Teachers</span>}
        </li>
        <li onClick={onLogout} className="logout">
          <FaSignOutAlt />
          {isOpen && <span>Logout</span>}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
