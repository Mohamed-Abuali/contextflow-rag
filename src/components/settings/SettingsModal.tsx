import React, { useState, useEffect } from 'react';

const defaultSettings = {
  profile_id: "prof_01",
  name: "Technical Support Agent",
  description: "Handles product troubleshooting & API docs",
  is_active: true,
  personality: "You are a precise, solution-focused assistant...",
  tone: "professional",
  style: "structured",
  guidelines_text: "- Never guess endpoints\n- Always cite version numbers",
  guidelines_files: [],
  enforce_strictly: true,
  knowledge_files: [],
  knowledge_urls: [],
  snippets: [],
  chunk_size: 500,
  overlap: 10,
  embed_model: "text-embedding-3-small",
  retrieval_k: 4,
  use_reranker: true,
  fallback_mode: "use_base_knowledge",
  safety_level: "strict",
  llm_model: "gpt-4o"
};

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<any>(() => {
    const savedSettings = localStorage.getItem('settings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSaveChanges = () => {
    localStorage.setItem('settings', JSON.stringify(settings));
    alert('Settings saved successfully!');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl h-full max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">AI Assistant Settings</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {loading && <div>Loading...</div>}
          {error && <div>{error}</div>}
          {settings && (
            <>
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
            </>
          )}
        </div>
        <div className="p-4 border-t bg-white flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Discard</button>
          <button className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Reset</button>
          <button onClick={handleSaveChanges} className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600">Save & Apply</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
