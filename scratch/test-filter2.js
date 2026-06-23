const http = require('http');
http.get('http://localhost:3000/scraper/api/mock-search/communitysavings_bank/search?q=Bank&pageSize=100', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      // Find the first item that has "Business" in some field
      const busItem = json.body.results.find(r => JSON.stringify(r).includes('Business'));
      console.log(JSON.stringify(busItem, null, 2));
    } catch (e) {
      console.error(e);
    }
  });
});
