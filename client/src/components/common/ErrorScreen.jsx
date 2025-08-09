import React from "react";
import { useNavigate } from "react-router-dom";

const errorScreenStyles = `
.error-bg {
  background: #fff;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
@media (prefers-color-scheme: dark) {
  .error-bg {
    background: #181818;
  }
}
.error-content {
  padding: 0rem 0rem 0.5rem 0rem;
  max-width: 640px;
  margin: 0 auto;
  margin-top: -10rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.error-svg {
  width: 100%;
  max-width: 400px;
  display: flex;
  margin-bottom: 0rem;
}
.error-message {
  font-size: 2rem;
  font-weight: 700;
  color: #181818;
  margin-top: -5rem;
  margin-bottom: 0.5rem;
}
@media (prefers-color-scheme: dark) {
  .error-message {
    color: #fff;
  }
}
@media (min-width: 768px) {
  .error-message {
    font-size: 2.5rem;
  }
}
.error-desc {
  margin-bottom: 1rem;
  font-size: 1.125rem;
  font-weight: 400;
  color: #6b7280;
}
.error-btn {
  display: inline-flex;
  color: #fff;
  background: #2563eb;
  font-weight: 500;
  border-radius: 0.5rem;
  font-size: 1rem;
  padding: 0.625rem 1.25rem;
  text-align: center;
  margin-top: 1rem;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}
.error-btn:hover {
  background: #1e40af;
}
`;

if (typeof document !== "undefined" && !document.getElementById("error-screen-styles")) {
  const style = document.createElement("style");
  style.id = "error-screen-styles";
  style.innerHTML = errorScreenStyles;
  document.head.appendChild(style);
}

const ErrorScreen = ({ message = "Something's missing." }) => {
  const navigate = useNavigate();
  return (
    <section className="error-bg">
      <div className="error-content">
        <object className="error-svg" type="image/svg+xml" data="/404.svg" aria-label="404 animation" />
        <p className="error-message">{message}</p>
        <p className="error-desc">Sorry, we can't find that page. You'll find lots to explore on the home page.</p>
        <button
          className="error-btn"
          onClick={() => navigate("/")}
        >
          Back to Homepage
        </button>
      </div>
    </section>
  );
};

export default ErrorScreen;
