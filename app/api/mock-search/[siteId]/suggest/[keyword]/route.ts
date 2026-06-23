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

  if (cached && cached.expiresAt > Date.now() + 10000) {
    return cached.accessToken;
  }

  const config = siteConfigs[cacheKey];
  const clientId = config?.clientId;
  const clientSecret = config?.clientSecret;

  if (!clientId || !clientSecret) {
    console.warn(`[Suggest API] Warning: Missing credentials in mapping for site ${siteId}.`);
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

  tokenCacheMap[cacheKey] = {
    accessToken: tokenData.access_token,
    expiresAt: Date.now() + (expiresIn * 1000)
  };

  return tokenData.access_token;
}

export async function GET(request: Request, { params }: { params: Promise<{ siteId: string, keyword: string }> }) {
  const { siteId, keyword } = await params;

  try {
    const accessToken = await getAccessToken(siteId);

    const config = siteConfigs[siteId.toLowerCase()];
    const tenant = config?.tenant || siteId.toLowerCase();

    let targetUrl = process.env.OSP_SEARCH_API_URL;
    if (!targetUrl) {
      throw new Error('OSP_SEARCH_API_URL is not defined in environment variables');
    }

    // Use the legacy suggestion endpoint format
    const baseUrl = targetUrl.replace(/\/search\/?$/, '');
    const suggestionUrl = `${baseUrl}/search/all/suggested/${encodeURIComponent(keyword)}`;

    const fetchHeaders: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-active-tenant': tenant,
    };

    if (accessToken) {
      fetchHeaders['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(suggestionUrl, {
      method: 'POST',
      headers: fetchHeaders,
      body: JSON.stringify({
        NumSuggestedSearches: 10
      })
    });

    if (!response.ok) {
      throw new Error(`External API returned status: ${response.status}`);
    }

    let data = await response.json();

    // Map the old legacy response format to the expected format for NativeInputAutocomplete
    // The legacy API returns { body: { suggested: ["...", "..."] } }
    if (data && data.body && Array.isArray(data.body.suggested)) {
      data = {
        ...data,
        body: {
          ...data.body,
          suggestions: data.body.suggested
        }
      };
    } else if (data && data.body && Array.isArray(data.body.result)) {
      // Keep support for the new API format just in case it switches back
      data = {
        ...data,
        body: {
          ...data.body,
          suggestions: data.body.result.map((item: any) => item.suggestion || item.query)
        }
      };
    }

    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('[Suggest API] Error calling external API:', error);
    return NextResponse.json({ error: 'External API Error' }, { status: 502 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
