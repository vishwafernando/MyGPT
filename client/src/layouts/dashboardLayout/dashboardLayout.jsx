import React, { useState } from "react";
import { Mosaic } from "react-loading-indicators";
import { Outlet, useNavigate } from "react-router-dom";
import "./dashboardLayout.css";
import { useEffect } from "react";
import { useAuth, UserButton } from "@clerk/clerk-react";
import ChatList from "../../components/chatlist/chatlist";
import { useLocation } from "react-router-dom";

const DashboardLayout = () => {
  const location = useLocation();
  let chatId = null;
  const match = location.pathname.match(/\/dashboard\/chats\/(.+)$/);
  if (match) chatId = match[1];

  const { userId, isLoaded } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isLoaded && !userId) {
      navigate("/sign-in");
    }
  }, [isLoaded, userId, navigate]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!isLoaded) return (
    <div className="dashboard-loading-spinner">
      <Mosaic
        color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]}
        size="large"
        text=""
        textColor="#fff"
      />
      <span>Loading dashboard...</span>
    </div>
  );

  return (
    <div className="dashboardLayout">
      {/* Mobile Header */}
      <div className="mobile-header">
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="mobile-header-title">
          <img src="/logo.png" alt="MyGPT AI" className="mobile-logo" />
          <span>MyGPT AI</span>
        </div>
        <div className="mobile-user-button">
          <UserButton />
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={toggleMobileMenu}></div>
      )}

      {/* Sidebar Menu */}
      <div className={`menu ${isMobileMenuOpen ? 'menu-open' : ''}`}>
        <ChatList selectedChatId={chatId} />
      </div>

      {/* Main Content */}
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
