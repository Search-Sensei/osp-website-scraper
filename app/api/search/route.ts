import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  console.log(`[Mock Search API] Received query: ${query}`);

  // Artificial delay to simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800));

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  // Generate 5 mock results
  const results = Array.from({ length: 5 }).map((_, i) => ({
    title: `[MOCK] Result ${i + 1} for "${query}"`,
    detail: `This is a locally generated mock result simulating the OSP search response for the query "${query}". It provides enough text to test UI wrapping and styling.`,
    url: `https://example.com/mock-result-${i + 1}`
  }));

  return NextResponse.json({ results });
}
