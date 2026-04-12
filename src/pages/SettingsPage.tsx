import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('/api/settings');
        setSettings(response.data);
      } catch (err) {
        setError('Failed to fetch settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const target = e.target as HTMLInputElement;

    if (target.type === 'number') {
        setSettings((prev: any) => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
    } else {
        setSettings((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveChanges = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/settings', settings);
      alert('Settings saved successfully!');
    } catch (err) {
      alert(`Failed to save settings ${err}`);
    }
  };
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!settings) return <div>No settings found</div>;

  return (
    <div className="h-screen w-screen flex bg-gray-100">
      {/* Left Navigation Sidebar */}
      <div className="w-60 bg-white border-r">
        <div className="p-4">
          <h2 className="text-lg font-semibold">AI Assistant Settings</h2>
        </div>
        <nav className="mt-4">
          <ul>
            <li className="px-4 py-2 text-gray-700 hover:bg-gray-200 cursor-pointer">Profile</li>
            <li className="px-4 py-2 text-gray-700 hover:bg-gray-200 cursor-pointer">Personality</li>
            <li className="px-4 py-2 text-gray-700 hover:bg-gray-200 cursor-pointer">Guidelines</li>
            <li className="px-4 py-2 text-gray-700 hover:bg-gray-200 cursor-pointer">Knowledge</li>
            <li className="px-4 py-2 text-gray-700 hover:bg-gray-200 cursor-pointer">Retrieval</li>
            <li className="px-4 py-2 text-gray-700 hover:bg-gray-200 cursor-pointer">Advanced</li>
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b">
          <a href="/" className="text-blue-500 hover:underline">Back to Chat</a>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          {/* Profile & Activation */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h2 className="text-xl font-bold mb-4">Profile & Activation</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Profile Name</label>
              <input
                type="text"
                name="name"
                value={settings.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Description</label>
              <textarea
                name="description"
                value={settings.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex items-center">
                <input type="checkbox" name="is_active" checked={settings.is_active} onChange={(e) => setSettings((prev: any) => ({...prev, is_active: e.target.checked}))} className="mr-2"/>
                <label>Active Profile</label>
            </div>
          </div>

          {/* Knowledge and Guidelines */}
          <div className="bg-white p-4 rounded-lg shadow-md mt-4">
            <h2 className="text-xl font-bold mb-4">Principles & Guidelines</h2>
            <textarea
              name="guidelines_text"
              value={settings.guidelines_text}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex items-center mb-4">
                <input type="checkbox" name="enforce_strictly" checked={settings.enforce_strictly} onChange={(e) => setSettings((prev: any) => ({...prev, enforce_strictly: e.target.checked}))} className="mr-2"/>
                <label>Enforce Strictly</label>
            </div>
            <h3 className="text-lg font-semibold mb-2">Attached Files</h3>
            <ul>
                {(settings.guidelines_files || []).map((file: string) => <li key={file}>{file}</li>)}
            </ul>
            <button className="mt-2 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Upload File</button>
          </div>

          {/* Retrieval & Advanced */}
          <div className="bg-white p-4 rounded-lg shadow-md mt-4">
            <h2 className="text-xl font-bold mb-4">Retrieval & Advanced</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Top-K Results</label>
              <input
                type="number"
                name="retrieval_k"
                value={settings.retrieval_k}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Chunk Size</label>
              <input
                type="number"
                name="chunk_size"
                value={settings.chunk_size}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Overlap</label>
              <input
                type="number"
                name="overlap"
                value={settings.overlap}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
             <div className="flex items-center mb-4">
                <input type="checkbox" name="use_reranker" checked={settings.use_reranker} onChange={(e) => setSettings((prev: any) => ({...prev, use_reranker: e.target.checked}))} className="mr-2"/>
                <label>Use Reranker</label>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Fallback</label>
                <input type="text" name="fallback_mode" value={settings.fallback_mode} onChange={handleInputChange} className="w-full p-2 border rounded"/>
            </div>
             <div className="mb-4">
                <label className="block text-gray-700">Safety Level</label>
                <input type="text" name="safety_level" value={settings.safety_level} onChange={handleInputChange} className="w-full p-2 border rounded"/>
            </div>
            <div>
                <label className="block text-gray-700">LLM Model</label>
                <input type="text" name="llm_model" value={settings.llm_model} onChange={handleInputChange} className="w-full p-2 border rounded"/>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md mt-4">
            <h2 className="text-xl font-bold mb-4">Reference Knowledge (RAG DATA)</h2>
            <h3 className="text-lg font-semibold mb-2">Uploaded Documents</h3>
            <ul>
                {(settings.knowledge_files || []).map((file: string) => <li key={file}>{file}</li>)}
            </ul>
             <button className="mt-2 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Upload Docs</button>
             <h3 className="text-lg font-semibold mt-4 mb-2">URLs</h3>
            <ul>
                {(settings.knowledge_urls || []).map((url: string) => <li key={url}>{url}</li>)}
            </ul>
             <button className="mt-2 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Add URL</button>
             <h3 className="text-lg font-semibold mt-4 mb-2">Text Snippets</h3>
            <ul>
                {(settings.snippets || []).map((snippet: string) => <li key={snippet}>{snippet}</li>)}
            </ul>
             <button className="mt-2 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Add Text Snippet</button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Agent Personality</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Role/Persona</label>
              <textarea
                name="personality"
                value={settings.personality}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Tone</label>
                <input type="text" name="tone" value={settings.tone} onChange={handleInputChange} className="w-full p-2 border rounded"/>
            </div>
            <div>
                <label className="block text-gray-700">Style</label>
                <input type="text" name="style" value={settings.style} onChange={handleInputChange} className="w-full p-2 border rounded"/>
            </div>
          </div>
        </div>
        <div className="p-4 border-t bg-white flex justify-end space-x-2">
            <button className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Discard</button>
            <button className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Reset</button>
            <button onClick={handleSaveChanges} className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600">Save & Apply</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
