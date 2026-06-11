import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { query } from './db';
import { getInterceptorScript } from './search-interceptor';

export async function runScraper(replicationId: string, url: string, config: any) {
  try {
    await query("UPDATE site_replications SET status = 'COPYING' WHERE id = $1", [replicationId]);
    
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Create local directory
    const outputDir = path.join(process.cwd(), 'public', 'sites', replicationId);
    fs.mkdirSync(outputDir, { recursive: true });

    // Download page
    await page.goto(url, { waitUntil: 'networkidle' });
    
    // Save rendered HTML and inject a <base> tag to resolve relative assets 
    // back to the original domain, ensuring perfect visual fidelity
    let html = await page.content();
    
    // Inject <base> tag using regex to handle attributes on <head>
    const baseUrl = new URL(url).origin;
    html = html.replace(/<head[^>]*>/i, (match) => `${match}<base href="${baseUrl}/">`);

    // Inject our search interceptor
    const interceptor = getInterceptorScript(config);
    html = html.replace(/<\/body>/i, `${interceptor}</body>`);

    // Save to disk
    fs.writeFileSync(path.join(outputDir, 'index.html'), html);
    
    await browser.close();

    await query("UPDATE site_replications SET status = 'COMPLETED', cloned_path = $1 WHERE id = $2", 
      [`/sites/${replicationId}/index.html`, replicationId]);

  } catch (error: any) {
    await query("UPDATE site_replications SET status = 'FAILED', error_message = $1 WHERE id = $2", 
      [error.message, replicationId]);
  }
}
