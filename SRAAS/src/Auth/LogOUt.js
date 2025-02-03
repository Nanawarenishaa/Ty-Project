import React, { useState } from "react";

const LogOut = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const handleLogout = () => {
    // Perform your logout logic here, like clearing sessionStorage, etc.
    setIsLoggedIn(false);
    console.log("Logged out successfully!");
  };

  const handleCancel = () => {
    setShowLogoutConfirmation(false); // Close the confirmation
  };

  return (
    <div className="container">
      {isLoggedIn ? (
        <div className="form text-center">
          <h1>Welcome</h1>
          <button onClick={() => setShowLogoutConfirmation(true)} className="button-danger">
            Log Out
          </button>
        </div>
      ) : (
        <div className="form text-center">
          <h1>You have been logged out</h1>
          <button onClick={() => setIsLoggedIn(true)} className="button-primary">
            Log In Again
          </button>
        </div>
      )}

      {showLogoutConfirmation && (
        <div className="logout-confirmation">
          <h2>Confirm Logout</h2>
          <p>Are you sure you want to log out?</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
            <button onClick={handleCancel} className="button-secondary">
              Cancel
            </button>
            <button onClick={handleLogout} className="button-danger">
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogOut;
