import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import path from 'path';
import fs from 'fs/promises';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Missing replication ID' }, { status: 400 });
    }

    // 1. Delete from PostgreSQL
    await query('DELETE FROM site_replications WHERE id = $1', [id]);

    // 2. Delete local directory in public/sites/[id]
    const absoluteLocalDir = path.join(process.cwd(), 'public', 'sites', id);
    try {
      await fs.rm(absoluteLocalDir, { recursive: true, force: true });
      console.log(`Successfully deleted folder: ${absoluteLocalDir}`);
    } catch (err: any) {
      console.warn(`Failed to delete folder ${absoluteLocalDir}, it might not exist:`, err.message);
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('API Error during DELETE:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
