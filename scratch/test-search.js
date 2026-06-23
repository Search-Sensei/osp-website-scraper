const puppeteer = require('puppeteer');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  // Capture console logs from the page
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  // Capture network requests
  page.on('request', request => {
    if (request.url().includes('yext') || request.url().includes('mock-search')) {
      console.log('>>> REQUEST:', request.method(), request.url());
      const frame = request.frame();
      console.log('    FRAME:', frame ? frame.url() : 'no-frame');
      const initiator = request.initiator();
      if (initiator && initiator.url) {
        console.log('    INITIATOR URL:', initiator.url);
      }
      if (initiator && initiator.stack) {
        console.log('    INITIATOR STACK:', JSON.stringify(initiator.stack, null, 2));
      }
    }
  });

  page.on('response', async response => {
    if (response.url().includes('yext') || response.url().includes('mock-search')) {
      console.log('<<< RESPONSE:', response.status(), response.url());
      if (response.status() !== 200) {
        console.log('BODY:', await response.text().catch(() => 'could not read body'));
      }
    }
  });

  console.log('Navigating to local site...');
  await page.goto('http://localhost:3000/scraper/sites/nationwide_com/index.html', { waitUntil: 'networkidle2' });

  console.log('Looking for iframe...');
  const iframes = await page.$$eval('iframe', frames => frames.map(f => ({ id: f.id, src: f.src })));
  console.log('IFRAMES IN DOM:', JSON.stringify(iframes, null, 2));

  await browser.close();
  console.log('Done.');
})();
