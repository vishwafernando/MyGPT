import React, { useEffect, useState, useRef } from "react";
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
  const location = useLocation();
  const path = location.pathname;
  const chatId = path.split("/").pop();

  const initialText = location.state?.initialText || "";
  const initialImg = location.state?.initialImg || "";
  const { getToken } = useAuth();

  const { isPending, error, data } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
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
      return res.json();
    },
  });

  return (
    <div className="chatPage">
      <div className="wrapper">
        <div className="chat">
          {isPending
            ? "Loading..."
            : error
            ? "Something went wrong!"
            : data?.history?.map((message, i) => (
                <React.Fragment key={message._id || i}>
                  {message.img && (
                    <IKImage
                      urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                      path={message.img}
                      height="300"
                      width="400"
                      transformation={[{ height: 300, width: 400 }]}
                      loading="lazy"
                      lqip={{ active: true, quality: 20 }}
                    />
                  )}
                  <div
                    className={
                      message.role === "user" ? "message user" : "message"
                    }
                  >
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
    </div>
  );
};

export default Chatpage;
