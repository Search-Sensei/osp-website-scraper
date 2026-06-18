import React from "react";
import ReactDOM from "react-dom/client";
import { SearchWidget, SearchConfig } from "./SearchWidget";
import { TopSearchBar } from "./TopSearchBar";
import { NativeInputAutocomplete } from "./NativeInputAutocomplete";

declare global {
  interface Window {
    SENSEI_SEARCH_CONFIG?: SearchConfig & { 
      cssUrl?: string; 
      formSelector?: string;
      topSearchContainerSelector?: string;
    };
  }
}

function initSearchWidget() {
  const config = window.SENSEI_SEARCH_CONFIG || { siteId: "" };
  if (!config.siteId) {
    console.error("[Sensei Search Widget] siteId is required in SENSEI_SEARCH_CONFIG.");
    return;
  }

  const containerSelector = config.containerSelector || ".search-container";
  const formSelector = config.formSelector || 'form[action="/search"]';
  const cssUrl = config.cssUrl || "/assets/sensei-search-widget.css";

  const targetContainer = document.querySelector(containerSelector);
  if (!targetContainer) {
    console.warn(`[Sensei Search Widget] Target container "${containerSelector}" not found.`);
    return;
  }

  // Create or find our own root wrapper to prevent interference
  let widgetRoot = document.getElementById("sensei-search-root");
  if (!widgetRoot) {
    widgetRoot = document.createElement("div");
    widgetRoot.id = "sensei-search-root";
    // Clear the original contents and append our widget root
    targetContainer.innerHTML = "";
    targetContainer.appendChild(widgetRoot);
  }

  // Create Shadow Root for styling encapsulation
  const shadowRoot = widgetRoot.attachShadow({ mode: "open" });

  // Add the CSS bundle link
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = cssUrl;
  shadowRoot.appendChild(link);

  // Add React mount container
  const reactContainer = document.createElement("div");
  reactContainer.className = "sensei-root-wrapper w-full";
  shadowRoot.appendChild(reactContainer);

  // Render React Application
  const root = ReactDOM.createRoot(reactContainer);
  root.render(
    <React.StrictMode>
      <SearchWidget config={config} />
    </React.StrictMode>
  );



  // Initialize Top Search Bar if container exists
  const topSearchSelector = config.topSearchContainerSelector || "#sensei-top-search-container";
  const topSearchContainer = document.querySelector(topSearchSelector);
  
  if (topSearchContainer) {
    let topSearchRoot = document.getElementById("sensei-top-search-root");
    if (!topSearchRoot) {
      topSearchRoot = document.createElement("div");
      topSearchRoot.id = "sensei-top-search-root";
      topSearchContainer.innerHTML = "";
      topSearchContainer.appendChild(topSearchRoot);
    }
    
    const topShadowRoot = topSearchRoot.attachShadow({ mode: "open" });
    
    // Add the CSS bundle link for the top search bar
    const topLink = document.createElement("link");
    topLink.rel = "stylesheet";
    topLink.href = cssUrl;
    topShadowRoot.appendChild(topLink);
    
    const topReactContainer = document.createElement("div");
    topReactContainer.className = "sensei-top-search-wrapper h-full";
    topShadowRoot.appendChild(topReactContainer);
    
    const topReactDomRoot = ReactDOM.createRoot(topReactContainer);
    topReactDomRoot.render(
      <React.StrictMode>
        <TopSearchBar config={config} />
      </React.StrictMode>
    );
  }

  // Intercept form submissions globally on the document level (Event Delegation)
  document.addEventListener("submit", (e) => {
    const form = e.target as HTMLFormElement;
    if (form && form.matches(formSelector)) {
      e.preventDefault();
      const input = form.querySelector('input[name="q"]') as HTMLInputElement;
      if (input) {
        const queryVal = input.value.trim();
        // Trigger search even if queryVal is empty to clear/reset if needed
        if (typeof window.__sensei_trigger_search === "function") {
          window.__sensei_trigger_search(queryVal);
        }
        // Update URL without page refresh
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set("q", queryVal); // Keep q even if empty
        window.history.pushState({}, "", newUrl.toString());

        // Synchronize all search input fields on the page
        document.querySelectorAll(`${formSelector} input[name="q"]`).forEach((el) => {
          (el as HTMLInputElement).value = queryVal;
        });
      }
    }
  });

  // Handle browser back/forward buttons (history popstate)
  window.addEventListener("popstate", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const queryVal = urlParams.get("q") || urlParams.get("query") || "";
    
    // Update input values on the page to match the history state
    document.querySelectorAll(`${formSelector} input[name="q"]`).forEach((el) => {
      (el as HTMLInputElement).value = queryVal;
    });

    if (typeof window.__sensei_trigger_search === "function") {
      window.__sensei_trigger_search(queryVal);
    }
  });

  // Populate search inputs initially if URL contains query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get("q") || urlParams.get("query");
  
  document.querySelectorAll(`${formSelector} input[name="q"]`).forEach((el) => {
    const inputElement = el as HTMLInputElement;
    if (initialQuery) {
      inputElement.value = initialQuery;
    }
    
    // Add React Autocomplete Dropdown
    const dropdownContainer = document.createElement("div");
    dropdownContainer.style.position = "relative";
    inputElement.parentNode?.insertBefore(dropdownContainer, inputElement.nextSibling);
    
    const dropdownRoot = ReactDOM.createRoot(dropdownContainer);
    dropdownRoot.render(
      <React.StrictMode>
        <NativeInputAutocomplete inputElement={inputElement} config={config} />
      </React.StrictMode>
    );
  });
}

// Initializing logic on DOM load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSearchWidget);
} else {
  initSearchWidget();
}
