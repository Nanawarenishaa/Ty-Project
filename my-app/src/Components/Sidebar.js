import React from "react";

const Sidebar = () => {
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
    <nav className="sidebar">
      <ul className="menu-list">
        {menuItems.map((item, index) => (
          <li key={index} className="menu-item">
            <link to={item.path} className="menu-link">
              {item.name}
            </link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
