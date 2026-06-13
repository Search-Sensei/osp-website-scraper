import fs from 'fs';
import path from 'path';

export async function runScraper(replicationId: string, url: string): Promise<string> {
  // @ts-ignore
  const scrape = (await import('website-scraper')).default;
  // @ts-ignore
  const PuppeteerPlugin = (await import('website-scraper-puppeteer')).default;

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
    plugins: [
      new PuppeteerPlugin({
        launchOptions: { headless: "new" }, /* optional */
        scrollToBottom: { timeout: 10000, viewportN: 10 }, /* optional */
        blockNavigation: true, /* optional */
      })
    ]
  };

  // Download the site and assets
  await scrape(options);

  // Do not modify or inject any custom JS scripts. The developer will handle this manually.

  return `/sites/${replicationId}/index.html`;
}
