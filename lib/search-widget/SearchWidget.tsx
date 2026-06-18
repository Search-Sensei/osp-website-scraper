import React, { useState, useEffect, useCallback, useRef } from "react";

export interface SearchConfig {
  siteId: string;
  primaryColor?: string;
  accentColor?: string;
  accentBgColor?: string;
  borderColor?: string;
  fontFamily?: string;
  categories?: string[];
  containerSelector?: string;
  basePath?: string;
  pageSize?: number;
}

interface SearchItem {
  title: string;
  url: string;
  summary?: string;
  body?: string;
  categories?: string[];
  category?: string | string[];
}

interface SearchWidgetProps {
  config: SearchConfig;
}

declare global {
  interface Window {
    __sensei_trigger_search?: (query: string) => void;
  }
}

export const SearchWidget: React.FC<SearchWidgetProps> = ({ config }) => {
  const siteId = config.siteId;
  const basePath = config.basePath !== undefined ? config.basePath : "/scraper";
  const primaryColor = config.primaryColor || "#af192a";
  const accentColor = config.accentColor || "#115e6b";
  const accentBgColor = config.accentBgColor || "#bfe3e8";
  const borderColor = config.borderColor || "#c5cdd6";
  const fontFamily = config.fontFamily || "'Work Sans', sans-serif";


  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [navigators, setNavigators] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(config.pageSize || 10);
  const [resultsCount, setResultsCount] = useState(0);

  const performSearch = useCallback(async (searchQuery: string, category: string, pageNum: number = 1) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setNavigators([]);
      setHasSearched(false);
      setResultsCount(0);
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const url = `${basePath}/api/mock-search/${siteId}/search?q=${encodeURIComponent(
        searchQuery
      )}&category=${encodeURIComponent(category)}&page=${pageNum}&pageSize=${pageSize}`;

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
      }

      const data = await res.json();
      const items = data.results || (data.body && data.body.results) || [];
      const navs = data.navigators || (data.body && data.body.navigators) || [];

      const totalResults = data.resultsCount ?? data.body?.resultsCount ?? data.body?.searchDefinition?.totalResults ?? 0;
      // The API doesn't support pagination properly, so we use our requested page/size
      const returnedPage = pageNum;
      const returnedPageSize = pageSize;

      // Local slicing to force pagination if backend returned too many results
      let paginatedItems = items;
      if (items.length > pageSize) {
        const startIndex = (pageNum - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        paginatedItems = items.slice(startIndex, endIndex);
      }

      setResults(paginatedItems);
      setNavigators(navs);
      setResultsCount(totalResults);
      setCurrentPage(returnedPage);
      setPageSize(returnedPageSize);
    } catch (err: any) {
      console.error("[SearchWidget] Fetch failed:", err);
      setError("Error loading search results. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [basePath, siteId, pageSize]);

  // Handle external triggers (e.g. from vanilla form submit)
  useEffect(() => {
    window.__sensei_trigger_search = (q: string) => {
      setQuery(q);
      setActiveCategory("All");
      performSearch(q, "All", 1);
    };
    return () => {
      delete window.__sensei_trigger_search;
    };
  }, [performSearch]);

  // Initial search from URL params
  const initialLoadDone = useRef(false);
  useEffect(() => {
    if (!initialLoadDone.current && typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      // Check if the parameter exists (even if empty string)
      if (urlParams.has("q") || urlParams.has("query")) {
        const initialQuery = urlParams.get("q") || urlParams.get("query") || "";
        setQuery(initialQuery);
        performSearch(initialQuery, "All", 1);
      }
      initialLoadDone.current = true;
    }
  }, [performSearch]);

  // Category change handler
  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    performSearch(query, cat, 1);
  };

  // Helper to extract categories from search item
  const getDisplayCategories = (item: SearchItem): string[] => {
    if (Array.isArray(item.categories)) return item.categories;
    if (typeof item.categories === "string") return [item.categories];
    if (item.category) {
      return Array.isArray(item.category) ? item.category : [item.category];
    }
    return [];
  };

  const getCategoryCount = (catName: string): string => {
    if (catName === "All") {
      const categoryNav = navigators.find(n => n.name === "category");
      if (categoryNav) {
        return categoryNav.allCount || categoryNav.count || "";
      }
      return "";
    }
    const categoryNav = navigators.find(n => n.name === "category");
    if (categoryNav && Array.isArray(categoryNav.items)) {
      const item = categoryNav.items.find((i: any) => i.name.toLowerCase() === catName.toLowerCase());
      return item ? item.count : "";
    }
    return "";
  };

  // Dynamically build the categories list from navigators
  const getCategoriesList = (): string[] => {
    const categoryNav = navigators.find(n => n.name === "category");
    if (categoryNav && Array.isArray(categoryNav.items) && categoryNav.items.length > 0) {
      const apiCats = categoryNav.items.map((i: any) => i.name);
      return ["All", ...apiCats];
    }
    return ["All"];
  };

  const categoriesToRender = getCategoriesList();

  // Render variables
  const containerStyle = {
    fontFamily: fontFamily,
  };

  return (
    <div style={containerStyle} className="sensei-root-wrapper w-full py-4 text-slate-800">
      {hasSearched && (
        <div className="mb-6">
          {/* Category Chips Bar */}
          <div className="flex flex-wrap items-center gap-2 mb-6" id="search-filter-bar">
            <span className="font-semibold text-slate-700 mr-2 text-sm">Filter by:</span>
            {categoriesToRender.map((cat) => {
              const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
              const count = getCategoryCount(cat);
              const displayLabel = count ? `${cat} (${count})` : cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`filter-chip px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${isActive
                    ? "active inline-flex items-center"
                    : "border hover:bg-slate-100"
                    }`}
                  style={{
                    backgroundColor: isActive ? accentBgColor : "transparent",
                    color: isActive ? accentColor : "inherit",
                    borderColor: isActive ? "transparent" : borderColor,
                  }}
                >
                  {isActive && <span className="mr-1">✓</span>}
                  {displayLabel}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-6 py-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="animate-pulse border-b pb-4">
              <div className="h-4 bg-slate-200 rounded w-1/4 mb-2"></div>
              <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && !loading && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
          {error}
        </div>
      )}

      {/* Results List */}
      {!loading && !error && hasSearched && (
        <div className="space-y-6">
          {results.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-slate-600">
                No results found for &quot;{activeCategory}&quot; filter.
              </h3>
            </div>
          ) : (
            results.map((item, index) => {
              const displayCats = getDisplayCategories(item);
              const summaryText =
                item.summary ||
                (item.body
                  ? item.body.length > 200
                    ? item.body.substring(0, 200) + "..."
                    : item.body
                  : "");

              return (
                <div
                  key={index}
                  className="search-item border-b pb-4 transition-all duration-300 hover:translate-x-1"
                  style={{ borderColor: borderColor }}
                >
                  {/* Item URL Breadcrumb */}
                  <div className="text-xs text-slate-500 mb-1 break-all flex items-center gap-1">
                    <span className="truncate">{item.url}</span>
                  </div>

                  {/* Item Title Link */}
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="search-link block text-lg font-semibold mb-2 hover:underline transition-colors"
                    style={{ color: primaryColor }}
                  >
                    <span className="search-title">{item.title}</span>
                  </a>

                  {/* Summary */}
                  <p className="search-summary text-sm text-slate-600 mb-3 leading-relaxed">
                    {summaryText}
                  </p>

                  {/* Category Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {displayCats.map((cat) => (
                      <span
                        key={cat}
                        className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                        style={{
                          backgroundColor: `${accentBgColor}80`, // 50% opacity
                          color: accentColor,
                        }}
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && !error && hasSearched && resultsCount > pageSize && (
        (() => {
          const totalPages = Math.ceil(resultsCount / pageSize);
          const maxPagesToShow = 10;
          let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
          let endPage = startPage + maxPagesToShow - 1;

          if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
          }

          const pages = [];
          for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
          }

          return (
            <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 mt-8 pt-6 border-t" style={{ borderColor: borderColor }}>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => performSearch(query, activeCategory, 1)}
                  disabled={currentPage <= 1}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors hidden sm:block ${currentPage <= 1 ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-white border hover:bg-slate-50 text-slate-700"
                    }`}
                  style={{ borderColor: currentPage <= 1 ? "transparent" : borderColor }}
                  title="First Page"
                >
                  First
                </button>
                <button
                  onClick={() => performSearch(query, activeCategory, currentPage - 1)}
                  disabled={currentPage <= 1}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${currentPage <= 1 ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-white border hover:bg-slate-50 text-slate-700"
                    }`}
                  style={{ borderColor: currentPage <= 1 ? "transparent" : borderColor }}
                  title="Previous Page"
                >
                  Prev
                </button>
              </div>

              <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 sm:pb-0">
                {pages.map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => performSearch(query, activeCategory, pageNum)}
                    className={`min-w-[2rem] h-8 px-1 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${currentPage === pageNum
                      ? "text-white"
                      : "bg-white border hover:bg-slate-50 text-slate-700"
                      }`}
                    style={{
                      backgroundColor: currentPage === pageNum ? primaryColor : undefined,
                      borderColor: currentPage === pageNum ? primaryColor : borderColor
                    }}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => performSearch(query, activeCategory, currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${currentPage >= totalPages ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-white border hover:bg-slate-50 text-slate-700"
                    }`}
                  style={{ borderColor: currentPage >= totalPages ? "transparent" : borderColor }}
                  title="Next Page"
                >
                  Next
                </button>
                <button
                  onClick={() => performSearch(query, activeCategory, totalPages)}
                  disabled={currentPage >= totalPages}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors hidden sm:block ${currentPage >= totalPages ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-white border hover:bg-slate-50 text-slate-700"
                    }`}
                  style={{ borderColor: currentPage >= totalPages ? "transparent" : borderColor }}
                  title="Last Page"
                >
                  Last
                </button>
              </div>
            </div>
          );
        })()
      )}
    </div>
  );
};
