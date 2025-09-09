'use client';

import { useEffect, useState } from 'react';
import { apiClient, User, CallRecord, CBMSProject } from '@next-genai/shared';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [projects, setProjects] = useState<CBMSProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Login with demo credentials
        const loginResponse = await apiClient.login({
          email: 'demo@example.com',
          password: 'demo123',
        });

        if (loginResponse.success && loginResponse.data) {
          apiClient.setToken(loginResponse.data.token);
          setUser(loginResponse.data.user);

          // Load initial data
          const [callsResponse, projectsResponse] = await Promise.all([
            apiClient.getCallRecords(),
            apiClient.getProjects(),
          ]);

          if (callsResponse.success && callsResponse.data) {
            setCalls(callsResponse.data);
          }

          if (projectsResponse.success && projectsResponse.data) {
            setProjects(projectsResponse.data);
          }
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading Next GenAI...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Next GenAI</h1>
            {user && (
              <div className="text-sm text-gray-600">
                Welcome, {user.name}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Call Records Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Calls
            </h2>
            {calls.length > 0 ? (
              <div className="space-y-3">
                {calls.map((call) => (
                  <div key={call.id} className="border rounded p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{call.phoneNumber}</p>
                        <p className="text-sm text-gray-600">
                          Duration: {Math.floor(call.duration / 60)}m {call.duration % 60}s
                        </p>
                        <p className="text-sm text-gray-600">
                          AI Model: {call.aiModelUsed}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded ${
                        call.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : call.status === 'failed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {call.status}
                      </span>
                    </div>
                    {call.summary && (
                      <p className="text-sm text-gray-700 mt-2">{call.summary}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No call records found.</p>
            )}
          </div>

          {/* CBMS Projects Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              CBMS Projects
            </h2>
            {projects.length > 0 ? (
              <div className="space-y-3">
                {projects.map((project) => (
                  <div key={project.id} className="border rounded p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{project.name}</h3>
                        <p className="text-sm text-gray-600">{project.description}</p>
                        <p className="text-sm text-gray-600">
                          Budget: ${project.budget.toLocaleString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded ${
                        project.status === 'active' 
                          ? 'bg-blue-100 text-blue-800'
                          : project.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No projects found.</p>
            )}
          </div>
        </div>

        {/* App Info */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Smart Call Screen & Receptionist Dialer
          </h2>
          <p className="text-gray-600 mb-4">
            Powered by 3 AI models and integrated with Construction Business Management Solution (CBMS).
            This web application synchronizes with the mobile APK version for seamless cross-platform experience.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded">
              <h3 className="font-medium">AI Models</h3>
              <p className="text-sm text-gray-600">GPT-4, Claude-3, Gemini-Pro</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded">
              <h3 className="font-medium">Real-time Sync</h3>
              <p className="text-sm text-gray-600">WebSocket connection</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded">
              <h3 className="font-medium">Cross-platform</h3>
              <p className="text-sm text-gray-600">Web & Mobile APK</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
