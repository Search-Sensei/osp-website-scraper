const http = require('http');
http.get('http://localhost:3000/scraper/api/mock-search/communitysavings_bank/search?q=Bank', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log(JSON.stringify(json.body.results[0], null, 2));
    } catch (e) {
      console.log(data);
    }
  });
}).on('error', (e) => {
  console.error(e);
});
