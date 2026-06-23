import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { SearchConfig } from "./SearchWidget";

interface NativeInputAutocompleteProps {
  inputElement: HTMLInputElement;
  config: SearchConfig;
}

export const NativeInputAutocomplete: React.FC<NativeInputAutocompleteProps> = ({ inputElement, config }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const updateRect = () => {
    setRect(inputElement.getBoundingClientRect());
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const handleInput = (e: Event) => {
      const val = (e.target as HTMLInputElement).value;
      if (val.length > 2) {
        setIsLoading(true);
        setIsOpen(true);
        updateRect();
        clearTimeout(timer);
        timer = setTimeout(() => {
          const basePath = config.basePath || "/scraper";
          fetch(`${basePath}/api/mock-search/${config.siteId}/suggest/${encodeURIComponent(val)}`)
            .then(res => res.json())
            .then(data => {
              const items = data.body?.suggestions || data.suggestions || [];
              setSuggestions(items);
              setIsOpen(items.length > 0);
              setIsLoading(false);
              updateRect();
            })
            .catch(err => {
              console.error("Failed to fetch suggestions", err);
              setSuggestions([]);
              setIsOpen(false);
              setIsLoading(false);
            });
        }, 300);
      } else {
        setSuggestions([]);
        setIsOpen(false);
        setIsLoading(false);
      }
    };

    const handleFocus = () => {
      if (inputElement.value.length > 2 && suggestions.length > 0) {
        setIsOpen(true);
        updateRect();
      }
    };

    const handleBlur = () => {
      // Delay closing to allow clicks on dropdown items
      setTimeout(() => setIsOpen(false), 200);
    };

    inputElement.addEventListener("input", handleInput);
    inputElement.addEventListener("focus", handleFocus);
    inputElement.addEventListener("blur", handleBlur);
    window.addEventListener("scroll", updateRect, true);
    window.addEventListener("resize", updateRect);

    return () => {
      inputElement.removeEventListener("input", handleInput);
      inputElement.removeEventListener("focus", handleFocus);
      inputElement.removeEventListener("blur", handleBlur);
      window.removeEventListener("scroll", updateRect, true);
      window.removeEventListener("resize", updateRect);
      clearTimeout(timer);
    };
  }, [inputElement, config.siteId, config.basePath, suggestions.length]);

  if (!isOpen || !rect) return null;

  return createPortal(
    <div 
      className="sensei-autocomplete-dropdown"
      style={{ 
        position: 'fixed',
        top: rect.bottom + "px", 
        left: rect.left + "px", 
        width: rect.width + "px",
        backgroundColor: '#ffffff',
        border: '1px solid #d1d5db',
        borderRadius: '0.25rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        zIndex: 99999,
        maxHeight: '300px',
        overflowY: 'auto'
      }}
    >
      {isLoading ? (
        <div style={{ padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <style>
              {`
                .spinner_V8m1 { transform-origin: center; animation: spinner_zKoa 2s linear infinite; }
                .spinner_V8m1 circle { stroke-linecap: round; animation: spinner_YpZS 1.5s ease-in-out infinite; }
                @keyframes spinner_zKoa { 100% { transform: rotate(360deg); } }
                @keyframes spinner_YpZS { 0% { stroke-dasharray: 0 150; stroke-dashoffset: 0; } 47.5% { stroke-dasharray: 42 150; stroke-dashoffset: -16; } 95%, 100% { stroke-dasharray: 42 150; stroke-dashoffset: -59; } }
              `}
            </style>
            <g className="spinner_V8m1">
              <circle cx="12" cy="12" r="9.5" fill="none" strokeWidth="3" stroke="#6b7280"></circle>
            </g>
          </svg>
          <span style={{ marginLeft: '0.5rem', color: '#6b7280', fontSize: '14px', fontFamily: config.fontFamily || "'Work Sans', sans-serif" }}>
            Loading suggestions...
          </span>
        </div>
      ) : suggestions.length > 0 ? (
        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
          {suggestions.map((sug, idx) => (
            <li 
              key={idx}
              onMouseDown={(e) => {
                // Prevent blur
                e.preventDefault();
                inputElement.value = sug;
                setIsOpen(false);
                
                // Trigger search
                if (typeof window.__sensei_trigger_search === "function") {
                  window.__sensei_trigger_search(sug);
                } else if (inputElement.form) {
                  inputElement.form.submit();
                }
              }}
              style={{
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                color: '#1f2937',
                fontSize: '16px',
                fontFamily: config.fontFamily || "'Work Sans', sans-serif",
                borderBottom: idx < suggestions.length - 1 ? '1px solid #f3f4f6' : 'none'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {sug}
            </li>
          ))}
        </ul>
      ) : (
        <div style={{ padding: '1rem', color: '#6b7280', fontSize: '14px', textAlign: 'center', fontFamily: config.fontFamily || "'Work Sans', sans-serif" }}>
          No suggestions found
        </div>
      )}
    </div>,
    document.body
  );
};
