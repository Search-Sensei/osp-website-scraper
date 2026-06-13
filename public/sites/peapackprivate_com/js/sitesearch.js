// Inject the common OSPSearch script
const script = document.createElement('script');
script.src = '/scraper/assets/osp-search.js';
script.onload = () => {
  // Initialize the search using native CSS selectors from the Peapack site
  window.OSPSearch.init({
    apiUrl: '/scraper/api/search', // Will hit our local Next.js mock API
    triggerSelector: '.search-form',
    inputSelector: '#searchResults-search',
    containerSelector: '.search-container',
    templateRowSelector: '.search-item',
    mappings: {
      title: '.search-title',
      detail: '.search-summary',
      url: '.search-link'
    }
  });
};
document.head.appendChild(script);
