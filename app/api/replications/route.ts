import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { runScraper } from '@/lib/scraper';

export async function GET() {
  const result = await query("SELECT * FROM site_replications ORDER BY created_at DESC");
  return NextResponse.json(result.rows);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { 
    clientName, sourceUrl, searchApiUrl, searchInputSelector, 
    searchButtonSelector, resultsContainerSelector, responseMapping 
  } = body;

  const insertRes = await query(
    `INSERT INTO site_replications 
      (client_name, source_url, search_api_url, search_input_selector, search_button_selector, results_container_selector, response_mapping)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
    [clientName, sourceUrl, searchApiUrl, searchInputSelector, searchButtonSelector, resultsContainerSelector, responseMapping]
  );
  
  const id = insertRes.rows[0].id;

  // Trigger scraper asynchronously
  runScraper(id, sourceUrl, {
    apiUrl: searchApiUrl,
    inputSelector: searchInputSelector,
    buttonSelector: searchButtonSelector,
    resultsSelector: resultsContainerSelector,
    mapping: responseMapping
  });

  return NextResponse.json({ success: true, id });
}
