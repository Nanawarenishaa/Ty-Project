import React from "react";

import Sidebar from "./components/Sidebar"; // Import Sidebar
import Login from "./pages/Login";
import Signup from "./pages/Signup";
 
import Logout from "./pages/Logout";
import Dashboard from "./pages/Dashborad";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar /> {/* Sidebar is always present */}
        <div className="content"> {/* This holds the page content */}
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
