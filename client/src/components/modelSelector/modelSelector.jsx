import { useEffect, useRef, useState } from "react";
import "./modelSelector.css";

const ModelSelector = ({ currentModel, onModelChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const models = [
    {
      id: "gemini-text",
      name: "Gemini Text",
      description: "Best for text conversations and analysis",
      icon: "💬",
      type: "text"
    },
    {
      id: "sdxl",
      name: "SDXL Image Generator",
      description: "High-quality image generation",
      icon: "🎨",
      type: "image-generation"
    }
  ];

  const handleModelSelect = (model) => {
    onModelChange(model);
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen]);

  const handleKeyNavigate = (e) => {
    if (!isOpen) return;
    const items = dropdownRef.current?.querySelectorAll('[role="menuitem"]');
    if (!items || items.length === 0) return;
    const currentIndex = Array.from(items).findIndex((el) => el === document.activeElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = items[(currentIndex + 1 + items.length) % items.length];
      next.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = items[(currentIndex - 1 + items.length) % items.length];
      prev.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      items[0].focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      items[items.length - 1].focus();
    }
  };

  const currentModelInfo = models.find(m => m.id === currentModel) || models[0];

  return (
    <div className={`model-selector ${isOpen ? 'open' : ''}`}>
      <button 
        className="model-selector-button"
        onClick={() => {
          const willOpen = !isOpen;
          if (willOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            setOpenUp(spaceBelow < 260);
          }
          setIsOpen(willOpen);
        }}
        title="Select AI Model"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls="model-dropdown"
        ref={buttonRef}
      >
        <span className="model-icon">{currentModelInfo.icon}</span>
        <span className="model-name">{currentModelInfo.name}</span>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div
          id="model-dropdown"
          className={`model-dropdown ${openUp ? 'drop-up' : ''}`}
          role="menu"
          aria-label="AI model options"
          ref={dropdownRef}
          onKeyDown={handleKeyNavigate}
        >
          {models.map((model) => (
            <div
              key={model.id}
              className={`model-option ${model.id === currentModel ? 'selected' : ''}`}
              onClick={() => handleModelSelect(model)}
              role="menuitem"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleModelSelect(model);
                }
              }}
            >
              <div className="model-option-header">
                <span className="model-icon">{model.icon}</span>
                <span className="model-name">{model.name}</span>
                {model.id === currentModel && <span className="selected-indicator">✓</span>}
              </div>
              <div className="model-description">{model.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModelSelector;
