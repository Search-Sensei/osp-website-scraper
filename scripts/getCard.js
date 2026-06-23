const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto('https://search.nationwide.com.pagescdn.com/?query=bank', { waitUntil: 'networkidle2' });
  
  await page.waitForSelector('.HitchhikerProductProminentImage-titleLink', { timeout: 15000 });
  const html = await page.evaluate(() => {
    return document.querySelector('.HitchhikerResultsStandard-items').innerHTML;
  });
  
  fs.writeFileSync('card.html', html);
  console.log('Saved card.html');
  await browser.close();
})();
