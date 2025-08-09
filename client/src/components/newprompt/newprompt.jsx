import { useEffect, useRef, useState } from "react";
import "./newprompt.css";
import Upload from "../upload/upload.jsx";
import { IKImage } from "imagekitio-react";
import { textModel } from "../../ai model/geminiModels.js";
import { generateImageWithSDXL, isImageRequest } from "../../ai model/sdxlModel.js";
import ModelSelector from "../modelSelector/modelSelector.jsx";
import Markdown from "react-markdown";
import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const NewPrompt = ({ data, initialText = "", initialImg = "" }) => {
  const endRef = useRef(null);
  const formRef = useRef(null);
  const hasRun = useRef(false);

  const [question, setQuestion] = useState(initialText);
  const [currentInput, setCurrentInput] = useState(initialText);
  const [answer, setAnswer] = useState("");
  const [currentModel, setCurrentModel] = useState("gemini-text"); 
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: initialImg ? { filePath: initialImg } : {},
    aiData: {},
  });
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [aiGeneratedImg, setAiGeneratedImg] = useState("");
  const [isModelThinking, setIsModelThinking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); 
  const [chat, setChat] = useState(null);
  const [shouldKeepAnswerVisible, setShouldKeepAnswerVisible] = useState(false);
  const [submittedPreview, setSubmittedPreview] = useState({ text: "", imagePath: "" });

  useEffect(() => {
    if (data?._id) {

      if (currentModel === "gemini-text") {
        const chatInstance = textModel.startChat({
          history: data?.history
            ? data.history.map(({ role, parts }) => ({
                role,
                parts: [{ text: parts[0].text }],
              }))
            : [],
          generationConfig: {
            // maxOutputTokens: 500, 
          },
        });
        setChat(chatInstance);
      }
      hasRun.current = false;
    }
  }, [data?._id, currentModel]);

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [data, question, answer, img.dbData?.filePath, img.dbData]);

  useEffect(() => {
    if (initialText) {
      setQuestion(initialText);
      setCurrentInput(initialText);
    }
    if (initialImg)
      setImg((prev) => ({ ...prev, dbData: { filePath: initialImg } }));
  }, [initialText, initialImg]);

  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chats/${data._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            question: question.length ? question : undefined,
            answer,
            img: img.dbData?.filePath || undefined,
            aiGeneratedImg: aiGeneratedImg || undefined,
            modelUsed: currentModel, 
          }),
        }
      );

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

            const currentHistory =
              queryClient.getQueryData(["chat", data._id])?.history || [];
            const responseInHistory = currentHistory.some(
              (msg) => msg.role === "model" && msg.parts[0].text === answer
            );

            if (responseInHistory) {
              isCleared = true;
              clearInterval(checkInterval);
              setQuestion("");
              setCurrentInput("");
              setAnswer("");
              setAiGeneratedImg("");
              setIsModelThinking(false);
              setIsProcessing(false);
              setShouldKeepAnswerVisible(false);
              setImg({
                isLoading: false,
                error: "",
                dbData: {},
                aiData: {},
              });
              setHasSubmitted(false);
              setSubmittedPreview({ text: "", imagePath: "" });
            }
          }, 50);

          setTimeout(() => {
            if (!isCleared) {
              isCleared = true;
              clearInterval(checkInterval);
              setQuestion("");
              setCurrentInput("");
              setAnswer("");
              setAiGeneratedImg("");
              setIsModelThinking(false);
              setIsProcessing(false);
              setShouldKeepAnswerVisible(false);
              setImg({
                isLoading: false,
                error: "",
                dbData: {},
                aiData: {},
              });
              setHasSubmitted(false);
              setSubmittedPreview({ text: "", imagePath: "" });
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

  const isSubmittedInHistory = !!(submittedPreview.text || submittedPreview.imagePath) &&
    latestHistory.some((msg) => {
      if (msg.role !== "user") return false;
      const textMatches = submittedPreview.text
        ? msg.parts?.[0]?.text === submittedPreview.text
        : true;
      const imageMatches = submittedPreview.imagePath
        ? msg.img === submittedPreview.imagePath
        : true;
      return textMatches && imageMatches;
    });

  const showAIAnswer = answer && answer.trim().length > 0;

  const answerInHistory = latestHistory.some(
    (msg) => msg.role === "model" && msg.parts[0].text === answer
  );

  const shouldShowTempAnswer =
    showAIAnswer &&
    !answerInHistory &&
    (shouldKeepAnswerVisible ||
      mutation.isPending ||
      isModelThinking ||
      isProcessing);

  const showUserMsg =
    question &&
    question.trim().length > 0 &&
    !latestHistory.some(
      (msg) => msg.role === "user" && msg.parts[0].text === question
    );

  const handleModelChange = (model) => {
    setCurrentModel(model.id);
    
    if (model.id === "sdxl") {
      setAnswer("💡 SDXL model selected! Try asking me to generate an image using keywords like 'create an image of...' or 'draw me...'");
      setShouldKeepAnswerVisible(true);
    } else {
      setAnswer("");
      setShouldKeepAnswerVisible(false);
    }
  };

  const add = async (text) => {
    if (isProcessing) {
      return;
    }

    if (!chat && currentModel !== "sdxl") {
      return;
    }

    setIsProcessing(true);
    setQuestion(text);
    setIsModelThinking(true);
    setAnswer("");
    setAiGeneratedImg("");

    try {

      if (currentModel === "sdxl") {
        setAnswer("I'm generating a high-quality image for you using Stable Diffusion XL...");

        const result = await generateImageWithSDXL(text, getToken);

        if (result.success) {
          setAnswer("Here's the high-quality image I generated for you using Stable Diffusion XL:");
          setAiGeneratedImg(result.imagePath);
        } else {
          let displayMessage = result.message || "Sorry, there was an issue with SDXL image generation.";
          
          if (result.instructions && Array.isArray(result.instructions)) {
            displayMessage += "\n\n**To restart the SDXL image generation service:**\n\n";
            result.instructions.forEach((instruction, index) => {
              displayMessage += `${index + 1}. ${instruction}\n`;
            });
            displayMessage += "\n*This setup only needs to be done once per Kaggle session.*";
          }
          
          setAnswer(displayMessage);
          console.error("❌ SDXL: Image generation failed:", result);
        }
      }
      else if (currentModel === "gemini-text") {
        if (isImageRequest(text)) {
          setAnswer("💡 I detected you want to generate an image! Please switch to the **SDXL Image Generator** model for high-quality image generation.");
          setIsModelThinking(false);
          setShouldKeepAnswerVisible(true);
          setIsProcessing(false);
          return;
        }

        const hasImage = Object.entries(img.aiData).length > 0;
        const inputData = hasImage ? [img.aiData, text] : [text];
        const result = await chat.sendMessageStream(inputData);

        let streamtext = "";
        let hasContent = false;

        for await (const chunk of result.stream) {
          const chunkText = await chunk.text();
          streamtext += chunkText;
          setAnswer(streamtext);
          hasContent = true;
        }

        setAnswer(streamtext);

        if (!(hasContent && streamtext.trim().length > 0)) {
          console.error("❌ Gemini response error: Empty message or no response received");
          setAnswer("Sorry, I didn't receive a proper response. Please try again.");
        }
      }

      setIsModelThinking(false);
      setShouldKeepAnswerVisible(true);

      await new Promise((resolve) => setTimeout(resolve, 100));

      mutation.mutate();
    } catch (error) {
      console.error("❌ Error in chat:", error);
      setIsModelThinking(false);
      setAnswer("Sorry, there was an error processing your request. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    const text = (currentInput || "").trim();
    if (formRef.current) formRef.current.reset();
    if (!text && !img.dbData?.filePath) return;

    const textarea = formRef.current?.elements?.text;
    if (textarea) textarea.style.height = "auto";

    const imagePathAtSubmit = img.dbData?.filePath || "";
    setSubmittedPreview({ text, imagePath: imagePathAtSubmit });
    setQuestion(text);
    setCurrentInput("");
    setHasSubmitted(true);

    try {
      await add(text, false);
    } catch (error) {
      console.error("❌ Failed to send user message:", error);
    }
  };

  useEffect(() => {
    if (
      !hasRun.current &&
      (chat || currentModel === "sdxl") &&
      data?.history?.length === 1 &&
      !isProcessing &&
      !answer
    ) {
      const lastMessage = data.history[0];
      if (
        lastMessage.role === "user" &&
        !data.history.some((msg) => msg.role === "model")
      ) {
        hasRun.current = true;
        if (isImageRequest(lastMessage.parts[0].text)) {
          setCurrentModel("sdxl");
        }
        setTimeout(() => {
          add(lastMessage.parts[0].text);
        }, 100);
      }
    }
  }, [chat, data?.history, isProcessing, answer, currentModel]);

  return (
    <>
      {/* Model Selector */}
      <ModelSelector 
        currentModel={currentModel} 
        onModelChange={handleModelChange}
      />

      {img.isLoading && <div className="">Loading...</div>}
      {hasSubmitted && !isSubmittedInHistory && (showUserMsg || submittedPreview.imagePath) && (
        <div className="message user">
          {submittedPreview.imagePath && (
            <div className="message-image">
              <IKImage
                urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                path={submittedPreview.imagePath}
                width="300"
                height="200"
                transformation={[{ width: 300, height: 200 }]}
                className="user-uploaded-image"
              />
            </div>
          )}
          {question && question !== "[image]" && (
            <div className="message-text">{question}</div>
          )}
        </div>
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
          {aiGeneratedImg && (
            <div className="ai-generated-image">
              <IKImage
                urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                path={aiGeneratedImg}
                height="400"
                width="400"
                transformation={[{ height: 400, width: 400 }]}
                loading="lazy"
                lqip={{ active: true, quality: 20 }}
                className="ai-generated-image"
              />
            </div>
          )}
        </div>
      )}

      <div className="endchat" ref={endRef}></div>

      <form className="newForm" onSubmit={handleSubmit} ref={formRef}>
        <Upload setImg={setImg} resetTrigger={hasSubmitted ? 1 : 0} />
        <input id="file" type="file" multiple={false} hidden />
        <textarea
          name="text"
          placeholder="Ask anything..."
          aria-label="Message to MyGPT"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          rows="1"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          onChange={(e) => {
            setCurrentInput(e.target.value);
            e.target.style.height = "auto";
            const scrollHeight = e.target.scrollHeight;
            const maxHeight = 140; 
            e.target.style.height = Math.min(scrollHeight, maxHeight) + "px";
            e.target.style.overflowY =
              scrollHeight > maxHeight ? "scroll" : "hidden";
          }}
          value={currentInput}
        />
        <button type="submit" disabled={!currentInput.trim() && !img.dbData?.filePath} aria-label="Send message">
          <img src="/arrow.png" alt="Send" />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;