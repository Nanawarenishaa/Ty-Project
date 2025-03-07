import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/login", { username, password });

      // ✅ Store token and update authentication state
      localStorage.setItem("token", res.data.token);
      setIsAuthenticated(true);

      // ✅ Redirect to dashboard immediately
      navigate("/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.message || "User not found. Please sign up.");
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
      <p className="error-message">{message}</p>

      <p className="signup-text">
        New to our platform? <a href="/signup">Sign up here</a>
      </p>
    </div>
  );
};

export default Login;
