const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('http://localhost:3000/scraper/sites/nationwide_com/index.html');
  await page.waitForTimeout(2000); // wait for load
  await page.screenshot({ path: 'nationwide-screenshot.png', fullPage: true });
  await browser.close();
})();
