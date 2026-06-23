const scrape = require('website-scraper');

const options = {
  urls: ['https://www.communitysavings.bank/search'],
  directory: './test_scrape',
  recursive: false,
  maxRecursiveDepth: 0,
};

scrape(options).then((result) => {
  console.log("Success:", result);
}).catch((err) => {
  console.error("Error:", err);
});
