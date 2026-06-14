import { runScraper } from '../lib/scraper';

async function main() {
  const url = process.argv[2];
  let customReplicationId = process.argv[3];
  const waitForSelector = process.argv[4];
  
  if (!url) {
    console.error('Usage: npm run clone -- <URL> [replicationId] [waitForSelector]');
    console.error('Example: npm run clone -- https://www.peapackprivate.com/search?q=Bank peapackprivate_com iframe');
    process.exit(1);
  }

  let domain = '';
  try {
    const parsedUrl = new URL(url);
    domain = parsedUrl.hostname.replace(/^www\./, '');
  } catch (e) {
    console.error('Invalid URL provided.');
    process.exit(1);
  }

  const replicationId = customReplicationId || domain.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  
  console.log(`Starting clone for: ${domain} (${url})`);
  console.log(`Saving to: public/sites/${replicationId}`);
  if (waitForSelector) {
    console.log(`Waiting for selector: ${waitForSelector}`);
  }

  try {
    await runScraper(replicationId, url, waitForSelector);
    console.log(`\n✅ Clone successful!`);
    console.log(`Local path: public/sites/${replicationId}`);
    console.log(`You can view it at: http://localhost:3000/scraper/sites/${replicationId}/index.html`);
  } catch (error) {
    console.error('Failed to clone site:', error);
    process.exit(1);
  }
}

main();
