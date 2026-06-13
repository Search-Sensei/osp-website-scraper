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

  // Do not modify or inject any custom JS scripts. The developer will handle this manually.

  return `/sites/${replicationId}/index.html`;
}
