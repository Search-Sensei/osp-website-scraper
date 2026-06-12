import fs from 'fs';
import path from 'path';

export async function runScraper(replicationId: string, url: string): Promise<string> {
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
    const commonScript = `<script src="/scraper/assets/osp-search.js"></script>
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
