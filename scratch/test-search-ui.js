const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1800, height: 992 } });
  const page = await context.newPage();

  console.log('Navigating to communitysavings_bank/index.html...');
  await page.goto('http://localhost:3000/scraper/sites/communitysavings_bank/index.html');
  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: 'scratch/community_index.png', fullPage: false });
  console.log('Saved scratch/community_index.png');

  console.log('Navigating to communitysavings_bank/home.html...');
  await page.goto('http://localhost:3000/scraper/sites/communitysavings_bank/home.html');
  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: 'scratch/community_home.png', fullPage: false });
  console.log('Saved scratch/community_home.png');

  await browser.close();
})();
