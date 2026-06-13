import { NextResponse } from 'next/server';
import { runScraper } from '@/lib/scraper';
import { query } from '@/lib/db';
import { commitAndPushDirectory } from '@/lib/github';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      url, 
      client_name,
      search_form_selector,
      search_input_selector,
      result_row_selector,
      result_title_selector,
      result_detail_selector,
      result_url_selector
    } = body;

    if (!url || !client_name) {
      return NextResponse.json({ error: 'Missing required fields: url, client_name' }, { status: 400 });
    }

    const replicationId = client_name.toLowerCase().replace(/[\s\W]+/g, '_');
    
    // Check if site already exists
    const existing = await query('SELECT id FROM site_replications WHERE id = $1', [replicationId]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: `Site '${client_name}' has already been cloned. Please use a different name or remove the existing one first.` }, { status: 409 });
    }

    console.log(`Starting replication for: ${client_name} (${url})`);

    // 1. Insert into PostgreSQL as COPYING initially
    await query(
      `INSERT INTO site_replications (
        id, client_name, source_url, status, 
        search_form_selector, search_input_selector, result_row_selector,
        result_title_selector, result_detail_selector, result_url_selector
      ) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        replicationId, client_name, url, 'COPYING',
        search_form_selector || null,
        search_input_selector || null,
        result_row_selector || null,
        result_title_selector || null,
        result_detail_selector || null,
        result_url_selector || null
      ]
    );

    const adapterConfig = {
      search_form_selector,
      search_input_selector,
      result_row_selector,
      result_title_selector,
      result_detail_selector,
      result_url_selector
    };

    // 2. Start the actual scraping process in the background
    (async () => {
      try {
        const clonedPath = await runScraper(replicationId, url, adapterConfig);
        
        const repoOwner = process.env.GITHUB_REPO_OWNER || 'Search-Sensei';
        const repoName = process.env.GITHUB_REPO_NAME || 'osp-website-scraper';
        const absoluteLocalDir = path.join(process.cwd(), 'public', 'sites', replicationId);
        const basePathInRepo = `public/sites/${replicationId}`;
        
        await commitAndPushDirectory(
          repoOwner, 
          repoName, 
          basePathInRepo, 
          absoluteLocalDir, 
          `feat: add mirrored site for ${client_name} via UI`
        );

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
