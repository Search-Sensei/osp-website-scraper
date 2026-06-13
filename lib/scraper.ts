import fs from 'fs';
import path from 'path';

export async function runScraper(replicationId: string, url: string, adapterConfig?: any): Promise<string> {
  // @ts-ignore
  const scrape = (await import('website-scraper')).default;
  const outputDir = path.join(process.cwd(), 'public', 'sites', replicationId);
  
  // Remove old copy if it exists
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true, force: true });
  }

  const options = {
    urls: [url],
    directory: outputDir,
    recursive: false,
    maxRecursiveDepth: 0,
  };

  // Download the site and assets
  await scrape(options);

  // Inject our common search javascript into the downloaded index.html
  const indexPath = path.join(outputDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    let html = fs.readFileSync(indexPath, 'utf-8');
    
    let initScript = '';
    if (adapterConfig && adapterConfig.search_form_selector) {
      const configObj = {
        apiUrl: '/scraper/api/search',
        formSelector: adapterConfig.search_form_selector,
        inputSelector: adapterConfig.search_input_selector,
        rowSelector: adapterConfig.result_row_selector,
        titleSelector: adapterConfig.result_title_selector,
        detailSelector: adapterConfig.result_detail_selector,
        urlSelector: adapterConfig.result_url_selector
      };
      
      initScript = `\n<script>
window.addEventListener('DOMContentLoaded', () => {
  if (window.OSPSearch && window.OSPSearch.attachTemplateAdapter) {
    window.OSPSearch.attachTemplateAdapter(${JSON.stringify(configObj)});
  }
});
</script>`;
    }

    const commonScript = `<script src="/scraper/assets/osp-search.js"></script>${initScript}
<script>
// Block navigation to other pages but keep JS clicks (like menus) working
document.addEventListener('click', function(e) {
  const anchor = e.target.closest('a');
  if (!anchor) return;
  const href = anchor.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;
  e.preventDefault();
  console.log('Navigation blocked to prevent leaving the preview mode:', href);
});
</script>`;
    html = html.replace(/<\/body>/i, `${commonScript}</body>`);
    fs.writeFileSync(indexPath, html);
  }
  
  return `/sites/${replicationId}/index.html`;
}
