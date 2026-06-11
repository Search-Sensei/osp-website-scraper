"use client";
import { useEffect, useState } from 'react';
import AddSiteModal from '@/components/AddSiteModal';
import ReplicationTable from '@/components/ReplicationTable';

export default function Dashboard() {
  const [sites, setSites] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSites = () => {
    fetch('/api/replications')
      .then(r => r.json())
      .then(data => setSites(data));
  };

  useEffect(() => {
    fetchSites();
    const interval = setInterval(fetchSites, 5000); // poll every 5s
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this replication?')) return;
    await fetch(`/api/replications/\${id}`, { method: 'DELETE' });
    fetchSites();
  };

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Replications</h1>
          <p className="text-gray-500 text-sm mt-1">Manage cloned search pages and API configurations.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-black text-white px-4 py-2 rounded font-medium hover:bg-gray-800 transition-colors">
          + Add New Site
        </button>
      </div>
      
      <ReplicationTable sites={sites} onDelete={handleDelete} />
      
      <AddSiteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdded={fetchSites} 
      />
    </div>
  );
}
