'use client';

import { useState, useEffect } from 'react';
import { Resource } from '@/types';

export default function ResourceViewer() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch('/api/resources');
      const data = await response.json();
      setResources(data.resources || []);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-4">Loading resources...</div>
      </div>
    );
  }

  const groupedResources = resources.reduce((groups, resource) => {
    const provider = resource.provider;
    if (!groups[provider]) {
      groups[provider] = [];
    }
    groups[provider].push(resource);
    return groups;
  }, {} as Record<string, Resource[]>);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Resources</h2>
      
      {Object.entries(groupedResources).map(([provider, providerResources]) => (
        <div key={provider} className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-3 capitalize">
            {provider} Resources
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {providerResources.map((resource) => (
              <div key={resource.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-800">{resource.name}</h4>
                  <span className={`px-2 py-1 rounded text-xs ${
                    resource.type === 'model' ? 'bg-blue-100 text-blue-800' :
                    resource.type === 'api' ? 'bg-green-100 text-green-800' :
                    resource.type === 'service' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {resource.type}
                  </span>
                </div>
                
                <div className="mb-3">
                  <div className="text-sm text-gray-600 mb-2">Capabilities:</div>
                  <div className="flex flex-wrap gap-1">
                    {resource.capabilities.map((capability) => (
                      <span
                        key={capability}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        {capability}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className={`${
                    resource.requiresAuth ? 'text-orange-600' : 'text-green-600'
                  }`}>
                    {resource.requiresAuth ? 'Requires Auth' : 'Public'}
                  </span>
                  
                  {resource.requiresAuth && (
                    <span className={`px-2 py-1 rounded text-xs ${
                      resource.apiKeyId ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {resource.apiKeyId ? 'Key Set' : 'No Key'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {resources.length === 0 && (
        <p className="text-gray-500 text-center py-8">
          No resources available. This might indicate a configuration issue.
        </p>
      )}
    </div>
  );
}