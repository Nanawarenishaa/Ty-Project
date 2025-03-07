import React from "react";
import { Link } from "react-router-dom";
import { FaTachometerAlt, FaUserPlus, FaList, FaClipboardCheck, FaUserFriends, FaChartBar, FaSignOutAlt } from "react-icons/fa";

const Sidebar = ({ isSidebarOpen }) => {
  return (
    <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
      <ul>
        <li>
          <Link to="/dashboard">
            <FaTachometerAlt className="icon" /> <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/add-record">
            <FaUserPlus className="icon" /> <span>Add Records</span>
          </Link>
        </li>
        <li>
          <Link to="/attendance-list">
            <FaList className="icon" /> <span>Attendance List</span>
          </Link>
        </li>
        <li>
          <Link to="/attendanceTable">
            <FaClipboardCheck className="icon" /> <span>Manage Attendance</span>
          </Link>
        </li>
        <li>
          <Link to="/students-teachers">
            <FaUserFriends className="icon" /> <span>Student/Teacher List</span>
          </Link>
        </li>
        <li>
          <Link to="/reports">
            <FaChartBar className="icon" /> <span>Reports</span>
          </Link>
        </li>
        <li className="logout">
          <Link to="/logout">
            <FaSignOutAlt className="icon" /> <span>Logout</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
