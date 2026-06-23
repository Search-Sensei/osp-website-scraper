const scrape = require('website-scraper');
const PuppeteerPlugin = require('website-scraper-puppeteer').default;

scrape({
    urls: ['https://www.peapackprivate.com/search?q=Bank'],
    directory: './test-puppeteer-output',
    plugins: [
        new PuppeteerPlugin({
            launchOptions: { headless: "new" }, 
            scrollToBottom: { timeout: 10000, viewportN: 10 } 
        })
    ]
}).then(() => console.log('success')).catch(console.error);
