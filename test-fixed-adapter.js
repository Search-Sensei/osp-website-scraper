const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Go to the cloned peapack demo site
  await page.goto('http://localhost:3000/scraper/sites/peapackprivate_com/index.html', { waitUntil: 'networkidle2' });
  
  // Type into the new osp-search-input
  await page.type('#osp-search-input', 'Bank');
  
  // Click the search trigger
  await page.click('#searchSubmitButton'); // Assuming the submit button still works

  // Wait for results to be injected into osp-search-result-row
  await page.waitForTimeout(3000);

  // Capture a screenshot
  await page.screenshot({ path: 'fixed-workflow-test.png', fullPage: true });

  await browser.close();
})();
