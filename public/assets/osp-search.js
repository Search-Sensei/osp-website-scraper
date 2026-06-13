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
   * Fixed ID Adapter (Developer Workflow)
   * The developer must add the following IDs/Classes to their native HTML:
   * - Trigger (Button/Form): id="osp-search-trigger"
   * - Input field: id="osp-search-input"
   * - Result template row: id="osp-search-result-row"
   * - Title text: class="osp-title"
   * - Detail text: class="osp-detail"
   * - URL link: class="osp-url"
   */
  attachFixedAdapter(config) {
    const apiUrl = config.apiUrl || '/scraper/api/search';
    
    const triggerEl = document.getElementById('osp-search-trigger');
    const inputEl = document.getElementById('osp-search-input');
    const firstRow = document.getElementById('osp-search-result-row');

    if (!triggerEl || !inputEl || !firstRow) {
      console.warn('OSP Search: Missing required DOM elements for fixed adapter. Ensure osp-search-trigger, osp-search-input, and osp-search-result-row IDs exist in the HTML.');
      return;
    }

    const resultsContainer = firstRow.parentElement;
    
    // Clean up IDs from the template so cloned rows don't have duplicate IDs
    const templateNode = firstRow.cloneNode(true);
    templateNode.removeAttribute('id');

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
        
        const titleEl = rowNode.querySelector('.osp-title');
        if (titleEl) titleEl.textContent = result.title;

        const detailEl = rowNode.querySelector('.osp-detail');
        if (detailEl) detailEl.textContent = result.detail;

        const urlEl = rowNode.querySelector('.osp-url');
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
  }
};

console.log('OSP Search Javascript loaded. Adapters are available.');
