import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./dashboardLayout.css";
import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import ChatList from "../../components/chatlist/chatlist";
import { useLocation } from "react-router-dom";

const DashboardLayout = () => {
  const location = useLocation();
  let chatId = null;
  const match = location.pathname.match(/\/dashboard\/chats\/(.+)$/);
  if (match) chatId = match[1];

  const { userId, isLoaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !userId) {
      navigate("/sign-in");
    }
  }, [isLoaded, userId, navigate]);

  if (!isLoaded) return "Loading...";

  return (
    <div className="dashboardLayout">
      <div className="menu">
        <ChatList selectedChatId={chatId} />
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
