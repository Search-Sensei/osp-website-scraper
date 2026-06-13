import { NextResponse } from 'next/server';
import { runScraper } from '@/lib/scraper';
import { query } from '@/lib/db';
import { commitAndPushDirectory } from '@/lib/github';
import path from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { url } = data;

    if (!url) {
      return NextResponse.json({ error: 'Missing required field: url' }, { status: 400 });
    }

    // Extract domain from URL
    let domain = '';
    try {
      const parsedUrl = new URL(url);
      domain = parsedUrl.hostname.replace(/^www\./, '');
    } catch (e) {
      return NextResponse.json({ error: 'Invalid URL provided' }, { status: 400 });
    }

    // Use domain as client name and id
    const client_name = domain;
    const replicationId = domain.toLowerCase().replace(/[^a-z0-9]+/g, '_');

    // Remove old site if it exists to allow re-cloning
    await query('DELETE FROM site_replications WHERE id = $1', [replicationId]);

    console.log(`Starting replication for: ${client_name} (${url})`);

    // 1. Insert into PostgreSQL as COPYING initially
    await query(
      `INSERT INTO site_replications (
        id, client_name, source_url, status
      ) 
       VALUES ($1, $2, $3, $4)`,
      [
        replicationId, client_name, url, 'COPYING'
      ]
    );

    // 2. Start the actual scraping process in the background
    (async () => {
      try {
        const clonedPath = await runScraper(replicationId, url);
        
        // Update to COMPLETED when done
        await query(
          `UPDATE site_replications SET status = 'COMPLETED', cloned_path = $1, updated_at = NOW() WHERE id = $2`,
          [clonedPath, replicationId]
        );
        console.log(`Successfully finished replication for ${client_name}`);

      } catch (bgError: any) {
        console.error(`Background replication error for ${client_name}:`, bgError);
        // Mark as FAILED if something went wrong
        await query(
          `UPDATE site_replications SET status = 'FAILED', error_message = $1, updated_at = NOW() WHERE id = $2`,
          [bgError.message || 'Unknown error during scraping/pushing', replicationId]
        );
      }
    })();

    // 3. Return immediately so the UI can show "COPYING"
    return NextResponse.json({ 
      success: true, 
      replicationId,
      status: 'COPYING'
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
