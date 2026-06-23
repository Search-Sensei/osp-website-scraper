import React from "react";
import ReactDOM from "react-dom/client";
import { ChatWidget, ChatConfig } from "./ChatWidget";

// Extend window interface
declare global {
  interface Window {
    SENSEI_CHAT_CONFIG?: ChatConfig & { cssUrl?: string };
  }
}

function initWidget() {
  const config = window.SENSEI_CHAT_CONFIG || {};
  const cssUrl = config.cssUrl || "/assets/sensei-chat-widget.css";

  // Create mount container
  let container = document.getElementById("sensei-chat-root");
  if (!container) {
    container = document.createElement("div");
    container.id = "sensei-chat-root";
    document.body.appendChild(container);
  }

  // Create shadow DOM to isolate styles
  const shadowRoot = container.attachShadow({ mode: "open" });

  // Add stylesheet link
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = cssUrl;
  shadowRoot.appendChild(link);

  // Add container div for React
  const reactContainer = document.createElement("div");
  reactContainer.className = "sensei-root-wrapper";
  if (config.primaryColor) {
    reactContainer.style.setProperty("--primary-color", config.primaryColor);
  }
  if (config.secondaryColor) {
    reactContainer.style.setProperty("--secondary-color", config.secondaryColor);
  }
  shadowRoot.appendChild(reactContainer);

  // Render React application
  const root = ReactDOM.createRoot(reactContainer);
  root.render(
    <React.StrictMode>
      <ChatWidget config={config} />
    </React.StrictMode>
  );
}

// Ensure DOM is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initWidget);
} else {
  initWidget();
}
