import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

export async function runScraper(replicationId: string, url: string, waitForSelector?: string): Promise<string> {
  // @ts-ignore
  const scrape = (await import('website-scraper')).default;

  const outputDir = path.join(process.cwd(), 'public', 'sites', replicationId);

  // Remove old copy if it exists
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true, force: true });
  }

  class CustomPuppeteerPlugin {
    browser: any;
    mainUrl: string;
    hasProcessedMain: boolean = false;

    constructor(mainUrl: string) {
      this.mainUrl = mainUrl;
    }

    apply(registerAction: any) {
      registerAction('beforeStart', async () => {
        this.browser = await puppeteer.launch({ 
          headless: true, 
          args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox'
          ] 
        });
      });
      
      registerAction('afterResponse', async ({ response }: any) => {
        const contentType = response.headers['content-type'];
        const isHtml = contentType && contentType.split(';')[0] === 'text/html';
        
        // Match the base url ignoring query strings to apply the wait
        const isMainUrl = response.url.split('?')[0].replace(/\/$/, '') === this.mainUrl.split('?')[0].replace(/\/$/, '');

        if (isHtml && isMainUrl && !this.hasProcessedMain) {
          this.hasProcessedMain = true;
          const page = await this.browser.newPage();
          await page.goto(response.url, { waitUntil: 'networkidle2' });
          console.log(`Waiting 15 seconds for DOM to load for ${response.url}...`);
          await new Promise(r => setTimeout(r, 15000));
          
          // Scroll to bottom just in case
          await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
          await new Promise(r => setTimeout(r, 2000));
          
          const content = await page.content();
          await page.close();
          return Buffer.from(content).toString('binary');
        }
        return response.body;
      });
      
      registerAction('afterFinish', () => this.browser && this.browser.close());
    }
  }

  const options = {
    urls: [url],
    directory: outputDir,
    recursive: false,
    maxRecursiveDepth: 0,
    plugins: [new CustomPuppeteerPlugin(url)]
  };

  // Download the site and assets
  await scrape(options);

  return `/sites/${replicationId}/index.html`;
}
