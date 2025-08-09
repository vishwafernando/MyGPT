import React, { useState, useRef } from "react";
import "./dashboard.css";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../../components/common/LoadingScreen";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Upload from "../../components/upload/upload";

const Dashboard = () => {
  const { userId, getToken } = useAuth();
  const token = getToken();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {},
  });
  const [message, setMessage] = useState("");
  const textAreaRef = useRef(null);

  const mutation = useMutation({
    mutationFn: async ({ text, imgPath }) => {
      try {
        const token = await getToken();
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text, img: imgPath }),
        });
        if (!res.ok) throw new Error("API Error");
        return await res.json();
      } catch (e) {
        // For production, do not show actual error
        navigate("/error", { state: { message: "Something went wrong. Please try again later." } });
        throw e;
      }
    },
    onSuccess: (id, variables) => {
      queryClient.invalidateQueries({ queryKey: ["repoData"] });
      navigate(`/dashboard/chats/${id}`, {
        state: { initialText: variables.text, initialImg: variables.imgPath },
      });
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = message.trim();
    const imgPath = img.dbData?.filePath || undefined;
    if (!text && !imgPath) return;

    mutation.mutate({ text: text || "[image]", imgPath });
    setMessage("");
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
    }
  };

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen message="Loading MyGPT AI" />;
  }

  return (
    <div className="dashboard">
      <div className="texts">
        <div className="logo">
          <img src="/logo.png" alt="Logo" />
          <h1>MYGPT AI</h1>
        </div>
        <div className="options">
          <div className="option">
            <img src="/chat.png" alt="Create Chat" />
            <span>Create a New Chat</span>
          </div>
          <div className="option">
            <img src="/image.png" alt="Analyze Images" />
            <span>Analyze Images</span>
          </div>
          <div className="option">
            <img src="/code.png" alt="Help me with my Code" />
            <span>Help me with my Code</span>
          </div>
        </div>
      </div>
      <div className="formContainer">
        <form className="newChatForm" onSubmit={handleSubmit}>
          <Upload setImg={setImg} />
          <textarea
            ref={textAreaRef}
            name="text"
            placeholder="Ask anything..."
            aria-label="Message to MyGPT"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            rows="1"
            value={message}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            onChange={(e) => {
              const newValue = e.target.value;
              setMessage(newValue);
              // Auto-resize textarea
              const element = e.target;
              element.style.height = "auto";
              const scrollHeight = element.scrollHeight;
              const maxHeight = 140;
              element.style.height = Math.min(scrollHeight, maxHeight) + "px";
              element.style.overflowY = scrollHeight > maxHeight ? "scroll" : "hidden";
            }}
          />
          <button type="submit" disabled={mutation.isPending || (!message.trim() && !img.dbData?.filePath)} aria-label="Send message">
            <img src="/arrow.png" alt="Send" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
