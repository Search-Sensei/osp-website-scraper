/**
 * Common OSP Search Integration Script
 * 
 * Provides a flexible, configuration-driven adapter to wire up a cloned
 * static HTML site to the OSP Search API without modifying the native DOM structure.
 */

window.OSPSearch = {
  /**
   * Call the OSP Search API
   * @param {string} apiUrl - The full API URL
   * @param {string} query - The search query
   * @returns {Promise<Array>} - Array of result objects
   */
  async search(apiUrl, query) {
    if (!apiUrl || !query) return [];

    try {
      const response = await fetch(`${apiUrl}?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error('OSP Search API error:', response.statusText);
        return [];
      }

      const data = await response.json();
      return data?.data?.results || data?.results || data || [];
    } catch (error) {
      console.error('OSP Search failed:', error);
      return [];
    }
  },

  /**
   * Flexible Selector Adapter (Developer Workflow)
   * 
   * The developer configures this adapter with CSS selectors that map
   * to the already existing HTML structure on their local cloned site.
   * 
   * @param {Object} config - Configuration object
   * @param {string} config.apiUrl - Endpoint for the search API
   * @param {string} config.triggerSelector - Selector for the form or button to submit search
   * @param {string} config.inputSelector - Selector for the text input containing the query
   * @param {string} config.containerSelector - Selector for the wrapper containing all results
   * @param {string} config.templateRowSelector - Selector for the single item row template
   * @param {Object} config.mappings - Mapping object mapping fields to child selectors
   * @param {string} config.mappings.title - Selector for the title text
   * @param {string} config.mappings.detail - Selector for the detail text
   * @param {string} config.mappings.url - Selector for the anchor link
   */
  init(config) {
    let apiUrl = config.apiUrl || '/scraper/api/search';
    
    // Always use local mock API when running locally on dashboard
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      if (apiUrl.startsWith('/')) {
        apiUrl = `http://localhost:3000${apiUrl}`;
      }
    }
    
    const triggerEl = document.querySelector(config.triggerSelector);
    const inputEl = document.querySelector(config.inputSelector);
    const resultsContainer = document.querySelector(config.containerSelector);
    const firstRow = document.querySelector(config.templateRowSelector);

    if (!triggerEl || !inputEl || !resultsContainer || !firstRow) {
      console.warn('OSP Search: Missing required DOM elements for adapter. Check your config selectors.');
      return;
    }

    // Clean up IDs from the template so cloned rows don't have duplicate IDs
    const templateNode = firstRow.cloneNode(true);
    templateNode.removeAttribute('id');

    // Remove the template row from the DOM initially
    firstRow.remove();

    const performSearch = async (e) => {
      e.preventDefault();
      const query = inputEl.value;
      if (!query) return;

      resultsContainer.innerHTML = '<div style="padding: 20px; text-align: center;">Loading search results...</div>';

      const results = await window.OSPSearch.search(apiUrl, query);
      
      resultsContainer.innerHTML = ''; // Clear container

      if (results.length === 0) {
        resultsContainer.innerHTML = '<div style="padding: 20px;">No results found.</div>';
        return;
      }

      // Generate nodes from the template
      results.forEach(result => {
        const rowNode = templateNode.cloneNode(true);
        
        const titleEl = rowNode.querySelector(config.mappings.title);
        if (titleEl) titleEl.textContent = result.title;

        const detailEl = rowNode.querySelector(config.mappings.detail);
        if (detailEl) detailEl.innerHTML = result.detail;

        const urlEl = rowNode.querySelector(config.mappings.url);
        if (urlEl) {
           if (urlEl.tagName.toLowerCase() === 'a') {
             urlEl.href = result.url || '#';
           } else {
             urlEl.textContent = result.url || '#';
           }
        }

        resultsContainer.appendChild(rowNode);
      });
    };

    // Bind events
    if (triggerEl.tagName.toLowerCase() === 'form') {
      triggerEl.addEventListener('submit', performSearch);
    } else {
      triggerEl.addEventListener('click', performSearch);
      
      inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          performSearch(e);
        }
      });
    }
    
    // Automatically trigger initial search if there is a query string param (e.g. ?q=Bank)
    const urlParams = new URLSearchParams(window.location.search);
    const urlQuery = urlParams.get('q') || urlParams.get('query');
    if (urlQuery) {
      inputEl.value = urlQuery;
      // Synthesize an event
      performSearch(new Event('submit'));
    }
  }
};

console.log('OSP Search Javascript loaded. Adapters are available.');
