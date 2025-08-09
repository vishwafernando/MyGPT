import React, { useEffect, useState } from "react";
import "./homepage.css";
import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { useAuth } from "@clerk/clerk-react";
import DarkVeil from "../Backgrounds/DarkVeil";
import Carousel from "./Carousel/Carousel";

const Homepage = () => {
  const { isSignedIn } = useAuth();
  const [carouselWidth, setCarouselWidth] = useState(500);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const computeWidth = () => {
      const viewportWidth = window.innerWidth || 500;
      const maxAllowed = 500;
      const gutter = viewportWidth <= 768 ? 48 : 96; 
      const safeWidth = Math.max(300, viewportWidth - gutter);
      setCarouselWidth(Math.min(maxAllowed, safeWidth));
    };
    computeWidth();
    window.addEventListener("resize", computeWidth);
    return () => window.removeEventListener("resize", computeWidth);
  }, []);
  return (
    <div className="homepage">
      <div className="darkveil-bg">
        <DarkVeil
          hueShift={0}
          noiseIntensity={0.0}
          scanlineIntensity={0}
          speed={1.7}
          scanlineFrequency={2.5}
          warpAmount={0.4}
          resolutionScale={1.2}
        />
      </div>
      <div className="hero-container">
        <div className="hero-left">
          <h1>MYGPT AI</h1>
          <h2>Your Intelligent AI Assistant for Every Need</h2>
          <p>
            Experience seamless conversations, instant answers, and creative
            solutions with our cutting-edge AI platform. Boost productivity, get
            expert support, and explore limitless possibilities.
          </p>
          <div className="hero-buttons">
            {isSignedIn ? (
              <Link to="/dashboard" className="primary-btn">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/sign-up" className="primary-btn">
                  Get Started Free
                </Link>
                <Link to="/sign-in" className="secondary-btn">
                  Sign In
                </Link>
              </>
            )}
          </div>
          <div className="typing-animation">
            <TypeAnimation
              sequence={[
                "Chat with AI instantly",
                2000,
                "Generate code effortlessly",
                2000,
                "Create content seamlessly",
                2000,
                "Solve problems intelligently",
                2000,
              ]}
              wrapper="span"
              speed={50}
              style={{
                fontSize: "1.2em",
                display: "inline-block",
                color: "#94a3b8",
              }}
              repeat={Infinity}
            />
          </div>
        </div>
        <div className="hero-right">
          <Carousel
            baseWidth={carouselWidth}
            autoplay={true}
            autoplayDelay={2000}
            pauseOnHover={true}
            loop={true}
            round={false}
          />
        </div>
      </div>
      <footer className="homepage-footer">
        <p>© {currentYear} MyGPT. Built by Vishwa Fernando.</p>
      </footer>
    </div>
  );
};

export default Homepage;
