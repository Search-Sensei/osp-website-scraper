"use client";
import { useState, useEffect } from 'react';

export default function AddSiteModal({ isOpen, onClose, onAdded, initialSite }: { isOpen: boolean, onClose: () => void, onAdded: () => void, initialSite?: any }) {
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

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialSite && isOpen) {
      setFormData({
        clientName: initialSite.client_name || '',
        sourceUrl: initialSite.source_url || '',
        searchApiUrl: initialSite.config?.apiUrl || '',
        searchInputSelector: initialSite.config?.inputSelector || '',
        searchButtonSelector: initialSite.config?.buttonSelector || '',
        resultsContainerSelector: initialSite.config?.resultsSelector || '',
        responseMapping: JSON.stringify(initialSite.config?.mapping || {}, null, 2)
      });
    } else if (isOpen && !initialSite) {
      setFormData({
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
    }
  }, [initialSite, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        client_name: formData.clientName,
        url: formData.sourceUrl,
        api: formData.searchApiUrl,
        input_selector: formData.searchInputSelector,
        button_selector: formData.searchButtonSelector,
        container_selector: formData.resultsContainerSelector,
        mapping: formData.responseMapping
      };
      
      const method = 'POST';
      const url = '/api/replications/clone';

      const res = await fetch(url, {
        method,
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
      alert("Failed to submit form. Check JSON formatting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{initialSite ? 'Edit Site Replication' : 'Add New Site Replication'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Client Name</label>
              <input required type="text" className={`mt-1 block w-full border rounded p-2 ${initialSite ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`} 
                value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} 
                disabled={!!initialSite} />
            </div>
            <div>
              <label className="block text-sm font-medium">Source URL</label>
              <input required type="url" className={`mt-1 block w-full border rounded p-2 ${initialSite ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`} 
                value={formData.sourceUrl} onChange={e => setFormData({...formData, sourceUrl: e.target.value})} 
                disabled={!!initialSite} />
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
            <button type="button" onClick={onClose} disabled={loading} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2">
              {loading && <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>}
              {loading ? 'Scraping...' : 'Start Replication'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
