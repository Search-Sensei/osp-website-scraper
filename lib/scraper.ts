import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { getInterceptorScript } from './search-interceptor';

export async function runScraper(replicationId: string, url: string, config: any): Promise<string> {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Remove old copy if it exists, then create fresh directory
    const outputDir = path.join(process.cwd(), 'public', 'sites', replicationId);
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true, force: true });
    }
    fs.mkdirSync(outputDir, { recursive: true });

    // Download page
    await page.goto(url, { waitUntil: 'load' });
    
    // Save rendered HTML
    let html = await page.content();
    
    // Inject <base> tag and force white background
    const baseUrl = new URL(url).origin;
    html = html.replace(/<head[^>]*>/i, (match) => `${match}<base href="${baseUrl}/"><style>body { background-color: #ffffff !important; }</style>`);

    // Inject our search interceptor
    const interceptor = getInterceptorScript(config);
    html = html.replace(/<\/body>/i, `${interceptor}</body>`);

    // Save to disk
    const outPath = path.join(outputDir, 'index.html');
    fs.writeFileSync(outPath, html);
    
    return `/sites/${replicationId}/index.html`;
  } finally {
    await browser.close();
  }
}
