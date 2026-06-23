const http = require('http');

async function testApi() {
  const tokenUrl = process.env.OAUTH_TOKEN_URL;
  const tokenParams = new URLSearchParams();
  tokenParams.append('grant_type', 'client_credentials');
  tokenParams.append('client_id', 'osp-m2m-communitysavings');
  tokenParams.append('client_secret', process.env.COMMUNITYSAVINGS_CLIENT_SECRET);

  const tokenRes = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: tokenParams.toString()
  });
  const tokenData = await tokenRes.json();
  const token = tokenData.access_token;

  let targetUrl = process.env.OSP_SEARCH_API_URL.replace('/search', '/suggestions/search');
  
  const payloads = [
    { query: "Bank", NumSuggestedSearches: 10 },
    { prefix: "Bank", NumSuggestedSearches: 10 },
    { keyword: "Bank", NumSuggestedSearches: 10 },
    { text: "Bank", NumSuggestedSearches: 10 },
    { search: "Bank", NumSuggestedSearches: 10 }
  ];

  for (let i = 0; i < payloads.length; i++) {
    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-active-tenant': 'communitysavings',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payloads[i])
    });
    console.log(`Payload ${i} status: ${res.status}`);
    const text = await res.text();
    if (res.ok) {
        console.log(`Payload ${i} success: ${text.substring(0, 100)}`);
        break; // Stop if we find the correct one
    } else {
        console.log(`Payload ${i} error: ${text}`);
    }
  }
}
testApi();
