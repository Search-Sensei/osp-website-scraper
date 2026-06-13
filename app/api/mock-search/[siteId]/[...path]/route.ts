import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// This catch-all route intercepts requests like:
// /api/mock-search/nationwide_com/v2/answers/search
export async function GET(request: Request, { params }: { params: Promise<{ siteId: string, path: string[] }> }) {
  const { siteId } = await params;
  
  console.log(`[Mock Search Router] Serving mock for site: ${siteId}`);
  
  try {
    // Look for a mock JSON file corresponding to the site ID
    const mockFilePath = path.join(process.cwd(), 'app/lib/mocks', `${siteId}.json`);
    
    if (fs.existsSync(mockFilePath)) {
      const data = fs.readFileSync(mockFilePath, 'utf8');
      
      // We parse and stringify to ensure it's valid JSON, but also to allow dynamic query injection later if needed
      const jsonResponse = JSON.parse(data);
      
      return NextResponse.json(jsonResponse, {
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      });
    } else {
      console.warn(`[Mock Search Router] Mock file not found: ${mockFilePath}`);
      return NextResponse.json({ error: `Mock file not found for ${siteId}` }, { status: 404 });
    }
  } catch (error) {
    console.error('[Mock Search Router] Error reading mock file:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
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
