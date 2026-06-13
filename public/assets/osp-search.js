/**
 * Common OSP Search Integration Script
 * 
 * This script is automatically injected into all cloned sites.
 * It provides a standard interface to call the OSP Search API.
 */

window.OSPSearch = {
  /**
   * Call the OSP Search API
   * @param {string} apiUrl - The full API URL (e.g., https://api.yourdomain.com/search)
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
   * Option 2: Site-Specific Adapter Attachment
   * Automatically wires up the cloned site's native DOM to our Search API.
   * 
   * @param {Object} config 
   * @param {string} config.apiUrl - The full API URL
   * @param {string} config.formSelector - CSS selector for the search form (to intercept submit)
   * @param {string} config.inputSelector - CSS selector for the search text input
   * @param {string} config.resultsContainerSelector - CSS selector for the HTML container where results go
   * @param {Function} config.renderTemplate - A function that takes a result object {title, detail, url} and returns an HTML string matching the native site's design.
   */
  attachAdapter(config) {
    const form = document.querySelector(config.formSelector);
    const input = document.querySelector(config.inputSelector);
    const container = document.querySelector(config.resultsContainerSelector);

    if (!form || !input || !container) {
      console.warn('OSP Search Adapter: Could not find one or more required DOM elements.');
      return;
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const query = input.value;
      if (!query) return;

      container.innerHTML = '<div style="padding: 20px; text-align: center;">Loading search results...</div>';
      
      const results = await this.search(config.apiUrl, query);
      
      container.innerHTML = '';
      
      if (results.length === 0) {
        container.innerHTML = '<div style="padding: 20px;">No results found.</div>';
        return;
      }

      results.forEach(result => {
        const html = config.renderTemplate(result);
        container.insertAdjacentHTML('beforeend', html);
      });
    });
  }
};

console.log('OSP Search Javascript loaded. Use window.OSPSearch.attachAdapter() to integrate native UI.');
