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
   * Generic DOM Builder
   * 
   * Takes a template HTML string and an array of results, and returns a DocumentFragment
   * containing the fully populated DOM nodes.
   * 
   * @param {Object} config - Configuration object
   * @param {string} config.templateHtml - The HTML string representing a single result row
   * @param {Object} config.mappings - Mapping object mapping fields to child selectors
   * @param {string} config.mappings.title - Selector for the title text
   * @param {string} config.mappings.detail - Selector for the detail text
   * @param {string} config.mappings.url - Selector for the anchor link
   * @param {Array} results - Array of result objects from the OSP Search API
   * @returns {DocumentFragment} - A fragment containing all the populated DOM nodes
   */
  buildResultNodes(config, results) {
    const fragment = document.createDocumentFragment();

    if (!results || results.length === 0) {
      return fragment;
    }

    // Create a temporary container to parse the template HTML string into a DOM node
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = config.templateHtml.trim();
    const templateNode = tempDiv.firstElementChild;

    if (!templateNode) {
      console.error('OSP Search: Invalid template HTML provided.');
      return fragment;
    }

    // Clean up IDs from the template so cloned rows don't have duplicate IDs
    templateNode.removeAttribute('id');

    // Generate nodes from the template for each result
    results.forEach(result => {
      const rowNode = templateNode.cloneNode(true);
      
      if (config.mappings.title) {
        const titleEl = rowNode.querySelector(config.mappings.title);
        if (titleEl) titleEl.textContent = result.title;
      }

      if (config.mappings.detail) {
        const detailEl = rowNode.querySelector(config.mappings.detail);
        if (detailEl) detailEl.innerHTML = result.detail;
      }

      if (config.mappings.url) {
        const urlEl = rowNode.querySelector(config.mappings.url);
        if (urlEl) {
           if (urlEl.tagName.toLowerCase() === 'a') {
             urlEl.href = result.url || '#';
           } else {
             urlEl.textContent = result.url || '#';
           }
        }
      }

      fragment.appendChild(rowNode);
    });

    return fragment;
  }
};

console.log('OSP Search Javascript loaded. Generic utility functions are available.');
