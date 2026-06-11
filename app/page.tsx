import fs from 'fs';
import path from 'path';
import ReplicationTable from '@/components/ReplicationTable';

export default async function Dashboard() {
  const dbPath = path.join(process.cwd(), 'data', 'sites.json');
  let sites = [];
  if (fs.existsSync(dbPath)) {
    sites = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  }

  // Sort by created_at descending
  sites.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

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
