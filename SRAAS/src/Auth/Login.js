
import React, { useState } from "react";
import Input from "../Components/Input";
import Button from "../Components/Button";



const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting", username, password);
    // Call onLogin passed from parent
    if (onLogin) {
      onLogin(username, password); // Call onLogin with username and password
    } else {
      console.error("onLogin function is not defined.");
    }
  };
  

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h1>Admin Login</h1>
        <Input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
         <Button text="Login" type="submit" />
      </form>
    </div>
  );
};

export default Login;
