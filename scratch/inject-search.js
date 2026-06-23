const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const homeHtmlPath = path.join(__dirname, '../public/sites/communitysavings_bank/home.html');
const html = fs.readFileSync(homeHtmlPath, 'utf8');
const $ = cheerio.load(html);

// Inject the search container
if ($('#sensei-top-search-container').length === 0) {
  $('<div id="sensei-top-search-container" class="d-flex align-items-center justify-content-center mr-3 z-50"></div>').insertBefore('.WantTo-toggle-container');
}

// Inject Search Config and Script
if ($('head script').text().indexOf('SENSEI_SEARCH_CONFIG') === -1) {
  const searchConfig = `
  <!-- Sensei Search Widget Config & Script -->
  <script>
    window.SENSEI_SEARCH_CONFIG = {
      siteId: "communitysavings_bank",
      primaryColor: "#005a8b",
      accentColor: "#e5c780",
      accentBgColor: "#f7f1e3",
      borderColor: "#c5cdd6",
      fontFamily: "'Work Sans', sans-serif",
      categories: ["All", "Personal", "Business", "Corporate", "Help and Support"],
      containerSelector: ".search-container",
      basePath: "/scraper",
      cssUrl: "/scraper/assets/sensei-search-widget.css?v=2",
      pageSize: 5
    };
  </script>
  <script src="/scraper/assets/sensei-search-widget.js?v=2"></script>
`;
  $('head').prepend(searchConfig);
}

fs.writeFileSync(homeHtmlPath, $.html());
console.log('Successfully injected search container and widget into home.html');
