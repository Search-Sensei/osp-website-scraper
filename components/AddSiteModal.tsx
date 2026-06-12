"use client";
import { useState, useEffect } from 'react';

export default function AddSiteModal({ isOpen, onClose, onAdded }: { isOpen: boolean, onClose: () => void, onAdded: () => void }) {
  const [formData, setFormData] = useState({
    clientName: '',
    sourceUrl: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        clientName: '',
        sourceUrl: ''
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        client_name: formData.clientName,
        url: formData.sourceUrl
      };
      
      const res = await fetch('/api/replications/clone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        onAdded();
        onClose();
      } else {
        const errData = await res.json();
        alert("Failed to submit form: " + (errData.error || "Unknown error"));
      }
    } catch (err) {
      alert("Failed to submit form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full p-6">
        <h2 className="text-xl font-bold mb-4">Add New Site Replication</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Client Name</label>
            <input required type="text" placeholder="e.g. Community Savings Bank" className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500" 
              value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Source URL</label>
            <input required type="url" placeholder="https://www.example.com/search" className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500" 
              value={formData.sourceUrl} onChange={e => setFormData({...formData, sourceUrl: e.target.value})} />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t mt-6">
            <button type="button" onClick={onClose} disabled={loading} className="px-4 py-2 border rounded hover:bg-gray-50 text-gray-700">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50">
              {loading && <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>}
              {loading ? 'Scraping...' : 'Clone Site'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
