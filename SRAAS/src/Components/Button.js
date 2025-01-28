import React from "react";

const Button = ({ text, onClick, type = "button", variant = "primary", className = "" }) => {
  const variantClass = `button-${variant}`;
  return (
    <button
      type={type}
      onClick={onClick}
      className={`button ${variantClass} ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;
