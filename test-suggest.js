const https = require('https');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function test() {
  const tokenParams = new URLSearchParams();
  tokenParams.append('grant_type', 'client_credentials');
  tokenParams.append('client_id', 'osp-m2m-communitysavings');
  tokenParams.append('client_secret', 'ZA5sw3noiwVESJc6j9st036Lvmdl1NEy'); // from .env

  const tokenResponse = await fetch("https://20.70.168.13:8443/realms/OSP-DEV/protocol/openid-connect/token", {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: tokenParams.toString()
  });

  const tokenData = await tokenResponse.json();
  const token = tokenData.access_token;
  
  if (!token) {
      console.error("Failed to get token", tokenData);
      return;
  }

  try {
    const res = await fetch("https://20.70.168.13/kong/api/search/all/suggested/bank", {
      method: 'GET',
      headers: {
        "x-active-tenant": "communitysavings",
        "Authorization": `Bearer ${token}`
      }
    });
    console.log("GET status:", res.status);
    console.log(await res.text());
  } catch (e) {
    console.error(e);
  }

  try {
    const res = await fetch("https://20.70.168.13/kong/api/search/all/suggested/bank", {
      method: 'POST',
      headers: {
        "x-active-tenant": "communitysavings",
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    });
    console.log("POST status:", res.status);
    console.log(await res.text());
  } catch (e) {
    console.error(e);
  }
}
test();
