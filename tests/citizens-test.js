const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Navigating to local site...');
  await page.goto('http://localhost:3000/scraper/sites/citizensbank_com/index.html', { waitUntil: 'domcontentloaded' });

  let mockApiCalled = false;
  
  page.on('console', msg => {
    console.log(`[Browser Console] ${msg.type()}: ${msg.text()}`);
    if (msg.text().includes('Static search triggered for:')) {
      mockApiCalled = true;
      console.log('Intercepted search trigger in console!');
    }
  });

  console.log('Waiting for search input...');
  try {
    await page.waitForSelector('#custom-static-search-input', { state: 'attached', timeout: 10000 });
  } catch (e) {
    console.log("Selector not found! Dumping page HTML:");
    const html = await page.content();
    console.log(html.substring(0, 2000) + "... [truncated]");
    
    // specifically check if our container exists
    const container = await page.$('#answers-container');
    console.log("Does #answers-container exist?", !!container);
    process.exit(1);
  }

  console.log('Filling search query...');
  await page.fill('#custom-static-search-input', 'insurance', { force: true });
  
  console.log('Submitting search form...');
  await page.focus('#custom-static-search-input');
  await page.keyboard.press('Enter');

  console.log('Waiting for search results to render...');
  await page.waitForSelector('.HitchhikerResultsStandard-Card', { timeout: 10000 });

  const cardCount = await page.locator('.HitchhikerResultsStandard-Card').count();
  console.log(`Found ${cardCount} search result cards!`);

  if (!mockApiCalled) {
    console.error('Test Failed: Search interceptor was not triggered!');
    process.exit(1);
  }

  if (cardCount === 0) {
    console.error('Test Failed: No search results were rendered to the DOM!');
    process.exit(1);
  }

  console.log('Test Passed Successfully! Search is working without page refresh on Citizens Bank.');
  await browser.close();
})();
