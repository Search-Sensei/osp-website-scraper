import { query } from '@/lib/db';
import ReplicationTable from '@/components/ReplicationTable';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  let sites = [];
  try {
    const res = await query('SELECT * FROM site_replications ORDER BY created_at DESC');
    sites = res.rows;
  } catch (e) {
    console.error("Failed to fetch sites from DB:", e);
    // Return empty array if DB is not available yet
  }

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Replications</h1>
          <p className="text-gray-500 text-sm mt-1">Manage cloned search pages and API configurations.</p>
        </div>
      </div>
      
      <ReplicationTable sites={sites} />
    </div>
  );
}
