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

async function searchOspApi(query: string, accessToken: string, page: number, pageSize: number, category: string | null): Promise<any> {
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

  const payload: any = {
    profile: 'all',
    query: query,
    searchDefinition: {
      page: page,
      pageSize: pageSize
    }
  };

  if (category && category.toLowerCase() !== 'all') {
    payload.filterData = `( category eq '${category}' )`;
  }

  const response = await fetch(targetUrl, {
    method: 'POST',
    headers: fetchHeaders,
    body: JSON.stringify(payload)
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
    
    // Pass the category to let the backend API handle the filtering
    const data = await searchOspApi(query, accessToken, page, pageSize, category);

    // Clean up junk text from search results for this site
    if (data && data.results) {
      data.results = data.results.map((item: any) => {
        const cleanText = (text: string) => {
          if (!text) return text;
          let cleaned = text.replace(/^Answer:\s*/i, '');
          cleaned = cleaned.replace(/Skip to login.*?\.\.\.\s*/gi, '');
          cleaned = cleaned.replace(/Skip to login Skip to main content.*?(?:\.\.\.|\n|$)/gi, '');
          cleaned = cleaned.replace(/\*\*/g, '');
          cleaned = cleaned.replace(/\[Reference\]/gi, '');
          return cleaned.trim();
        };

        if (item.summary) item.summary = cleanText(item.summary);
        if (item.body) item.body = cleanText(item.body);
        return item;
      });
    }

    // Mock a generative answer for the UI testing using the new 'answers' structure
    if (data && query.toLowerCase().includes('mock')) {
      if (!data.answers || data.answers.length === 0) {
        data.answers = [
          {
            text: "Skip to login   Skip to main content   Personal   Life Moments   Home and property guides   Buying your first home – the different stages   How to go from renter to home buyer   How to go from renter to home buyer   Make the leap from renting to buyi... Step 4: Find your home  With a pre-approval handy, it’s easy to start the house hunting process.",
            highlights: "Skip to login   Skip to main content   Personal   Life Moments   Home and property guides   Buying your first home – the different stages   How to go from renter to home buyer   How to go from renter to home buyer   Make the leap from renting to buyi... <b>Step </b>4:<b> Find your home  With a pre-approval handy, it’s easy to start the house hunting process.</b>",
            score: "0.9169999957084656"
          }
        ];
      }

      if (!data.relatedQuestions || data.relatedQuestions.length === 0) {
        data.relatedQuestions = [
          "GOG <b>download</b>",
          "GOG <b>com GALAXY</b>",
          "Gog <b>game to</b>",
          "Gog <b>login</b>",
          "GOG <b>Galaxy คือ</b>",
          "GOG <b>app</b>",
          "Gog <b>launcher</b>",
          "GOG <b>เกมฟรี</b>"
        ];
      }

      data.resultsCount = 100;
    }

    return NextResponse.json(data, {
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
