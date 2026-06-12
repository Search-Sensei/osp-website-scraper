/**
 * Common OSP Search Integration Script
 * 
 * This script is automatically injected into all cloned sites.
 * It provides a standard interface to call the OSP Search API.
 * 
 * Developers can manually modify the cloned index.html to hook
 * their search inputs and result containers to this library.
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
      
      // Standardize the response mapping here if needed
      // Currently assumes the API returns { data: { results: [...] } }
      return data?.data?.results || data?.results || data || [];
    } catch (error) {
      console.error('OSP Search failed:', error);
      return [];
    }
  }
};

console.log('OSP Search Javascript loaded. Use window.OSPSearch.search() to integrate.');
