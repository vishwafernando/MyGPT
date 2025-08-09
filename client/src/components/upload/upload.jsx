import { useState, useEffect, useRef } from "react";
import { IKContext, IKUpload } from "imagekitio-react";

const urlEndpoint = import.meta.env.VITE_IMAGE_KIT_ENDPOINT;
const publicKey = import.meta.env.VITE_IMAGE_KIT_PUBLIC_KEY;

const authenticator = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

import "./upload.css";

const Upload = ({ setImg, resetTrigger = 0 }) => {
  const ikUploadRef = useRef(null);
  const [preview, setPreview] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);

  const handleRemove = (e) => {
    e.stopPropagation();
    setPreview(null);
    setIsLoading(false);
    setImg({ isLoading: false, error: "", dbData: {}, aiData: {} });
  };

  const onError = (err) => {
    setIsLoading(false);
    setPreview(null);
    setImg((prev) => ({ ...prev, isLoading: false, error: "Upload failed" }));
    console.error("❌ Upload error:", err);
  };

  const onSuccess = (res) => {
    setIsLoading(false);
    setImg((prev) => ({ ...prev, isLoading: false, dbData: res }));
  };

  const onUploadStart = (evt) => {
    const file = evt.target.files[0];
    if (!file) return;
    setIsLoading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setImg((prev) => ({
        ...prev,
        isLoading: true,
        aiData: {
          inlineData: {
            data: reader.result.split(",")[1],
            mimeType: file.type,
          },
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const onUploadProgress = () => {};
  useEffect(() => {
    setPreview(null);
    setIsLoading(false);
  }, [resetTrigger]);

  return (
    <div className="upload-preview-container">
      <IKContext
        urlEndpoint={urlEndpoint}
        publicKey={publicKey}
        authenticator={authenticator}
      >
        <IKUpload
          fileName="test-upload.png"
          onError={onError}
          onSuccess={onSuccess}
          useUniqueFileName={true}
          onUploadProgress={onUploadProgress}
          onUploadStart={onUploadStart}
          style={{ display: "none" }}
          ref={ikUploadRef}
        />
        <label
          className="upload-label"
          onClick={() => ikUploadRef.current.click()}
        >
          <img src="/attachment.png" alt="Attach" />
        </label>
        {preview && (
          <div className="img-preview-wrapper">
            <img src={preview} alt="preview" className="img-preview" />
            {isLoading && <span className="upload-anim-circle"></span>}
            <button
              type="button"
              className="remove-img-btn"
              onClick={handleRemove}
              title="Remove image"
            >
              ×
            </button>
          </div>
        )}
      </IKContext>
    </div>
  );
};

export default Upload;
