const scrape = require('website-scraper').default;

const options = {
  urls: ['https://www.communitysavings.bank/search'],
  directory: './test_scrape2',
  recursive: false,
  maxRecursiveDepth: 0,
};

scrape(options).then((result) => {
  console.log("Success");
}).catch((err) => {
  console.error("Error:", err);
});
