"use client";
import { useState } from 'react';

export default function AddSiteModal({ isOpen, onClose, onAdded }: { isOpen: boolean, onClose: () => void, onAdded: () => void }) {
  const [formData, setFormData] = useState({
    clientName: '',
    sourceUrl: '',
    searchApiUrl: '',
    searchInputSelector: '',
    searchButtonSelector: '',
    resultsContainerSelector: '',
    responseMapping: JSON.stringify({
      resultsPath: "data.results",
      titleField: "title",
      snippetField: "excerpt",
      urlField: "url"
    }, null, 2)
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        responseMapping: JSON.parse(formData.responseMapping)
      };
      
      const res = await fetch('/api/replications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        onAdded();
        onClose();
      }
    } catch (err) {
      alert("Failed to submit form. Check JSON formatting.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Add New Site Replication</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Client Name</label>
              <input required type="text" className="mt-1 block w-full border rounded p-2" 
                value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium">Source URL</label>
              <input required type="url" className="mt-1 block w-full border rounded p-2" 
                value={formData.sourceUrl} onChange={e => setFormData({...formData, sourceUrl: e.target.value})} />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium">Search API URL</label>
            <input required type="url" className="mt-1 block w-full border rounded p-2" 
              value={formData.searchApiUrl} onChange={e => setFormData({...formData, searchApiUrl: e.target.value})} />
          </div>

          <hr className="my-4" />
          <h3 className="font-semibold text-gray-700">Selectors & Mapping</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Search Input Selector</label>
              <input required type="text" placeholder="input[name='q']" className="mt-1 block w-full border rounded p-2" 
                value={formData.searchInputSelector} onChange={e => setFormData({...formData, searchInputSelector: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium">Search Button Selector (optional)</label>
              <input type="text" placeholder="button.search" className="mt-1 block w-full border rounded p-2" 
                value={formData.searchButtonSelector} onChange={e => setFormData({...formData, searchButtonSelector: e.target.value})} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium">Results Container Selector</label>
              <input required type="text" placeholder="#search-results" className="mt-1 block w-full border rounded p-2" 
                value={formData.resultsContainerSelector} onChange={e => setFormData({...formData, resultsContainerSelector: e.target.value})} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium">Response Mapping (JSON)</label>
              <textarea required rows={6} className="mt-1 block w-full border rounded p-2 font-mono text-sm" 
                value={formData.responseMapping} onChange={e => setFormData({...formData, responseMapping: e.target.value})} />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Start Replication</button>
          </div>
        </form>
      </div>
    </div>
  );
}
