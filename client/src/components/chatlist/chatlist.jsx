import React from "react";
import { Link } from "react-router-dom";
import "./chatlist.css";
import { useQuery } from "@tanstack/react-query";
import { useAuth, UserButton } from "@clerk/clerk-react";

const ChatList = ({ selectedChatId }) => {
  const { getToken } = useAuth();
  const { isPending, data, error } = useQuery({
    queryKey: ["repoData"],
    queryFn: async () => {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/userchats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.json();
    },
  });

  const sortedChats = Array.isArray(data)
    ? data
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
    : [];

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    );
  };

  return (
    <div className="chatList">
      <div className="chatlist-header">
        <Link to="/" className="chatlist-brand">
          <img src="/logo.png" alt="MyGPT AI" className="chatlist-logo" />
          <span className="chatlist-title">MyGPT AI</span>
        </Link>
      </div>
      <span className="title">DASHBOARD</span>
      <Link to="/dashboard">Create a new Chat</Link>
      <Link to="/">Explore MYGPT</Link>
      <Link to="/">Contact</Link>
      <hr />
      <span className="title">RECENT CHATS</span>
      <div className="list">
        {isPending
          ? "Loading..."
          : error
          ? "Error loading chats"
          : sortedChats?.map((chat) => (
              <Link
                to={`/dashboard/chats/${chat._id}`}
                key={chat._id}
                className={selectedChatId === chat._id ? "selected" : ""}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <span>{chat.title || "Untitled Chat"}</span>
                {chat.createdAt && (
                  <span style={{ fontSize: "0.8em", color: "#888" }}>
                    {formatDateTime(chat.createdAt)}
                  </span>
                )}
              </Link>
            ))}
      </div>
      <hr />
      <div className="upgrade">
        <div className="left-section">
          <div className="texts">
            <span>Upgrade to MYGPT Pro</span>
            <span>Get unlimited access to all features</span>
          </div>
        </div>
        <div className="user-section desktop-only">
          <UserButton />
        </div>
      </div>
    </div>
  );
};

export default ChatList;
