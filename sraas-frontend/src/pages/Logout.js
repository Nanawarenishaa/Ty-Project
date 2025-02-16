import React, { useState } from "react";
import Button from "../components/Button";

const LogOut = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLogout = () => {
    setIsLoggedIn(false);
    alert("Logged out successfully!");
  };

  return (
    <div className="logout-container">
      {isLoggedIn ? (
        <div>
          <h1>Welcome</h1>
          <Button text="Log Out" onClick={handleLogout} className="danger" />
        </div>
      ) : (
        <div>
          <h1>You have been logged out</h1>
          <Button text="Log In Again" onClick={() => setIsLoggedIn(true)} />
        </div>
      )}
    </div>
  );
};

export default LogOut;
