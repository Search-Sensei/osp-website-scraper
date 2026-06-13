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
   * Generic HTML Builder (Placeholder approach)
   * 
   * Takes an HTML string template with {{title}}, {{detail}}, and {{url}} placeholders,
   * replaces them with the actual result data, and returns a DocumentFragment containing
   * the populated DOM nodes.
   * 
   * @param {string} templateHtml - The HTML string representing a single result row, containing placeholders.
   * @param {Array} results - Array of result objects from the OSP Search API
   * @returns {DocumentFragment} - A fragment containing all the populated DOM nodes
   */
  buildResultNodes(templateHtml, results) {
    const fragment = document.createDocumentFragment();

    if (!results || results.length === 0 || !templateHtml) {
      return fragment;
    }

    // Generate nodes from the template for each result
    results.forEach(result => {
      // Replace all placeholders using regex to handle multiple occurrences
      let populatedHtml = templateHtml
        .replace(/\{\{title\}\}/g, result.title || '')
        .replace(/\{\{detail\}\}/g, result.detail || '')
        .replace(/\{\{url\}\}/g, result.url || '#');

      // Create a temporary container to parse the string into a DOM node
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = populatedHtml.trim();
      
      const templateNode = tempDiv.firstElementChild;
      if (templateNode) {
        // Clean up IDs from the template so cloned rows don't have duplicate IDs
        templateNode.removeAttribute('id');
        fragment.appendChild(templateNode);
      }
    });

    return fragment;
  }
};

console.log('OSP Search Javascript loaded. Generic utility functions are available.');
