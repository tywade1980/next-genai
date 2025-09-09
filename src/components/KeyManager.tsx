'use client';

import { useState, useEffect } from 'react';
import { APIKey } from '@/types';

interface KeyManagerProps {
  onKeyAdded?: () => void;
}

interface NewKeyForm {
  name: string;
  value: string;
  provider: string;
  type: 'openai' | 'anthropic' | 'google' | 'azure' | 'custom';
}

export default function KeyManager({ onKeyAdded }: KeyManagerProps) {
  const [keys, setKeys] = useState<APIKey[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newKey, setNewKey] = useState<NewKeyForm>({
    name: '',
    value: '',
    provider: 'openai',
    type: 'openai' as const
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const response = await fetch('/api/keys');
      const data = await response.json();
      setKeys(data.keys || []);
    } catch (error) {
      console.error('Failed to fetch keys:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newKey)
      });

      const data = await response.json();
      
      if (data.success) {
        setNewKey({ name: '', value: '', provider: 'openai', type: 'openai' });
        setShowAddForm(false);
        fetchKeys();
        onKeyAdded?.();
      } else {
        alert(data.error || 'Failed to add API key');
      }
    } catch (error) {
      console.error('Failed to add API key:', error);
      alert('Failed to add API key');
    } finally {
      setLoading(false);
    }
  };

  const providers = [
    { value: 'openai', label: 'OpenAI', type: 'openai' },
    { value: 'anthropic', label: 'Anthropic', type: 'anthropic' },
    { value: 'google', label: 'Google', type: 'google' },
    { value: 'azure', label: 'Azure', type: 'azure' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">API Keys</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          {showAddForm ? 'Cancel' : 'Add Key'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Key Name
              </label>
              <input
                type="text"
                value={newKey.name}
                onChange={(e) => setNewKey({ ...newKey, name: e.target.value })}
                placeholder="e.g., My OpenAI Key"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Provider
              </label>
              <select
                value={newKey.provider}
                onChange={(e) => {
                  const provider = providers.find(p => p.value === e.target.value);
                  setNewKey({ 
                    ...newKey, 
                    provider: e.target.value,
                    type: (provider?.type as NewKeyForm['type']) || 'openai'
                  });
                }}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {providers.map(provider => (
                  <option key={provider.value} value={provider.value}>
                    {provider.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Key
            </label>
            <input
              type="password"
              value={newKey.value}
              onChange={(e) => setNewKey({ ...newKey, value: e.target.value })}
              placeholder="Paste your API key here"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Your key will be securely stored and never displayed in full
            </p>
          </div>
          
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Adding...' : 'Add Key'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {keys.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No API keys configured. Add one to get started!
          </p>
        ) : (
          keys.map((key) => (
            <div key={key.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <div className="font-medium text-gray-800">{key.name}</div>
                <div className="text-sm text-gray-500">
                  {key.provider} • {key.type}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs ${
                  key.value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {key.value ? 'Configured' : 'Missing'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}