import { NextResponse } from 'next/server';

import { siteConfigs } from '@/lib/site-configs';

interface TokenCache {
  accessToken: string;
  expiresAt: number;
}

const tokenCacheMap: Record<string, TokenCache> = {};

async function getAccessToken(siteId: string): Promise<string> {
  const cacheKey = siteId.toLowerCase();
  const cached = tokenCacheMap[cacheKey];

  // Use cached token if valid (with 10s buffer)
  if (cached && cached.expiresAt > Date.now() + 10000) {
    return cached.accessToken;
  }

  const config = siteConfigs[cacheKey];
  const clientId = config?.clientId;
  const clientSecret = config?.clientSecret;

  if (!clientId || !clientSecret) {
    console.warn(`[Mock Search Router] Warning: Missing credentials in mapping for site ${siteId}. Proceeding without token.`);
    return '';
  }

  const tokenUrl = process.env.OAUTH_TOKEN_URL;
  if (!tokenUrl) {
    throw new Error('OAUTH_TOKEN_URL is not defined in environment variables');
  }
  console.log(`[Mock Search Router] Fetching new access token for ${clientId}...`);

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
    console.error(`Token endpoint failed: ${tokenResponse.status} ${tokenResponse.statusText}`);
    throw new Error('Failed to obtain access token');
  }

  const tokenData = await tokenResponse.json();
  const expiresIn = tokenData.expires_in || 300; // Default to 5 mins if not provided
  
  tokenCacheMap[cacheKey] = {
    accessToken: tokenData.access_token,
    expiresAt: Date.now() + (expiresIn * 1000)
  };

  return tokenData.access_token;
}

async function searchOspApi(tenant: string, query: string, accessToken: string): Promise<any> {
  const targetUrl = process.env.OSP_SEARCH_API_URL;
  if (!targetUrl) {
    throw new Error('OSP_SEARCH_API_URL is not defined in environment variables');
  }

  const fetchHeaders: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'x-active-tenant': tenant,
  };

  if (accessToken) {
    fetchHeaders['Authorization'] = `Bearer ${accessToken}`;
  }

  const requestBody = {
    profile: 'all',
    query: query
  };

  console.log(`[Mock Search Router] Calling external API: ${targetUrl} with body:`, requestBody);
  const response = await fetch(targetUrl, {
    method: 'POST',
    headers: fetchHeaders,
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    throw new Error(`External API returned status: ${response.status}`);
  }

  return await response.json();
}

// This catch-all route intercepts requests like:
// /api/mock-search/nationwide_com/v2/answers/search
export async function GET(request: Request, { params }: { params: Promise<{ siteId: string, path: string[] }> }) {
  const { siteId } = await params;

  console.log(`[Mock Search Router] Proxifying request to external API for site: ${siteId}`);
  try {
    // 1. Fetch OAuth Token (Per site configuration)
    const accessToken = await getAccessToken(siteId);

    // 2. Call External Search API
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || searchParams.get('q') || '';

    const config = siteConfigs[siteId.toLowerCase()];
    const tenant = config?.tenant || siteId.toLowerCase();

    const data = await searchOspApi(tenant, query, accessToken);

    const mapper = config?.responseMapper;
    const mappedData = mapper ? mapper(data) : data;

    return NextResponse.json(mappedData, {
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('[Mock Search Router] Error calling external API:', error);
    return NextResponse.json({ error: 'External API Error' }, { status: 502 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ siteId: string, path: string[] }> }) {
  return GET(request, { params });
}

export async function HEAD(request: Request, { params }: { params: Promise<{ siteId: string, path: string[] }> }) {
  const response = await GET(request, { params });
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
