import { NextResponse } from 'next/server';
import { runScraper } from '@/lib/scraper';
import { query } from '@/lib/db';
import { commitAndPushDirectory } from '@/lib/github';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, client_name } = body;

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

    // 1. Run Playwright scraper
    const clonedPath = await runScraper(replicationId, url);

    // 2. Insert into PostgreSQL
    await query(
      `INSERT INTO site_replications (id, client_name, source_url, status, cloned_path) 
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO UPDATE SET 
         client_name = EXCLUDED.client_name,
         source_url = EXCLUDED.source_url,
         status = EXCLUDED.status,
         cloned_path = EXCLUDED.cloned_path,
         updated_at = NOW()`,
      [replicationId, client_name, url, 'COMPLETED', clonedPath]
    );

    // 3. Commit and push to GitHub
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

    return NextResponse.json({ 
      success: true, 
      replicationId, 
      clonedPath 
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
