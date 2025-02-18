import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    axios.post("http://localhost:5003/logout") // Backend call
      .then(() => {
        localStorage.removeItem("token"); // Remove JWT token
        navigate("/login"); // Redirect to login page
      })
      .catch((err) => {
        console.error("Logout failed", err);
      });
  };

  return (
    <div className="logout-container">
      <h2>Are you sure you want to log out?</h2>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
