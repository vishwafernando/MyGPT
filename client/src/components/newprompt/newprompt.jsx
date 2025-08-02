import { useEffect, useRef, useState } from "react";
import "./newprompt.css";
import Upload from "../upload/upload.jsx";
import { IKImage } from "imagekitio-react";
import model from "../../ai model/gemini.js";
import Markdown from "react-markdown";
import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const NewPrompt = ({ data, initialText = "", initialImg = "" }) => {
  // Refs must be declared first before any useEffects that use them
  const endRef = useRef(null);
  const formRef = useRef(null);
  const hasRun = useRef(false);

  const [question, setQuestion] = useState(initialText);
  const [answer, setAnswer] = useState("");
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: initialImg ? { filePath: initialImg } : {},
    aiData: {},
  });
  const [isModelThinking, setIsModelThinking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // Prevent double execution
  const [chat, setChat] = useState(null);
  const [shouldKeepAnswerVisible, setShouldKeepAnswerVisible] = useState(false);

  // Initialize chat with proper history - only once when data._id changes
  useEffect(() => {
    if (data?._id) {
      console.log('🧠 Chat setup with history:', data?.history?.length || 0, 'messages');
      const chatInstance = model.startChat({
        history: data?.history
          ? data.history.map(({ role, parts }) => ({
              role,
              parts: [{ text: parts[0].text }],
            }))
          : [],
        generationConfig: {
          // maxOutputTokens: 100,
        },
      });
      setChat(chatInstance);
      hasRun.current = false;
    }
  }, [data?._id]);

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [data, question, answer, img.dbData?.filePath, img.dbData]);

  useEffect(() => {
    if (initialText) setQuestion(initialText);
    if (initialImg)
      setImg((prev) => ({ ...prev, dbData: { filePath: initialImg } }));
  }, [initialText, initialImg]);

  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: question.length ? question : undefined,
          answer,
          img: img.dbData?.filePath || undefined,
        }),
      });
      
      const result = await response.json();
      return result;
    },
    onSuccess: () => {
      let isCleared = false;
      
      queryClient
        .invalidateQueries({ queryKey: ["chat", data._id] })
        .then(() => {
          const checkInterval = setInterval(() => {
            if (isCleared) {
              clearInterval(checkInterval);
              return;
            }
            
            const currentHistory = queryClient.getQueryData(["chat", data._id])?.history || [];
            const responseInHistory = currentHistory.some(msg => 
              msg.role === "model" && msg.parts[0].text === answer
            );
            
            if (responseInHistory) {
              isCleared = true;
              clearInterval(checkInterval);
              setQuestion("");
              setAnswer(""); 
              setIsModelThinking(false);
              setIsProcessing(false);
              setShouldKeepAnswerVisible(false);
              setImg({
                isLoading: false,
                error: "",
                dbData: {},
                aiData: {},
              });
            }
          }, 50);
          
          setTimeout(() => {
            if (!isCleared) {
              isCleared = true;
              clearInterval(checkInterval);
              setQuestion("");
              setAnswer(""); 
              setIsModelThinking(false);
              setIsProcessing(false);
              setShouldKeepAnswerVisible(false);
              setImg({
                isLoading: false,
                error: "",
                dbData: {},
                aiData: {},
              });
            }
          }, 3000);
        });
    },
    onError: (error) => {
      console.error("❌ Database save error:", error);
      console.error("❌ Failed to save message to database");
    },
  });

  const latestHistory = data?.history || [];
  const lastUserMsg =
    latestHistory.length > 0 ? latestHistory[latestHistory.length - 1] : null;
  const lastAIMsg =
    latestHistory.length > 1 ? latestHistory[latestHistory.length - 2] : null;

  const showAIAnswer = answer && answer.trim().length > 0;
  
  const answerInHistory = latestHistory.some(msg => 
    msg.role === "model" && msg.parts[0].text === answer
  );
  
  const shouldShowTempAnswer = showAIAnswer && !answerInHistory && 
    (shouldKeepAnswerVisible || mutation.isPending || isModelThinking || isProcessing);

  const showUserMsg = question && question.trim().length > 0 && 
    !latestHistory.some(msg => msg.role === "user" && msg.parts[0].text === question);

  const add = async (text) => {
    if (isProcessing) {
      return;
    }

    if (!chat) {
      return;
    }
    
    setIsProcessing(true);
    setQuestion(text);
    setIsModelThinking(true);
    setAnswer(""); 
    
    try {
      const result = await chat.sendMessageStream(
        Object.entries(img.aiData).length ? [img.aiData, text] : [text]
      );

      let streamtext = "";
      let hasContent = false;
      
      for await (const chunk of result.stream) {
        const chunkText = await chunk.text();
        streamtext += chunkText;
        setAnswer(streamtext);
        hasContent = true;
      }
      
      setAnswer(streamtext);
      setIsModelThinking(false);
      setShouldKeepAnswerVisible(true);
      
      // Log AI response status
      if (hasContent && streamtext.trim().length > 0) {
        console.log('✅ AI response received successfully - Length:', streamtext.length, 'characters');
      } else {
        console.error('❌ AI response error: Empty or no response received');
        setAnswer("Sorry, I didn't receive a proper response. Please try again.");
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      mutation.mutate();
    } catch (error) {
      console.error('❌ Error in chat:', error);
      setIsModelThinking(false);
      setAnswer("Sorry, there was an error processing your request. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (formRef.current) formRef.current.reset();
    if (!text) return;
    
    console.log('📤 User message submitted:', text);
    try {
      await add(text, false);
    } catch (error) {
      console.error('❌ Failed to send user message:', error);
    }
  };


  useEffect(() => {

    if (!hasRun.current && chat && data?.history?.length === 1 && !isProcessing && !answer) {
      const lastMessage = data.history[0];
      if (lastMessage.role === "user" && !data.history.some(msg => msg.role === "model")) {
        console.log('🎯 Auto-executing first message from dashboard:', lastMessage.parts[0].text);
        hasRun.current = true;
        setTimeout(() => {
          add(lastMessage.parts[0].text);
        }, 100);
      }
    }
  }, [chat, data?.history, isProcessing, answer]);

  return (
    <>
      {img.isLoading && <div className="">Loading...</div>}

      {img.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData?.filePath}
          width="380"
          transformation={[{ width: 380 }]}
        />
      )}

      {img.dbData?.filePath && showUserMsg && (
        <div className="message user">
          <IKImage
            urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
            path={img.dbData.filePath}
            width="380"
            transformation={[{ width: 380 }]}
          />
          {question && question !== "[image]" && (
            <span style={{ marginLeft: 8 }}>{question}</span>
          )}
        </div>
      )}
      {!img.dbData?.filePath && showUserMsg && (
        <div className="message user">{question}</div>
      )}

      {isModelThinking && !answer && (
        <div className="message model-thinking">
          <span className="typing">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </span>
        </div>
      )}

      {shouldShowTempAnswer && (
        <div className="message">
          <Markdown>{answer}</Markdown>
        </div>
      )}

      <div className="endchat" ref={endRef}></div>

      <form className="newForm" onSubmit={handleSubmit} ref={formRef}>
        <Upload setImg={setImg} />
        <input id="file" type="file" multiple={false} hidden />
        <input
          type="text"
          name="text"
          placeholder="Ask anything..."
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
        <button>
          <img src="/arrow.png" alt="" />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;
