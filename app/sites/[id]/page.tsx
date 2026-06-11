

import Link from 'next/link';

export default async function ClonedSiteViewer({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="flex flex-col h-screen font-sans">
      <div className="bg-black text-white p-4 flex justify-between items-center shadow-md">
        <div>
          <h1 className="font-bold text-lg">Cloned Site Viewer</h1>
          <p className="text-gray-400 text-xs">Viewing replication ID: {id}</p>
        </div>
        <Link href="/" className="bg-white text-black px-4 py-2 rounded text-sm font-medium hover:bg-gray-200">
          &larr; Back to Dashboard
        </Link>
      </div>
      <div className="flex-1 w-full bg-gray-100">
        <iframe 
          src={`/sites/${id}/index.html`} 
          className="w-full h-full border-none"
          title="Cloned Site"
        />
      </div>
    </div>
  );
}
