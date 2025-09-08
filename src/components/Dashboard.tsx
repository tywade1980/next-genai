'use client';

import { useState, useEffect } from 'react';
import { ProjectEstimator, ConstructionUtils } from '@/lib/estimator';
import { AICallManager, SmartDialer } from '@/lib/ai-call-manager';
import { constructionAssemblies } from '@/data/assemblies';
import ProjectEstimateCard from './ProjectEstimateCard';
import CallManagementPanel from './CallManagementPanel';
import AssemblyCatalog from './AssemblyCatalog';
import PricingDashboard from './PricingDashboard';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'estimates' | 'calls' | 'catalog' | 'pricing'>('overview');
  const [estimator] = useState(() => new ProjectEstimator());
  const [callManager] = useState(() => new AICallManager());
  const [dialer] = useState(() => new SmartDialer());

  // Sample project data
  const [sampleEstimate, setSampleEstimate] = useState<any>(null);

  useEffect(() => {
    // Generate a sample estimate for demonstration
    const sample = estimator.calculateProjectEstimate(
      'PROJ-SAMPLE-001',
      [
        { assemblyId: 'FND-001', quantity: 150, notes: 'Perimeter footing' },
        { assemblyId: 'FND-002', quantity: 2000, notes: 'Main floor slab' },
        { assemblyId: 'FRM-001', quantity: 1800, notes: 'Exterior and interior walls' },
        { assemblyId: 'FRM-003', quantity: 2200, notes: 'Complete roof system' },
        { assemblyId: 'ELE-001', quantity: 2.2, notes: '2200 sq ft electrical rough-in' },
        { assemblyId: 'PLB-001', quantity: 3, notes: '2.5 bathrooms' },
        { assemblyId: 'HVC-001', quantity: 1, notes: 'Main HVAC system' },
        { assemblyId: 'ROF-001', quantity: 2400, notes: 'Asphalt shingle roof' },
        { assemblyId: 'INT-001', quantity: 4000, notes: 'Interior drywall' },
        { assemblyId: 'INT-002', quantity: 1500, notes: 'LVP flooring' }
      ],
      'residential',
      10, // 10% contingency
      15, // 15% profit
      12  // 12% overhead
    );
    setSampleEstimate(sample);

    // Add some sample calls for demonstration
    callManager.analyzeCall(
      '+1-555-0123',
      'John Smith',
      'inbound',
      300,
      'Hi, I need an estimate for a kitchen renovation. Looking to update cabinets, countertops, and flooring.'
    );

    callManager.analyzeCall(
      '+1-555-0456',
      'Sarah Johnson', 
      'inbound',
      180,
      'We have a water leak in our basement. This is urgent and needs immediate attention.'
    );

    // Add sample dial queue items
    dialer.addToDialQueue(
      '+1-555-0789',
      'Mike Wilson',
      'Follow up on commercial project estimate',
      'high',
      new Date(Date.now() + 3600000)
    );

    dialer.addToDialQueue(
      '+1-555-0321',
      'Lisa Chen',
      'Schedule site visit for residential addition',
      'medium'
    );
  }, [estimator, callManager, dialer]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'estimates', label: 'Project Estimates', icon: '📋' },
    { id: 'calls', label: 'Call Management', icon: '📞' },
    { id: 'catalog', label: 'Assembly Catalog', icon: '🔧' },
    { id: 'pricing', label: 'Pricing Dashboard', icon: '💰' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-construction-blue">Next-GenAI CBMS</h1>
                <p className="text-sm text-gray-600">Construction Business Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                AI Models Active: 3/3 ✅
              </div>
              <div className="h-8 w-8 bg-construction-orange rounded-full flex items-center justify-center text-white text-sm font-medium">
                AI
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-construction-orange text-construction-orange'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">📊</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Projects</p>
                    <p className="text-2xl font-semibold text-gray-900">12</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">💰</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                    <p className="text-2xl font-semibold text-gray-900">$485K</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-construction-orange rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">📞</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Calls Today</p>
                    <p className="text-2xl font-semibold text-gray-900">28</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">🤖</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">AI Accuracy</p>
                    <p className="text-2xl font-semibold text-gray-900">94.2%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sample Estimate Preview */}
            {sampleEstimate && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Sample Project Estimate</h3>
                  <p className="text-sm text-gray-600">2,200 sq ft Residential New Construction</p>
                </div>
                <div className="p-6">
                  <ProjectEstimateCard estimate={sampleEstimate} />
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-900">New estimate generated for Commercial Office Building</span>
                    <span className="text-xs text-gray-500">2 minutes ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-900">AI processed incoming call from Sarah Johnson</span>
                    <span className="text-xs text-gray-500">5 minutes ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-construction-orange rounded-full"></div>
                    <span className="text-sm text-gray-900">Material prices updated for concrete assemblies</span>
                    <span className="text-xs text-gray-500">15 minutes ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-900">Scheduled callback for Mike Wilson project</span>
                    <span className="text-xs text-gray-500">1 hour ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'estimates' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Project Estimation & Planning</h2>
              <p className="text-gray-600">AI-powered construction project estimates with real-time pricing</p>
            </div>
            {sampleEstimate && <ProjectEstimateCard estimate={sampleEstimate} />}
          </div>
        )}

        {activeTab === 'calls' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">AI Call Management</h2>
              <p className="text-gray-600">Smart call screening and receptionist dialer system</p>
            </div>
            <CallManagementPanel callManager={callManager} dialer={dialer} />
          </div>
        )}

        {activeTab === 'catalog' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Construction Assembly Catalog</h2>
              <p className="text-gray-600">Comprehensive database of construction assemblies with current pricing</p>
            </div>
            <AssemblyCatalog assemblies={constructionAssemblies} />
          </div>
        )}

        {activeTab === 'pricing' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Real-Time Pricing Dashboard</h2>
              <p className="text-gray-600">Market trends and pricing analysis for construction materials</p>
            </div>
            <PricingDashboard estimator={estimator} />
          </div>
        )}
      </main>
    </div>
  );
}