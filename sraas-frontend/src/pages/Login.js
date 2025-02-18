import { useState } from "react";
import axios from "axios";
import Input from "../components/Input";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form reload

    try {
      const response = await axios.post("/login", { username, password });

      if (response.data.status === "success") {
        setMessage("Login successful!");

        // Save JWT token in localStorage
        localStorage.setItem("token", response.data.token);

        // Redirect to dashboard
        navigate("/dashboard");
      } else {
        setMessage("Invalid username or password");
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
      setMessage("Server error. Try again later.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <Input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
        <Input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" text={"Login"} />
      </form>
      <p>{message}</p>
    </div>
  );
}

export default Login;
