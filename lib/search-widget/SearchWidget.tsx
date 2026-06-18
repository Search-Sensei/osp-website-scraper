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
  theme?: "light" | "dark";
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
  const [featuredContent, setFeaturedContent] = useState<any[]>([]);
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
      const featured = data.featured || (data.body && data.body.featured) || [];

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
      setFeaturedContent(featured);
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
    <div style={containerStyle} className="sensei-root-wrapper w-full p-4 md:p-8 text-slate-800 bg-[#f3f4f6] min-h-[50vh]">
      {hasSearched && (
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-6">
            Results found for "{query}"
          </h2>
          {/* Category Chips Bar */}
          <div className="flex flex-wrap items-center gap-3 mb-6" id="search-filter-bar">
            <span className="font-semibold text-slate-900 mr-2 text-base">Filter by</span>
            {categoriesToRender.map((cat) => {
              const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
              const count = getCategoryCount(cat);
              const displayLabel = count ? `${cat} (${count})` : cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`filter-chip px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${isActive
                    ? "active inline-flex items-center"
                    : "bg-white border hover:bg-slate-50 text-slate-700"
                    }`}
                  style={{
                    backgroundColor: isActive ? accentBgColor : undefined,
                    color: isActive ? accentColor : undefined,
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
      {loading && results.length === 0 && (
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

      {/* Results List & Featured Content */}
      {!error && hasSearched && (
        <div className={`space-y-8 transition-opacity duration-200 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
          {featuredContent.length > 0 && (
            <div className="mb-4">
              {featuredContent.map((feat, idx) => (
                <div
                  key={`feat-${idx}`}
                  className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow p-6 mb-4 featured-content-card"
                  style={{ borderColor: borderColor }}
                >
                  <style>{`
                    .featured-content-card h2 {
                      font-size: 1.25rem;
                      font-weight: 700;
                      margin-bottom: 0.5rem;
                    }
                    .featured-content-card h2 a {
                      color: ${primaryColor};
                      text-decoration: none;
                    }
                    .featured-content-card h2 a:hover {
                      text-decoration: underline;
                    }
                    .featured-content-card p {
                      color: #334155;
                      margin-bottom: 0.75rem;
                      line-height: 1.6;
                    }
                    .featured-content-card p a {
                      color: ${primaryColor};
                      text-decoration: underline;
                      font-weight: 500;
                    }
                    .featured-content-card p:last-child {
                      margin-bottom: 0;
                    }
                  `}</style>
                  <div dangerouslySetInnerHTML={{ __html: feat.content }} />
                </div>
              ))}
            </div>
          )}

          {results.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-slate-600">
                No results found for &quot;{activeCategory}&quot; filter.
              </h3>
            </div>
          ) : (
            (() => {
              const topResults = results.slice(0, 3);
              const remainingResults = results.slice(3);

              return (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {topResults.map((item, index) => {
                      const displayCats = getDisplayCategories(item);
                      const firstCat = displayCats.length > 0 ? displayCats[0] : "Result";
                      const summaryText =
                        item.summary ||
                        (item.body
                          ? item.body.length > 150
                            ? item.body.substring(0, 150) + "..."
                            : item.body
                          : "");

                      return (
                        <div key={`top-${index}`} className="bg-white rounded-xl border shadow-sm p-6 flex flex-col h-full hover:shadow-md transition-shadow" style={{ borderColor: borderColor }}>
                          <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">{item.title}</h3>
                          <div className="mb-3">
                            <span className="inline-block px-3 py-1 bg-slate-100 text-slate-800 text-xs font-semibold rounded-full">
                              {firstCat}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 flex-grow leading-relaxed">{summaryText}</p>
                          <div className="mt-6 text-right">
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold hover:underline" style={{ color: primaryColor }}>
                              Learn more &gt;
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {remainingResults.length > 0 && (
                    <div className="bg-white rounded-xl border shadow-sm divide-y" style={{ borderColor: borderColor }}>
                      {remainingResults.map((item, index) => {
                        const displayCats = getDisplayCategories(item);
                        const firstCat = displayCats.length > 0 ? displayCats[0] : "Result";
                        const summaryText =
                          item.summary ||
                          (item.body
                            ? item.body.length > 150
                              ? item.body.substring(0, 150) + "..."
                              : item.body
                            : "");

                        return (
                          <a href={item.url} target="_blank" rel="noopener noreferrer" key={`list-${index}`} className="block p-5 hover:bg-slate-50 transition-colors group">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex-1">
                                <h4 className="text-base font-bold text-slate-900 mb-1 group-hover:underline">{item.title}</h4>
                                <p className="text-sm text-slate-500 line-clamp-2">{summaryText}</p>
                              </div>
                              <div className="flex-shrink-0 flex items-center justify-end">
                                <span className="text-sm font-semibold text-slate-900 flex items-center gap-1 whitespace-nowrap">
                                  {firstCat} <span className="ml-1 text-slate-400 font-bold">&gt;</span>
                                </span>
                              </div>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  )}
                </>
              );
            })()
          )}
        </div>
      )}

      {/* Pagination Controls */}
      {!error && hasSearched && resultsCount > pageSize && (
        (() => {
          const totalPages = Math.ceil(resultsCount / pageSize);
          if (totalPages <= 1) return null;

          // Helper to get pagination range with ellipsis
          const getPaginationRange = (c: number, t: number) => {
            let delta = 2;
            if (c === 1 || c === t) delta = 4;
            else if (c === 2 || c === t - 1) delta = 3;
            
            const range: (number | string)[] = [];
            for (let i = Math.max(2, c - delta); i <= Math.min(t - 1, c + delta); i++) {
              range.push(i);
            }
            if (range.length > 0 && typeof range[0] === 'number' && range[0] > 2) range.unshift("...");
            range.unshift(1);
            if (range.length > 0 && typeof range[range.length - 1] === 'number' && (range[range.length - 1] as number) < t - 1) range.push("...");
            if (t > 1) range.push(t);
            return range;
          };

          const pages = getPaginationRange(currentPage, totalPages);

          return (
            <div className={`flex justify-center items-center gap-6 mt-12 mb-8 pt-8 transition-opacity duration-200 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
              {/* First & Prev */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => performSearch(query, activeCategory, 1)}
                  disabled={currentPage <= 1}
                  className={`text-lg font-bold transition-colors ${currentPage <= 1 ? "text-slate-300 cursor-not-allowed" : "text-slate-600 hover:text-slate-900"}`}
                  title="First Page"
                >
                  |&lt;
                </button>
                <button
                  onClick={() => performSearch(query, activeCategory, currentPage - 1)}
                  disabled={currentPage <= 1}
                  className={`text-lg font-bold transition-colors ${currentPage <= 1 ? "text-slate-300 cursor-not-allowed" : "text-slate-600 hover:text-slate-900"}`}
                  title="Previous Page"
                >
                  &lt;
                </button>
              </div>

              {/* Page Numbers */}
              <div className="flex items-center gap-3">
                {pages.map((item, idx) => {
                  if (item === "...") {
                    return <span key={`ellipsis-${idx}`} className="text-slate-800 font-bold text-base px-1">...</span>;
                  }
                  
                  const pageNum = item as number;
                  const isActive = currentPage === pageNum;
                  
                  return (
                    <button
                      key={`page-${pageNum}`}
                      onClick={() => performSearch(query, activeCategory, pageNum)}
                      className={`text-base font-bold px-2 transition-all ${isActive ? "border-b-2" : "text-slate-800 hover:text-slate-600"}`}
                      style={{
                        color: isActive ? primaryColor : undefined,
                        borderColor: isActive ? primaryColor : "transparent",
                        paddingBottom: isActive ? "2px" : undefined
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {/* Next & Last */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => performSearch(query, activeCategory, currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className={`text-lg font-bold transition-colors ${currentPage >= totalPages ? "text-slate-300 cursor-not-allowed" : "text-slate-900 hover:text-slate-600"}`}
                  title="Next Page"
                >
                  &gt;
                </button>
                <button
                  onClick={() => performSearch(query, activeCategory, totalPages)}
                  disabled={currentPage >= totalPages}
                  className={`text-lg font-bold transition-colors ${currentPage >= totalPages ? "text-slate-300 cursor-not-allowed" : "text-slate-900 hover:text-slate-600"}`}
                  title="Last Page"
                >
                  &gt;|
                </button>
              </div>
            </div>
          );
        })()
      )}
    </div>
  );
};
