import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/signup", { username, password });
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2 seconds
    } catch (err) {
      setMessage(err.response?.data?.message || "Error signing up");
    }
  };

  return (
    <div className="container">
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Sign Up</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default Signup;
