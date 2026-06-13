const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });
  
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

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
        if (response.headers()['content-type']?.includes('application/json')) {
          console.log('    JSON:', await response.json());
        }
      } catch(e) {}
    }
  });

  console.log('Navigating to local peapack site with query...');
  await page.goto('http://localhost:3000/scraper/sites/peapackprivate_com/index.html?q=Money', { waitUntil: 'networkidle2' });

  await new Promise(r => setTimeout(r, 2000));
  
  await new Promise(r => setTimeout(r, 2000));

  // Check if DOM updated
  const results = await page.evaluate(() => {
    return document.querySelector('.search-container')?.innerHTML;
  });
  console.log('SEARCH CONTAINER HTML:', results);

  const querySpan = await page.evaluate(() => {
    return document.querySelector('.search-query')?.textContent;
  });
  console.log('QUERY SPAN:', querySpan);

  const currentUrl = await page.evaluate(() => window.location.href);
  console.log('CURRENT BROWSER URL:', currentUrl);

  console.log('Done.');
  await browser.close();
})();
