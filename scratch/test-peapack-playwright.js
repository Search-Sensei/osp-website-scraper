const { chromium } = require('playwright');

(async () => {
  console.log('Launching Playwright...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-web-security']
  });
  
  const context = await browser.newContext({
    ignoreHTTPSErrors: true
  });
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error' || msg.text().includes('PAGE LOG') || msg.text().includes('Blocked')) {
      console.log('PAGE LOG:', msg.text());
    }
  });

  page.on('request', request => {
    const url = request.url();
    if (url.includes('mock-search') || url.includes('/search?q=')) {
      console.log('>>> REQUEST:', request.method(), url);
    }
  });

  page.on('response', async response => {
    const url = response.url();
    if (url.includes('mock-search') || url.includes('/search?q=')) {
      console.log('<<< RESPONSE:', response.status(), url);
      try {
        const contentType = await response.headerValue('content-type');
        if (contentType && contentType.includes('application/json')) {
          const json = await response.json();
          console.log('    JSON:', JSON.stringify(json).slice(0, 150) + '...');
        }
      } catch(e) {}
    }
  });

  console.log('Navigating to local peapack site...');
  await page.goto('http://localhost:3000/scraper/sites/peapackprivate_com/index.html', { waitUntil: 'networkidle' });

  console.log('Typing query "Money" into the "Search Again" box...');
  await page.locator('#searchResults-search').fill('Money');
  
  console.log('Clicking the Search button...');
  await page.locator('#searchSubmitButton').click();
  
  // Wait for our DOM to update
  await page.waitForTimeout(2000);

  // Check if DOM updated
  const resultsHTML = await page.locator('.search-container').innerHTML();
  console.log('SEARCH CONTAINER HTML:\\n', resultsHTML);

  const querySpan = await page.locator('.search-query').first().textContent();
  console.log('QUERY SPAN:', querySpan);

  const currentUrl = page.url();
  console.log('CURRENT BROWSER URL:', currentUrl);

  console.log('Playwright test completed.');
  await browser.close();
})();
