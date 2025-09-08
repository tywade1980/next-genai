import Link from "next/link";
import { Building, Phone, Users, Calendar, DollarSign, AlertTriangle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">Next GenAI Construction</h1>
            </div>
            <nav className="flex space-x-8">
              <Link href="/projects" className="text-gray-600 hover:text-gray-900">Projects</Link>
              <Link href="/clients" className="text-gray-600 hover:text-gray-900">Clients</Link>
              <Link href="/calls" className="text-gray-600 hover:text-gray-900">Call Center</Link>
              <Link href="/ai-models" className="text-gray-600 hover:text-gray-900">AI Models</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Construction Business Management Dashboard</h2>
          <p className="text-gray-600">Smart call screening, AI-powered insights, and comprehensive project management for construction businesses.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Clients</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Phone className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Calls Today</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Revenue (YTD)</p>
                <p className="text-2xl font-bold text-gray-900">$2.4M</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI Call Screening */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center mb-4">
              <Phone className="h-6 w-6 text-blue-600" />
              <h3 className="ml-2 text-lg font-semibold text-gray-900">Smart Call Screening</h3>
            </div>
            <p className="text-gray-600 mb-4">AI-powered call analysis and automated screening for construction business inquiries.</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Calls Screened Today</span>
                <span className="text-sm font-medium">8 of 12</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '67%' }}></div>
              </div>
            </div>
            <Link href="/calls" className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium">
              View Call Center →
            </Link>
          </div>

          {/* Project Management */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center mb-4">
              <Building className="h-6 w-6 text-green-600" />
              <h3 className="ml-2 text-lg font-semibold text-gray-900">Project Management</h3>
            </div>
            <p className="text-gray-600 mb-4">Track construction projects, manage timelines, labor costs, and materials.</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Projects on Schedule</span>
                <span className="text-sm font-medium">6 of 8</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            <Link href="/projects" className="mt-4 inline-block text-green-600 hover:text-green-800 font-medium">
              View Projects →
            </Link>
          </div>

          {/* AI Models */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-purple-600" />
              <h3 className="ml-2 text-lg font-semibold text-gray-900">AI Model Management</h3>
            </div>
            <p className="text-gray-600 mb-4">Manage multiple AI models for call analysis, project insights, and business intelligence.</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Active Models</span>
                <span className="text-sm font-medium">3 models</span>
              </div>
              <div className="flex space-x-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">GPT-4</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Claude</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Whisper</span>
              </div>
            </div>
            <Link href="/ai-models" className="mt-4 inline-block text-purple-600 hover:text-purple-800 font-medium">
              Manage AI Models →
            </Link>
          </div>

          {/* Market Analysis */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center mb-4">
              <Calendar className="h-6 w-6 text-yellow-600" />
              <h3 className="ml-2 text-lg font-semibold text-gray-900">Market Intelligence</h3>
            </div>
            <p className="text-gray-600 mb-4">Real-time market data, labor rates, material costs, and construction trends.</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Labor Rate Trend</span>
                <span className="text-sm font-medium text-green-600">↑ 3.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Material Costs</span>
                <span className="text-sm font-medium text-red-600">↑ 5.1%</span>
              </div>
            </div>
            <Link href="/market" className="mt-4 inline-block text-yellow-600 hover:text-yellow-800 font-medium">
              View Market Data →
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">New call from ABC Construction Corp - Project status inquiry</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Building className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Project &quot;Office Building Renovation&quot; moved to active status</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">AI model analysis completed for market trends report</p>
                  <p className="text-xs text-gray-500">3 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
