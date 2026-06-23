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

  // Try top-level filters
  const payloads = [
    {
      profile: 'all', query: 'Bank',
      filters: { category: { $eq: "Business" } },
      searchDefinition: { page: 1, pageSize: 2 }
    },
    {
      profile: 'all', query: 'Bank',
      filters: [{ name: "category", value: "Business" }],
      searchDefinition: { page: 1, pageSize: 2 }
    },
    {
      profile: 'all', query: 'Bank',
      searchDefinition: { page: 1, pageSize: 2, filters: { category: ["Business"] } }
    },
    {
      profile: 'all', query: 'Bank',
      searchDefinition: { page: 1, pageSize: 2, filters: [{ name: "category", value: "Business" }] }
    }
  ];

  for (let i = 0; i < payloads.length; i++) {
    const p = payloads[i];
    const res = await fetch(process.env.OSP_SEARCH_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-active-tenant': 'communitysavings',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(p)
    });
    const text = await res.text();
    console.log(`Payload ${i} status: ${res.status}`);
    if (res.ok) {
        const json = JSON.parse(text);
        console.log(`Payload ${i} total results: ${json.body.resultsCount}`);
    } else {
        console.log(`Payload ${i} error: ${text}`);
    }
  }
}

testApi();
