import React, { useEffect, useState, useRef } from "react";
import ErrorScreen from "../../components/common/ErrorScreen";
import { Mosaic } from "react-loading-indicators";
import "./chatpage.css";
import NewPrompt from "../../components/newprompt/newprompt";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { IKImage } from "imagekitio-react";

const Chatpage = () => {
  const handleDirectDownload = async () => {
    if (!modalImg) return;
    const imageUrl = `${import.meta.env.VITE_IMAGE_KIT_ENDPOINT}/${modalImg}`;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = modalImg.split('/').pop() || 'image.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download image.');
    }
  };
  const [modalImg, setModalImg] = useState(null);

  const handleImageClick = (imgPath) => {
    setModalImg(imgPath);
  };

  const handleCloseModal = () => {
    setModalImg(null);
  };
  const location = useLocation();
  const path = location.pathname;
  const chatId = path.split("/").pop();

  const initialText = location.state?.initialText || "";
  const initialImg = location.state?.initialImg || "";
  const { getToken } = useAuth();

  const { isPending, error, data } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      try {
        const token = await getToken();
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/chats/${chatId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error("API Error");
        return await res.json();
      } catch (e) {
        throw new Error("Something went wrong. Please try again later.");
      }
    },
  });

  if (error) {
    return <ErrorScreen message="Something went wrong. Please try again later." />;
  }
  if (isPending) {
    return (
      <div className="chat-loading-spinner">
        <Mosaic
          color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]}
          size="large"
          text=""
          textColor="#fff"
        />
        <span>Loading chat...</span>
      </div>
    );
  }
  return (
    <div className="chatPage">
      <div className="wrapper">
        <div className="chat">
          {data?.history?.map((message, i) => (
            <React.Fragment key={message._id || i}>
              <div
                className={
                  message.role === "user" ? "message user" : "message"
                }
              >
                    {message.img && message.role === "user" && (
                      <div className="message-image">
                        <IKImage
                          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                          path={message.img}
                          height="200"
                          width="300"
                          transformation={[{ height: 200, width: 300 }]}
                          loading="lazy"
                          lqip={{ active: true, quality: 20 }}
                          className="user-uploaded-image"
                          onClick={() => handleImageClick(message.img)}
                          style={{ cursor: 'pointer' }}
                        />
                      </div>
                    )}
                    {message.img && message.role !== "user" && (
                      <IKImage
                        urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                        path={message.img}
                        height="300"
                        width="400"
                        transformation={[{ height: 300, width: 400 }]}
                        loading="lazy"
                        lqip={{ active: true, quality: 20 }}
                        onClick={() => handleImageClick(message.img)}
                        style={{ cursor: 'pointer' }}
                      />
                    )}
                    {message.aiImg && message.role !== "user" && (
                      <div className="ai-generated-image">
                        <IKImage
                          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                          path={message.aiImg}
                          height="400"
                          width="400"
                          transformation={[{ height: 400, width: 400 }]}
                          loading="lazy"
                          lqip={{ active: true, quality: 20 }}
                          className="ai-generated-image"
                          onClick={() => handleImageClick(message.aiImg)}
                          style={{ cursor: 'pointer' }}
                        />
                      </div>
                    )}
                    <div className="message-text">
                      <ReactMarkdown
                        components={{
                          code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || "");
                            return !inline && match ? (
                              <SyntaxHighlighter
                                style={oneDark}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                                className="custom-syntax-highlighter"
                              >
                                {String(children).replace(/\n$/, "")}
                              </SyntaxHighlighter>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {message.parts[0].text}
                      </ReactMarkdown>
                    </div>
                  </div>
                </React.Fragment>
              ))}

          {data && (
            <NewPrompt
              data={data}
              initialText={initialText}
              initialImg={initialImg}
            />
          )}
        </div>
      </div>
      {/* fullscreen image */}
      {modalImg && (
        <div className="image-modal-overlay" onClick={handleCloseModal}>
          <div className="image-modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={handleCloseModal} aria-label="Close fullscreen image">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="14" cy="14" r="14" />
                <path d="M9 9L19 19M19 9L9 19" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <div className="modal-image-wrapper">
              <IKImage
                urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                path={modalImg}
                transformation={[{ height: 800, width: 800 }]}
                className="modal-fullscreen-image"
              />
              <button className="download-modal-btn" onClick={handleDirectDownload}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="14" cy="14" r="14" />
                  <path d="M14 8V18M14 18L10 14M14 18L18 14" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span className="download-modal-text">Download</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatpage;
