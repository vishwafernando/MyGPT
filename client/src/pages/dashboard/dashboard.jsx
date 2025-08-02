import React, { useState } from "react";
import "./dashboard.css";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Upload from "../../components/upload/upload";

const Dashboard = () => {
  const { userId, getToken } = useAuth();
  const token = getToken();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {},
  });

  const mutation = useMutation({
    mutationFn: async ({ text, imgPath }) => {
      const token = await getToken();
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text, img: imgPath }),
      }).then((res) => res.json());
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
    const text = e.target.text.value;
    const imgPath = img.dbData?.filePath || undefined;
    if (!text && !imgPath) return;

    mutation.mutate({ text: text || "[image]", imgPath });
  };

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
          <input
            id="file"
            type="file"
            multiple={false}
            hidden
            onSubmit={handleSubmit}
          />
          <input
            type="text"
            name="text"
            placeholder="Ask anything..."
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <button type="submit">
            <img src="/arrow.png" alt="Send" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
