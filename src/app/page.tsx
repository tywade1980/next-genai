'use client';

import { useState } from 'react';
import KeyManager from '@/components/KeyManager';
import ResourceViewer from '@/components/ResourceViewer';
import AgentTest from '@/components/AgentTest';

export default function Home() {
  const [activeTab, setActiveTab] = useState('agent');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleKeyAdded = () => {
    // Refresh resources when a new key is added
    setRefreshKey(prev => prev + 1);
  };

  const tabs = [
    { id: 'agent', label: 'Smart Agent', icon: '🤖' },
    { id: 'keys', label: 'API Keys', icon: '🔑' },
    { id: 'resources', label: 'Resources', icon: '⚡' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Next GenAI</h1>
              <p className="text-gray-600 mt-1">
                Smart call screen and receptionist dialer with AI models and CBMS
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                API & MCP Interface Ready
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'agent' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="text-lg font-medium text-blue-800 mb-2">
                🎯 How it works
              </h2>
              <p className="text-blue-700">
                Simply describe what you want to do, and our intelligent agent will automatically:
              </p>
              <ul className="list-disc list-inside text-blue-700 mt-2 space-y-1">
                <li>Find the best AI resource for your task</li>
                <li>Handle all the technical details</li>
                <li>Execute the request if you have valid API keys</li>
                <li>Provide helpful suggestions if something goes wrong</li>
              </ul>
            </div>
            <AgentTest key={refreshKey} />
          </div>
        )}

        {activeTab === 'keys' && (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h2 className="text-lg font-medium text-yellow-800 mb-2">
                🔑 API Key Management
              </h2>
              <p className="text-yellow-700">
                Add your API keys here, and the system will automatically configure the resources.
                Just copy and paste your keys - the agent handles the rest!
              </p>
            </div>
            <KeyManager onKeyAdded={handleKeyAdded} />
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h2 className="text-lg font-medium text-green-800 mb-2">
                ⚡ Available Resources
              </h2>
              <p className="text-green-700">
                These are all the AI models and services available in the system.
                Resources with valid API keys are ready to use automatically.
              </p>
            </div>
            <ResourceViewer key={refreshKey} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Next GenAI - Intelligent Resource Management
            </div>
            <div className="flex space-x-6 text-sm text-gray-500">
              <a href="/api/mcp" className="hover:text-gray-700">
                MCP Endpoint
              </a>
              <a href="/api/resources" className="hover:text-gray-700">
                Resources API
              </a>
              <a href="/api/agent" className="hover:text-gray-700">
                Agent API
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}