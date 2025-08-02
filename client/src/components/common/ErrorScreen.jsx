import React from "react";
import "./ErrorScreen.css";
import { useNavigate } from "react-router-dom";

const ErrorScreen = ({ message = "Something went wrong!" }) => {
  const navigate = useNavigate();
  return (
    <div className="error-screen">
      <div className="error-icon">⚠️</div>
      <h2>{message}</h2>
      <button onClick={() => navigate("/")}>Go Home</button>
    </div>
  );
};

export default ErrorScreen;
