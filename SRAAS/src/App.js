import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar";
import Dashboard from "./Components/Dashboard";
import Signup from "./Auth/Signup";
import Login from "./Auth/Login";
import LogOut from "./Auth/LogOUt";
import AddStudentTeacher from "./Management/AddStudentTeacher";
import StudentTeacherList from "./Management/StudenteacherList";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (username, password) => {
    console.log("Entered username:", username);
    console.log("Entered password:", password);
  
    if (username === "nisha" && password === "1324") {  // Use the correct test credentials
      setIsAuthenticated(true);
      localStorage.setItem("authToken", "someToken"); // store token for authentication
    } else {
      alert("Invalid credentials");
    }
  };
  useEffect(() => {
    console.log("Is authenticated:", isAuthenticated);
  }, [isAuthenticated]);

  return (
    <div className="App">
      <Header />
      <Sidebar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/logout" element={<LogOut />} />
        <Route
          path="/add-record"
          element={isAuthenticated ? <AddStudentTeacher /> : <Navigate to="/login" />}
        />
        <Route
          path="/student-teacher-list"
          element={isAuthenticated ? <StudentTeacherList /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}

export default App;
