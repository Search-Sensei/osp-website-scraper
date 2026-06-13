"use client";
import { useState, useEffect } from 'react';

export default function AddSiteModal({ isOpen, onClose, onAdded }: { isOpen: boolean, onClose: () => void, onAdded: () => void }) {
  const [formData, setFormData] = useState({
    clientName: '',
    sourceUrl: '',
    searchFormSelector: '',
    searchInputSelector: '',
    resultRowSelector: '',
    resultTitleSelector: '',
    resultDetailSelector: '',
    resultUrlSelector: ''
  });

  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        clientName: '',
        sourceUrl: '',
        searchFormSelector: '',
        searchInputSelector: '',
        resultRowSelector: '',
        resultTitleSelector: '',
        resultDetailSelector: '',
        resultUrlSelector: ''
      });
      setShowAdvanced(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        client_name: formData.clientName,
        url: formData.sourceUrl,
        search_form_selector: formData.searchFormSelector,
        search_input_selector: formData.searchInputSelector,
        result_row_selector: formData.resultRowSelector,
        result_title_selector: formData.resultTitleSelector,
        result_detail_selector: formData.resultDetailSelector,
        result_url_selector: formData.resultUrlSelector
      };
      
      const res = await fetch('/scraper/api/replications/clone', {
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
      <div className="bg-white rounded-lg max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
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

          <div className="pt-2 border-t mt-4">
            <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className="text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none">
              {showAdvanced ? 'Hide Advanced Mapping Options' : 'Show Advanced Mapping Options'}
            </button>
          </div>

          {showAdvanced && (
            <div className="space-y-3 bg-gray-50 p-4 rounded border text-sm">
              <p className="text-gray-500 mb-2">Define CSS selectors from the target site to automatically map the Search API into their DOM.</p>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700">Search Form/Button</label>
                  <input type="text" placeholder="e.g. #search-form" className="mt-1 block w-full border border-gray-300 rounded p-1.5 focus:ring-blue-500 focus:border-blue-500" 
                    value={formData.searchFormSelector} onChange={e => setFormData({...formData, searchFormSelector: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Search Input Field</label>
                  <input type="text" placeholder="e.g. input[name='q']" className="mt-1 block w-full border border-gray-300 rounded p-1.5 focus:ring-blue-500 focus:border-blue-500" 
                    value={formData.searchInputSelector} onChange={e => setFormData({...formData, searchInputSelector: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700">Result Row Container (The element to clone as a template)</label>
                <input type="text" placeholder="e.g. .search-result-item" className="mt-1 block w-full border border-gray-300 rounded p-1.5 focus:ring-blue-500 focus:border-blue-500" 
                  value={formData.resultRowSelector} onChange={e => setFormData({...formData, resultRowSelector: e.target.value})} />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700">Title Selector</label>
                  <input type="text" placeholder="e.g. h3.title" className="mt-1 block w-full border border-gray-300 rounded p-1.5 focus:ring-blue-500 focus:border-blue-500" 
                    value={formData.resultTitleSelector} onChange={e => setFormData({...formData, resultTitleSelector: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Detail Selector</label>
                  <input type="text" placeholder="e.g. p.desc" className="mt-1 block w-full border border-gray-300 rounded p-1.5 focus:ring-blue-500 focus:border-blue-500" 
                    value={formData.resultDetailSelector} onChange={e => setFormData({...formData, resultDetailSelector: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">URL Selector (Optional)</label>
                  <input type="text" placeholder="e.g. a.link" className="mt-1 block w-full border border-gray-300 rounded p-1.5 focus:ring-blue-500 focus:border-blue-500" 
                    value={formData.resultUrlSelector} onChange={e => setFormData({...formData, resultUrlSelector: e.target.value})} />
                </div>
              </div>
            </div>
          )}

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
