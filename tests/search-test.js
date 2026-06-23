const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Navigating to local site...');
  await page.goto('http://localhost:3000/scraper/sites/nationwide_com/index.html', { waitUntil: 'domcontentloaded' });

  // Listen for the custom mock API call
  let mockApiCalled = false;
  
  // Since we are mocking the fetch in custom-search.js using a simulated delay and hardcoded data
  // for now, we will monitor the console logs to see if "Static search triggered" appears.
  // If the user's backend API was actually connected, we would use page.route('/api/search') here.
  page.on('console', msg => {
    console.log(`[Browser Console] ${msg.type()}: ${msg.text()}`);
    if (msg.text().includes('Static search triggered for:')) {
      mockApiCalled = true;
      console.log('Intercepted search trigger in console!');
    }
  });

  console.log('Waiting for search input...');
  await page.waitForSelector('.yxt-SearchBar-input', { state: 'visible', timeout: 15000 });

  console.log('Filling search query...');
  await page.fill('.yxt-SearchBar-input', 'insurance');
  
  console.log('Submitting search form...');
  await page.click('.js-yext-submit');

  console.log('Waiting for search results to render...');
  // The custom JS adds `.HitchhikerResultsStandard-Card`
  await page.waitForSelector('.HitchhikerResultsStandard-Card', { timeout: 5000 });

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

  console.log('Test Passed Successfully! Search is working without page refresh.');
  await browser.close();
})();
