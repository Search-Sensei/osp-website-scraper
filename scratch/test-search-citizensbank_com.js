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
    if (msg.type() === 'error' || msg.text().includes('PAGE LOG') || msg.text().includes('Blocked') || msg.text().includes('Proxying') || msg.text().includes('Intercepting cross-domain iframe')) {
      console.log('PAGE LOG:', msg.text());
    }
  });

  page.on('request', request => {
    const url = request.url();
    console.log('>>> REQUEST:', request.method(), url);
  });

  page.on('response', async response => {
    const url = response.url();
    if (url.includes('mock-search') || url.includes('mock-iframe')) {
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

  console.log('Navigating to local citizensbank site with query=Bank...');
  await page.goto('http://localhost:3000/scraper/sites/citizensbank_com/index.html?query=Bank', { waitUntil: 'networkidle' });

  // Wait for our DOM to update (since it's an iframe, we need to wait for the iframe to load)
  await page.waitForTimeout(5000);

  // Check if the mock iframe was injected and loaded
  const iframeElement = await page.waitForSelector('iframe');
  console.log('IFRAME FOUND');
  
  const frame = await iframeElement.contentFrame();
  if (frame) {
    console.log('Got iframe content frame!');
    // Wait for the answers container or results
    try {
        await frame.waitForLoadState('networkidle', { timeout: 10000 });
        const html = await frame.locator('body').innerHTML();
        console.log('IFRAME BODY HTML LENGTH:', html.length);
        if (html.includes('Checking Accounts at Citizens Bank')) {
            console.log('MOCK DATA FOUND IN IFRAME!');
        } else {
            console.log('Mock data not found in iframe body. Printing snippet:', html.slice(0, 500));
        }
    } catch(e) {
        console.log('Error getting iframe content:', e);
    }
  } else {
    console.log('Could not get iframe content frame.');
  }

  const currentUrl = page.url();
  console.log('CURRENT BROWSER URL:', currentUrl);

  console.log('Playwright test completed.');
  await browser.close();
})();
