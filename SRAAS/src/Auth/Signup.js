import React, { useState } from "react";
import Button from "../Components/Button";
import Input from "../Components/Input";


const Signup = ({ onSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    onSignup(email, password);
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h1>Admin Signup</h1>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
         <Button text="Signup" type="submit" />
      </form>
    </div>
  );
};

export default Signup;
