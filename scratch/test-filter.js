const http = require('http');
http.get('http://localhost:3000/scraper/api/mock-search/communitysavings_bank/search?q=Bank&pageSize=100', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log("Navigators:", JSON.stringify(json.body.navigators, null, 2));
      const firstResult = json.body.results[0];
      console.log("First result keys:", Object.keys(firstResult));
      console.log("First result categories:", firstResult.categories);
      console.log("First result category:", firstResult.category);
      console.log("First result source:", firstResult.source);
    } catch (e) {
      console.error(e);
    }
  });
});
