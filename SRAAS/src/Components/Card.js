import React from "react";

const Card = ({ title, value }) => {
  return (
    <div className="card">
      <h2 className="card-title">{title}</h2>
      <p className="card-value">{value}</p>
    </div>
  );
};

export default Card;
