const https = require('https');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function test() {
  const tokenParams = new URLSearchParams();
  tokenParams.append('grant_type', 'client_credentials');
  tokenParams.append('client_id', 'osp-m2m-communitysavings');
  tokenParams.append('client_secret', 'ZA5sw3noiwVESJc6j9st036Lvmdl1NEy');

  const tokenResponse = await fetch("https://20.70.168.13:8443/realms/OSP-DEV/protocol/openid-connect/token", {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: tokenParams.toString()
  });

  const tokenData = await tokenResponse.json();
  const token = tokenData.access_token;
  
  try {
    const res = await fetch("https://20.70.168.13/osp-backend-api/search", {
      method: 'POST',
      headers: {
        "x-active-tenant": "communitysavings",
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        profile: "all",
        query: "checking"
      })
    });
    const data = await res.json();
    console.log("Keys in body:", Object.keys(data.body));
    console.log("Results length:", data.body.results?.length);
    console.log("Is there a count?", data.body.count, data.body.total, data.body.totalResults, data.body.resultsCount);
  } catch (e) {
    console.error(e);
  }
}
test();
