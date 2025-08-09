import React from "react";
import "./LoadingScreen.css";
import { Mosaic } from "react-loading-indicators";

const LoadingScreen = ({ message }) => {
  return (
    <div className="loading-screen">
      {/* Animated background elements */}
      <div className="bg-animation">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
      </div>
      {/* Main content */}
      <div className="loading-content">
        {/* Logo or brand name */}
        <div className="brand-container">
          <h1 className="brand-title">MyGPT</h1>
          <div className="brand-underline"></div>
        </div>
        {/* Loading indicator */}
        <div className="loader-container">
          <Mosaic
            color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]}
            size="large"
            text=""
            textColor=""
          />
        </div>
        {/* Loading text with animation */}
        <div className="loading-text-container">
          <p className="loading-text">
            {message ? message : "Initializing AI Assistant"}
          </p>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        {/* Progress indicator */}
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
        </div>
      </div>
      {/* Footer for the site */}
      <div className="loading-footer">
        <p>&copy; {new Date().getFullYear()} MyGPT. Built by Vishwa Fernando.</p>
      </div>
    </div>
  );
};

export default LoadingScreen;