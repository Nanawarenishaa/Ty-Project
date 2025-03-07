import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Logout = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token"); // ✅ Remove the token
    setIsAuthenticated(false); // ✅ Update authentication state
    navigate("/login"); // ✅ Redirect to login page
  };

  return (
    <div className="logout-container">
      <button onClick={() => setShowConfirmation(true)} className="logout-btn">
        Logout
      </button>

      {showConfirmation && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirm Logout</h2>
            <p>Are you sure you want to log out?</p>
            <div className="modal-buttons">
              <button onClick={handleLogout} className="confirm-btn">Yes, Logout</button>
              <button onClick={() => setShowConfirmation(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logout;
