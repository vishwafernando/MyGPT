import React from "react";
import "./homepage.css";
import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { useState } from "react";

const Homepage = () => {
  const [typingstatus, settypingstatus] = useState("human");

  return (
    <div className="homepage">
      <img src="/orbital.png" alt="Background" className="orbital" />
      <div className="left">
        <h1>MYGPT AI</h1>
        <h2>Your AI-powered assistant for all your needs.</h2>
        <h3>
          Experience seamless conversations and instant answers with our
          intelligent web-based chat UI. Boost productivity, get support, and
          explore new ideas—all in one place.
        </h3>
        <Link to="/dashboard">Get Started</Link>
      </div>
      <div className="right">
        <div className="imgcontainer">
          <div className="bgContainer">
            <div className="bg"></div>
          </div>
          <img src="/bot.png" alt="Hero" className="bot" />
          <div className="chat">
            <img
              src={typingstatus === "human" ? "/human1.jpeg" : "/bot.png"}
              alt="Bot"
              className="chat-img"
            />
            <TypeAnimation
              sequence={[
                "Human: Hi there!",
                2000,
                () => {
                  settypingstatus("bot");
                },
                "Bot: Hello! How can I help you?",
                2000,
                () => {
                  settypingstatus("human");
                },
                "Human: What's the weather today?",
                2000,
                () => {
                  settypingstatus("bot");
                },
                "Bot: It's sunny and warm!",
                2000,
                () => {
                  settypingstatus("human");
                },
              ]}
              wrapper="span"
              cursor={true}
              repeat={Infinity}
              omitDeletionAnimation={true}
            />
          </div>
        </div>
      </div>
      <div className="footer">
        <img src="/logo.png" alt="Logo" className="footer-logo" />
        <div className="footer-links">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
