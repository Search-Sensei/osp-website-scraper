"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AddSiteModal from './AddSiteModal';

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    COPYING: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
  };
  const color = colors[status] || 'bg-gray-100 text-gray-800';

  if (status === 'COPYING') {
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium inline-flex items-center gap-1.5 ${color}`}>
        <svg className="animate-spin h-3 w-3 text-blue-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {status}
      </span>
    );
  }

  return <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>{status}</span>;
}

export default function ReplicationTable({ sites }: { sites: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const hasCopying = sites.some(site => site.status === 'COPYING');
    if (hasCopying) {
      const interval = setInterval(() => {
        router.refresh();
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [sites, router]);

  const handleAdded = () => {
    router.refresh();
  };

  const handleDelete = async (id: string, clientName: string) => {
    if (!confirm(`Are you sure you want to delete ${clientName}? This will permanently remove the cloned files.`)) return;
    
    try {
      const res = await fetch(`/scraper/api/replications/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.refresh();
      } else {
        alert('Failed to delete site.');
      }
    } catch (e) {
      alert('Error deleting site.');
    }
  };

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          Add Site
        </button>
      </div>

      {sites.length === 0 ? (
        <div className="text-center p-8 border rounded bg-gray-50 text-gray-500">No sites added yet. Click "Add Site" to get started.</div>
      ) : (
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
                  <td className="px-6 py-4 space-x-3 flex items-center">
                    {site.status === 'COMPLETED' && (
                      <a href={`/scraper${site.cloned_path}`} target="_blank" className="font-medium text-blue-600 hover:underline">
                        View
                      </a>
                    )}
                    <button onClick={() => handleDelete(site.id, site.client_name)} className="font-medium text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AddSiteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdded={handleAdded} 
      />
    </>
  );
}
