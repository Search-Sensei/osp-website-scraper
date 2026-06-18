import React, { useState, useRef, useEffect } from "react";
import { SearchConfig } from "./SearchWidget";

interface TopSearchBarProps {
  config: SearchConfig;
}

export const TopSearchBar: React.FC<TopSearchBarProps> = ({ config }) => {
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const fontFamily = config.fontFamily || "'Work Sans', sans-serif";
  const siteDomain = config.siteId === "communitysavings_bank" ? "communitysavings.bank" : "nab.com.au";

  useEffect(() => {
    if (expanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [expanded]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (typeof window.__sensei_trigger_search === "function") {
      window.__sensei_trigger_search(query);
    } else {
      // Fallback: redirect to search page
      window.location.href = `/scraper/sites/${config.siteId}/index.html?q=${encodeURIComponent(query)}`;
    }
    setExpanded(false);
  };

  return (
    <div style={{ fontFamily }} className="sensei-top-search flex items-center h-full w-full min-w-[300px] md:min-w-[500px] lg:min-w-[700px] xl:min-w-[900px] max-w-full mx-auto">
      <form onSubmit={handleSubmit} className="w-full flex items-center relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`w-full px-8 py-4 pr-16 rounded-full focus:outline-none transition-all duration-300 text-lg md:text-xl shadow-sm hover:shadow-md focus:shadow-lg ${
            config.theme === "light"
              ? "bg-[#f8f9fa] text-gray-800 border-2 border-gray-200 focus:border-gray-300 focus:bg-white placeholder-gray-500"
              : "bg-[#222] text-white border-2 border-transparent focus:border-gray-500 focus:bg-[#333] placeholder-gray-500"
          }`}
          placeholder="Search for accounts, loans, locations..."
        />
        <button type="submit" className={`absolute right-5 transition-colors ${config.theme === "light" ? "text-gray-400 hover:text-gray-800" : "text-gray-500 hover:text-white"}`} aria-label="Submit search">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </form>
    </div>
  );
};
