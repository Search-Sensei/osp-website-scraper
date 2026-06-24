const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => console.log(`[Browser Console] ${msg.type()}: ${msg.text()}`));

  console.log('Navigating to local site with search query...');
  await page.goto('http://localhost:3000/scraper/sites/communitysavings_bank/index.html?q=mock', { waitUntil: 'networkidle' });

  console.log('Waiting for search results to render...');
  await page.waitForSelector('.search-item', { state: 'visible', timeout: 10000 });

  const cards = await page.$$('.search-item');
  console.log(`Found ${cards.length} search result items!`);

  console.log('Verifying Answer component...');
  const answerVisible = await page.locator('text=AI Answer').isVisible();
  if (!answerVisible) {
    console.error('Test Failed! Answer component is missing.');
    process.exit(1);
  } else {
    console.log('Answer component found successfully.');
  }

  if (cards.length > 0) {
    console.log('Test Passed Successfully! Search and Answer component are working.');
  } else {
    console.error('Test Failed! No search results rendered.');
    process.exit(1);
  }

  await browser.close();
})();
