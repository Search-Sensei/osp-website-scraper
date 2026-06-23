const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const srcDir = path.join(__dirname, '../public/sites/communitysavings_bank_home');
const destDir = path.join(__dirname, '../public/sites/communitysavings_bank');

// 1. Move index.html to home.html
fs.renameSync(path.join(srcDir, 'index.html'), path.join(destDir, 'home.html'));

// 2. Copy all other assets recursively
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest);
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    // Only copy if it's not index.html since we moved it
    if (path.basename(src) !== 'index.html') {
      fs.copyFileSync(src, dest);
    }
  }
}
copyRecursiveSync(srcDir, destDir);

// 3. Clean up old dir
fs.rmSync(srcDir, { recursive: true, force: true });

// 4. Modify home.html
const homeHtmlPath = path.join(destDir, 'home.html');
const html = fs.readFileSync(homeHtmlPath, 'utf8');
const $ = cheerio.load(html);

// a. all links avoid action
$('a').attr('href', 'javascript:void(0)');

// b. link logo to home.html
$('.logo').attr('href', '/scraper/sites/communitysavings_bank/home.html');

// c. Search form action
$('form[action="/search"]').attr('action', '/scraper/sites/communitysavings_bank/index.html');

// d. Remove existing base tag if website-scraper added it (just in case)
$('base').remove();

// e. Inject Chat widget
const chatWidgetCode = `
  <!-- Sensei Chat Widget Injected Config & Script -->
  <script>
    window.SENSEI_CHAT_CONFIG = {
      apiBaseUrl: "https://sensei-agents.australiaeast.cloudapp.azure.com/csb",
      title: "Community Savings Bank Assistant",
      buttonText: "Message Us",
      primaryColor: "#aa801a",
      secondaryColor: "#aa801a",
      logoUrl: "/scraper/sites/communitysavings_bank/fonts/small2-csb-iowa-logo.svg",
      cssUrl: "/scraper/assets/sensei-chat-widget.css?v=2",
      basePath: "/scraper"
    };
  </script>
  <script src="/scraper/assets/sensei-chat-widget.js?v=2"></script>
`;
$('body').append(chatWidgetCode);

fs.writeFileSync(homeHtmlPath, $.html());
console.log('Successfully processed home.html');
