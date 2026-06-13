import { NextResponse } from 'next/server';
import { mockDatabase } from '@/app/lib/mock-data';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: { site: string; path: string[] } }
) {
  const { site, path: routePath } = params;
  const { searchParams } = new URL(request.url);

  console.log(`[Mock Search API] Site: ${site}, Path: /${routePath.join('/')}`);

  // Artificial delay to simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800));

  try {
    // 1. Try to load site-specific mock JSON file
    const mockFilePath = path.join(process.cwd(), 'app', 'lib', 'mocks', `${site}.json`);
    if (fs.existsSync(mockFilePath)) {
      console.log(`[Mock Search API] Serving static mock from ${site}.json`);
      const fileData = fs.readFileSync(mockFilePath, 'utf8');
      return NextResponse.json(JSON.parse(fileData));
    }
  } catch (error) {
    console.error(`[Mock Search API] Error loading ${site}.json:`, error);
  }

  // 2. Fallback to dynamic randomized data if no static file exists
  console.log(`[Mock Search API] Fallback to dynamic data generation for ${site}`);
  let results = JSON.parse(JSON.stringify(mockDatabase));

  // Shuffle array using Fisher-Yates
  for (let i = results.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [results[i], results[j]] = [results[j], results[i]];
  }

  // Generic fallback format
  const query = searchParams.get('q') || searchParams.get('query') || searchParams.get('input') || '';
  if (!query) {
    return NextResponse.json({ results: [] });
  }

  results = results.slice(0, 20);
  return NextResponse.json({ results });
}
