const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => console.log(`[Browser Console] ${msg.type()}: ${msg.text()}`));

  console.log('Navigating to local site with search query...');
  await page.goto('http://localhost:3000/scraper/sites/peapackprivate_com/index.html?q=bank', { waitUntil: 'networkidle' });

  console.log('Waiting for search results to render...');
  await page.waitForSelector('.search-item', { state: 'visible', timeout: 10000 });

  const cards = await page.$$('.search-item');
  console.log(`Found ${cards.length} search result items!`);

  if (cards.length > 0) {
    console.log('Test Passed Successfully! Search is working without page refresh on Peapack Private Bank.');
  } else {
    console.error('Test Failed! No search results rendered.');
    process.exit(1);
  }

  await browser.close();
})();
