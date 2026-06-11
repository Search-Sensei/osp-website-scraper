import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await query("SELECT * FROM site_replications WHERE id = $1", [id]);
  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(result.rows[0]);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  await query("DELETE FROM site_replications WHERE id = $1", [id]);
  
  const outputDir = path.join(process.cwd(), 'public', 'sites', id);
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true, force: true });
  }

  return NextResponse.json({ success: true });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { 
    clientName, sourceUrl, searchApiUrl, searchInputSelector, 
    searchButtonSelector, resultsContainerSelector, responseMapping 
  } = body;

  await query(
    `UPDATE site_replications 
     SET client_name = $1, source_url = $2, search_api_url = $3, 
         search_input_selector = $4, search_button_selector = $5, 
         results_container_selector = $6, response_mapping = $7
     WHERE id = $8`,
    [clientName, sourceUrl, searchApiUrl, searchInputSelector, searchButtonSelector, resultsContainerSelector, responseMapping, id]
  );

  // Trigger scraper asynchronously to rebuild the site with new config
  const { runScraper } = require('@/lib/scraper');
  runScraper(id, sourceUrl, {
    apiUrl: searchApiUrl,
    inputSelector: searchInputSelector,
    buttonSelector: searchButtonSelector,
    resultsSelector: resultsContainerSelector,
    mapping: responseMapping
  });

  return NextResponse.json({ success: true });
}
