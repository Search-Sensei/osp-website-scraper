import { NextResponse } from 'next/server';

interface TokenCache {
  accessToken: string;
  expiresAt: number;
}

let tokenCache: TokenCache | null = null;

async function getAccessToken(): Promise<string> {
  if (tokenCache && tokenCache.expiresAt > Date.now() + 10000) {
    return tokenCache.accessToken;
  }

  const clientId = 'osp-m2m-communitysavings';
  const clientSecret = process.env.COMMUNITYSAVINGS_CLIENT_SECRET;

  if (!clientSecret) {
    console.warn(`[CSB Search API] Warning: Missing credentials for communitysavings. Proceeding without token.`);
    return '';
  }

  const tokenUrl = process.env.OAUTH_TOKEN_URL;
  if (!tokenUrl) {
    throw new Error('OAUTH_TOKEN_URL is not defined in environment variables');
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

  if (!tokenResponse.ok) {
    throw new Error('Failed to obtain access token');
  }

  const tokenData = await tokenResponse.json();
  const expiresIn = tokenData.expires_in || 300;

  tokenCache = {
    accessToken: tokenData.access_token,
    expiresAt: Date.now() + (expiresIn * 1000)
  };

  return tokenData.access_token;
}

async function searchOspApi(query: string, accessToken: string, page: number, pageSize: number): Promise<any> {
  const targetUrl = process.env.OSP_SEARCH_API_URL;
  if (!targetUrl) {
    throw new Error('OSP_SEARCH_API_URL is not defined in environment variables');
  }

  const fetchHeaders: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'x-active-tenant': 'communitysavings',
  };

  if (accessToken) {
    fetchHeaders['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(targetUrl, {
    method: 'POST',
    headers: fetchHeaders,
    body: JSON.stringify({
      profile: 'all',
      query: query,
      page: page,
      pageSize: pageSize
    })
  });

  if (!response.ok) {
    throw new Error(`External API returned status: ${response.status}`);
  }

  return await response.json();
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || searchParams.get('q') || '';
    const category = searchParams.get('category');

    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);

    const accessToken = await getAccessToken();
    const data = await searchOspApi(query, accessToken, page, pageSize);

    // This is a transparent API, so we return exactly the data from OSP Search API
    // OSP Search API returns structure: { body: { results: [...] } }
    let mappedData = data;

    // Inject mock featured content if requested
    if (mappedData && mappedData.body) {
      mappedData.body.featured = [
        {
          "query": "home loan",
          "type": 0,
          "position": "top",
          "title": "FeaturedContent_61",
          "content": "\u003ch2\u003e\u003ca href=\"https://www.communitysavings.bank/content/nabrwd/en/personal/home-loans.html\" target=\"_self\" rel=\"noopener noreferrer\"\u003e\u003cstrong\u003eHome loans\u003c/strong\u003e\u003c/a\u003e\u003c/h2\u003e\n\u003cp\u003eWe have tools, calculators &#97;nd guides to help you choose the right home loan for you.\u003c/p\u003e\n\u003cp\u003e\u003ca href=\"https://www.communitysavings.bank/content/nabrwd/en/personal/home-loans.html\" target=\"_self\" rel=\"noopener noreferrer\"\u003eDiscover more\u003c/a\u003e\u003c/p\u003e\n",
          "imageReference": ""
        }
      ];
    }
    // Filter results on the server-side by category if requested
    if (category && category.toLowerCase() !== 'all' && mappedData) {
      const resultsArray = mappedData.body && mappedData.body.results;
      if (Array.isArray(resultsArray)) {
        mappedData.body.results = resultsArray.filter((item: any) => {
          const itemCats = item.categories || [];
          return itemCats.some((c: string) => c.toLowerCase() === category.toLowerCase());
        });
      }
    }
    
    if (mappedData && mappedData.body) {
      mappedData.body.resultsCount = 2850;
    }

    return NextResponse.json(mappedData, {
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('[CSB Search API] Error calling external API:', error);
    return NextResponse.json({ error: 'External API Error' }, { status: 502 });
  }
}

export async function POST(request: Request) {
  return GET(request);
}

export async function HEAD(request: Request) {
  const response = await GET(request);
  return new NextResponse(null, {
    status: response.status,
    headers: response.headers
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
