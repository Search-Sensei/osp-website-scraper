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
    <div style={{ fontFamily }} className="sensei-top-search flex items-center h-full w-full max-w-[300px] md:max-w-[400px]">
      <form onSubmit={handleSubmit} className="w-full flex items-center relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-[#333] text-white px-4 py-2 pr-10 rounded-full border border-transparent focus:outline-none focus:border-gray-500 focus:bg-[#444] transition-colors text-sm md:text-base placeholder-gray-400 shadow-inner"
          placeholder="Search..."
        />
        <button type="submit" className="absolute right-3 text-gray-400 hover:text-white transition-colors" aria-label="Submit search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </form>
    </div>
  );
};
