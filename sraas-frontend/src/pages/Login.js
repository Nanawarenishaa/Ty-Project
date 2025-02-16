import { useState } from "react";
import axios from "axios";
import Input from "../components/Input";
import Button from "../components/Button";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form reload
    try {
      const response = await axios.post("http://localhost:7080/api/login", {
        username,
        password,
    });
    

      if (response.data.status === "success") {
        setMessage("Login successful!");
        // Redirect to dashboard (optional)
        window.location.href = "/dashboard";
      } else {
        setMessage("Invalid username or password");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Server error. Try again later.");
    }
  };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
            <h2>Login</h2>
                <Input  type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                <Input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                <Button type="submit" text={"Login"} />
            </form>
            <p>{message}</p>
        </div>
    );
}

export default Login;
