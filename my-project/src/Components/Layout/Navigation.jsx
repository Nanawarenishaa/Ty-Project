// src/components/Navigation.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="p-4 bg-gray-200">
      <ul className="flex space-x-4">
        <li>
          <Link to="/" className="text-blue-500 hover:underline">Student List</Link>
        </li>
        <li>
          <Link to="/attendance" className="text-blue-500 hover:underline">Attendance</Link>
        </li>
        <li>
          <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
        </li>
        <li>
          <Link to="/signup" className="text-blue-500 hover:underline">Signup</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
