import React from "react";
import LogOut from "../Auth/LogOUt";


const ParentComponent = () => {
  // Define the logout logic
  const handleLogout = () => {
    // Clear user session or perform logout actions here
    console.log("Logged out!");
    // Optionally, redirect the user
    // window.location.href = "/login"; // Or another page after logout
  };

  return (
    <div>
      {/* Make sure the onLogout prop is passed here */}
      <LogOut onLogout={handleLogout} />
    </div>
  );
};

export default ParentComponent;
