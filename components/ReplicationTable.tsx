"use client";

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    COPYING: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
  };
  const color = colors[status] || 'bg-gray-100 text-gray-800';
  return <span className={`px-2 py-1 rounded text-xs font-medium \${color}`}>{status}</span>;
}

export default function ReplicationTable({ sites, onDelete }: { sites: any[], onDelete: (id: string) => void }) {
  if (sites.length === 0) {
    return <div className="text-center p-8 border rounded bg-gray-50 text-gray-500">No sites added yet.</div>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded border">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3">Client Name</th>
            <th className="px-6 py-3">Source URL</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Created At</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sites.map((site) => (
            <tr key={site.id} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900">{site.client_name}</td>
              <td className="px-6 py-4 truncate max-w-[200px]" title={site.source_url}>{site.source_url}</td>
              <td className="px-6 py-4"><StatusBadge status={site.status} /></td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                {new Date(site.created_at).toLocaleString()}
              </td>
              <td className="px-6 py-4 space-x-3">
                {site.status === 'COMPLETED' && (
                  <a href={site.cloned_path} target="_blank" className="font-medium text-blue-600 hover:underline">
                    View
                  </a>
                )}
                <button 
                  onClick={() => onDelete(site.id)}
                  className="font-medium text-red-600 hover:underline">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
