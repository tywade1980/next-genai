'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Phone, Building, Brain, BarChart3, Users, AlertCircle, CheckCircle } from 'lucide-react';

interface DashboardStats {
  activeProjects: number;
  pendingCalls: number;
  aiModelsLoaded: number;
  totalClients: number;
}

export default function Home() {
  const [stats, setStats] = useState<DashboardStats>({
    activeProjects: 0,
    pendingCalls: 0,
    aiModelsLoaded: 0,
    totalClients: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading dashboard data
    const loadDashboardData = async () => {
      try {
        // In a real app, this would fetch from API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setStats({
          activeProjects: 12,
          pendingCalls: 3,
          aiModelsLoaded: 3,
          totalClients: 45
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Construction AI Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">Construction AI</h1>
            </div>
            <nav className="flex space-x-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/call-screen" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Call Screen
              </Link>
              <Link href="/ai-models" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                AI Models
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Construction AI</h2>
              <p className="text-gray-600 mb-6">
                Comprehensive construction business management solution with smart call screening, 
                AI-powered assistance, and integrated project management.
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Building className="h-8 w-8 text-blue-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-blue-600">Active Projects</p>
                      <p className="text-2xl font-bold text-blue-900">{stats.activeProjects}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Phone className="h-8 w-8 text-green-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-600">Pending Calls</p>
                      <p className="text-2xl font-bold text-green-900">{stats.pendingCalls}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Brain className="h-8 w-8 text-purple-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-purple-600">AI Models</p>
                      <p className="text-2xl font-bold text-purple-900">{stats.aiModelsLoaded}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-yellow-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-yellow-600">Total Clients</p>
                      <p className="text-2xl font-bold text-yellow-900">{stats.totalClients}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/call-screen" className="block">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white hover:from-blue-600 hover:to-blue-700 transition-colors">
                    <Phone className="h-12 w-12 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Smart Call Screen</h3>
                    <p className="text-blue-100">AI-powered call screening and routing system for better customer service.</p>
                  </div>
                </Link>

                <Link href="/dashboard" className="block">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white hover:from-green-600 hover:to-green-700 transition-colors">
                    <BarChart3 className="h-12 w-12 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Project Management</h3>
                    <p className="text-green-100">Manage construction projects, track progress, and monitor costs.</p>
                  </div>
                </Link>

                <Link href="/ai-models" className="block">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white hover:from-purple-600 hover:to-purple-700 transition-colors">
                    <Brain className="h-12 w-12 mb-4" />
                    <h3 className="text-xl font-bold mb-2">AI Models</h3>
                    <p className="text-purple-100">Manage and configure AI models for construction assistance.</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="ml-3 text-sm text-gray-600">Kitchen renovation project completed - Johnson Residence</span>
                  <span className="ml-auto text-xs text-gray-400">2 hours ago</span>
                </div>
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  <span className="ml-3 text-sm text-gray-600">Permit pending for Smith Commercial Building</span>
                  <span className="ml-auto text-xs text-gray-400">5 hours ago</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-blue-500" />
                  <span className="ml-3 text-sm text-gray-600">New call screening: Potential bathroom renovation inquiry</span>
                  <span className="ml-auto text-xs text-gray-400">1 day ago</span>
                </div>
                <div className="flex items-center">
                  <Brain className="h-5 w-5 text-purple-500" />
                  <span className="ml-3 text-sm text-gray-600">AI model updated: Construction Assistant v2.1</span>
                  <span className="ml-auto text-xs text-gray-400">2 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">System Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">AI Models: Online</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">Call System: Active</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">Database: Connected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
