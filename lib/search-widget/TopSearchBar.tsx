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
    <div style={{ fontFamily }} className="sensei-top-search relative flex items-center h-full">
      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          className="flex items-center justify-center p-2 text-white hover:text-gray-300 transition-colors bg-transparent border-none cursor-pointer"
          aria-label="Open search"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      ) : (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center bg-black px-6 py-3 z-50 min-w-[300px] md:min-w-[600px] shadow-2xl">
          <span className="text-white whitespace-nowrap mr-4 font-semibold text-lg hidden md:block">
            Search {siteDomain}
          </span>
          <form onSubmit={handleSubmit} className="flex-grow flex items-center relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-[#5E5E5E] text-white px-4 py-2 pr-10 rounded border border-gray-400 focus:outline-none focus:border-white text-base md:text-lg"
              placeholder=""
            />
            <button type="submit" className="absolute right-3 text-white hover:opacity-80">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </form>
          <button
            onClick={() => setExpanded(false)}
            className="ml-4 md:ml-6 text-white hover:text-gray-300"
            aria-label="Close search"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};
