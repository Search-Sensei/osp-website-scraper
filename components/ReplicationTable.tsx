"use client";

import { useRouter } from 'next/navigation';

export default function ReplicationTable({ sites }: { sites: any[] }) {
  return (
    <>
      {sites.length === 0 ? (
        <div className="text-center p-8 border rounded bg-gray-50 text-gray-500">No sites cloned yet. Run the clone script locally to add one.</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded border">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3">Site Domain</th>
                <th className="px-6 py-3">Local Path</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sites.map((site) => (
                <tr key={site.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{site.client_name}</td>
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">public{site.cloned_path}</td>
                  <td className="px-6 py-4 space-x-3 flex items-center">
                    <a href={`/scraper${site.cloned_path}?q=loan`} target="_blank" className="font-medium text-blue-600 hover:underline">
                      View Local Site
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
