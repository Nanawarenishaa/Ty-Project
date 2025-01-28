import React from "react";


const LogOut = ({ onLogout }) => {
  return (
    <div className="container">
      <div className="form text-center">
        <h1>Confirm Logout</h1>
        <p>Are you sure you want to log out?</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
          <button
            className="button-secondary"
            onClick={() => window.history.back()}
          >
            Cancel
          </button>
          <button className="button-danger" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogOut;
