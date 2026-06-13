import fs from 'fs';
import path from 'path';
import ReplicationTable from '@/components/ReplicationTable';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  let sites: any[] = [];
  try {
    const sitesDir = path.join(process.cwd(), 'public', 'sites');
    if (fs.existsSync(sitesDir)) {
      const folders = fs.readdirSync(sitesDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
      
      sites = folders.map(folder => ({
        id: folder,
        client_name: folder,
        cloned_path: `/sites/${folder}/index.html`
      }));
    }
  } catch (e) {
    console.error("Failed to read sites directory:", e);
  }

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Available Cloned Sites</h1>
          <p className="text-gray-500 text-sm mt-1">Locally available cloned search pages for development.</p>
        </div>
      </div>
      
      <ReplicationTable sites={sites} />
    </div>
  );
}
