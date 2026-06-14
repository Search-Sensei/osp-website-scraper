const fs = require('fs');
const path = require('path');

const sitesDir = path.join(__dirname, 'public', 'sites');
const sites = fs.readdirSync(sitesDir);

sites.forEach(site => {
  const indexPath = path.join(sitesDir, site, 'index.html');
  if (fs.existsSync(indexPath)) {
    let html = fs.readFileSync(indexPath, 'utf8');
    
    // Replace href="..." inside <a> tags only
    // Using a regex that matches <a ... href="..." ...>
    // This is a naive regex but works for well-formed HTML
    html = html.replace(/(<a\s+[^>]*?)href="([^"]*)"([^>]*>)/gi, '$1href="javascript:void(0)"$3');
    
    // Also replace href="..." inside <bolt-button>
    html = html.replace(/(<bolt-button\s+[^>]*?)href="([^"]*)"([^>]*>)/gi, '$1href="javascript:void(0)"$3');

    fs.writeFileSync(indexPath, html);
    console.log(`Updated ${site}/index.html`);
  }
});
