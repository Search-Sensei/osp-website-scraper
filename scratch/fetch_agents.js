const https = require("https");
require("dotenv").config({ path: ".env.local" }); // Load env vars if any

async function main() {
  const clientId = 'osp-m2m-communitysavings';
  const clientSecret = process.env.COMMUNITYSAVINGS_CLIENT_SECRET;
  const tokenUrl = process.env.OAUTH_TOKEN_URL;
  if (!clientSecret || !tokenUrl) {
    console.log("Missing env vars");
    return;
  }
  const tokenParams = new URLSearchParams();
  tokenParams.append('grant_type', 'client_credentials');
  tokenParams.append('client_id', clientId);
  tokenParams.append('client_secret', clientSecret);

  const tokenResponse = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: tokenParams.toString()
  });
  const tokenData = await tokenResponse.json();
  const token = tokenData.access_token;
  
  const agentsAgent = new https.Agent({ rejectUnauthorized: false });
  const response = await fetch("https://20.70.168.13/osp-backend-api/chat/active-agents", {
    headers: {
      "Authorization": "Bearer " + token,
      "x-active-tenant": "communitysavings"
    },
    dispatcher: new (require('undici').Agent)({ connect: { rejectUnauthorized: false } })
  });
  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}
main().catch(console.error);
