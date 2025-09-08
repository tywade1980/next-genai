'use client';

import { useState } from 'react';
import { AICallManager, SmartDialer } from '@/lib/ai-call-manager';

interface CallManagementPanelProps {
  callManager: AICallManager;
  dialer: SmartDialer;
}

export default function CallManagementPanel({ callManager, dialer }: CallManagementPanelProps) {
  const [activeCallTab, setActiveCallTab] = useState<'recent' | 'priority' | 'dialer'>('recent');
  
  const callStats = callManager.getCallStatistics();
  const priorityCalls = callManager.getHighPriorityCalls();
  const dialStats = dialer.getDialQueueStats();
  const nextToDial = dialer.getNextToDial();

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case 'emergency': return 'bg-red-500';
      case 'quote-request': return 'bg-blue-500';
      case 'complaint': return 'bg-orange-500';
      case 'scheduling': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Call Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">📞</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Calls (30d)</p>
              <p className="text-2xl font-semibold text-gray-900">{callStats.totalCalls}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">🚨</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Emergency Calls</p>
              <p className="text-2xl font-semibold text-gray-900">{callStats.emergencyCalls}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Quote Requests</p>
              <p className="text-2xl font-semibold text-gray-900">{callStats.quoteRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">😊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Positive Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{(callStats.positiveRate * 100).toFixed(0)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Dialer Status */}
      {nextToDial && (
        <div className="bg-gradient-to-r from-construction-orange to-construction-yellow rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Next Scheduled Call</h3>
              <p className="text-sm opacity-90">
                {nextToDial.contactName} - {nextToDial.purpose}
              </p>
              <p className="text-xs opacity-75">
                Scheduled: {formatTime(nextToDial.scheduledTime)} | Priority: {nextToDial.priority}
              </p>
            </div>
            <button className="bg-white text-construction-orange px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Dial Now
            </button>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'recent', label: 'Recent Calls', count: callStats.totalCalls },
              { id: 'priority', label: 'Priority Calls', count: callStats.followUpRequired },
              { id: 'dialer', label: 'Dial Queue', count: dialStats.pending }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCallTab(tab.id as any)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeCallTab === tab.id
                    ? 'border-construction-orange text-construction-orange'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeCallTab === 'recent' && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Recent Call Activity</h4>
              <div className="space-y-3">
                {/* Sample recent calls - in production these would come from callManager */}
                <div className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`w-3 h-3 rounded-full ${getIntentColor('quote-request')}`}></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">John Smith</p>
                        <p className="text-xs text-gray-500">+1-555-0123</p>
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSentimentColor('positive')}`}>
                          Positive
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900">Kitchen renovation quote</p>
                      <p className="text-xs text-gray-500">{formatDuration(300)} • Just now</p>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-600">
                    <p>AI Summary: Customer requesting kitchen renovation estimate. Mentioned budget of $25-30K. Positive sentiment, ready to proceed.</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        Quote Request
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                        Follow-up Required
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`w-3 h-3 rounded-full ${getIntentColor('emergency')}`}></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Sarah Johnson</p>
                        <p className="text-xs text-gray-500">+1-555-0456</p>
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSentimentColor('negative')}`}>
                          Urgent
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900">Basement water leak emergency</p>
                      <p className="text-xs text-gray-500">{formatDuration(180)} • 5 min ago</p>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-600">
                    <p>AI Summary: Emergency water leak in basement. Customer stressed but cooperative. Immediate response required.</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                        Emergency
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800">
                        Dispatched
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeCallTab === 'priority' && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">High Priority Calls</h4>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-red-400 text-xl">🚨</span>
                  </div>
                  <div className="ml-3">
                    <h5 className="text-sm font-medium text-red-800">Emergency Response Required</h5>
                    <p className="text-sm text-red-700 mt-1">
                      Sarah Johnson's water leak requires immediate attention. Emergency team has been notified.
                    </p>
                    <div className="mt-3">
                      <button className="bg-red-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-red-700">
                        Call Customer
                      </button>
                      <button className="ml-2 bg-white text-red-600 border border-red-600 px-3 py-2 rounded text-sm font-medium hover:bg-red-50">
                        Update Status
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeCallTab === 'dialer' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium text-gray-900">Smart Dialer Queue</h4>
                <button className="bg-construction-orange text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-construction-yellow">
                  Add to Queue
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-semibold text-gray-900">{dialStats.pending}</p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-gray-900">{dialStats.completed}</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-gray-900">{dialStats.failed}</p>
                  <p className="text-sm text-gray-600">Failed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-gray-900">{dialStats.highPriority}</p>
                  <p className="text-sm text-gray-600">High Priority</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Mike Wilson</p>
                        <p className="text-xs text-gray-500">+1-555-0789</p>
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor('high')}`}>
                          High Priority
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900">Follow up on commercial project estimate</p>
                      <p className="text-xs text-gray-500">Scheduled: {formatTime(new Date(Date.now() + 3600000))}</p>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Lisa Chen</p>
                        <p className="text-xs text-gray-500">+1-555-0321</p>
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor('medium')}`}>
                          Medium Priority
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900">Schedule site visit for residential addition</p>
                      <p className="text-xs text-gray-500">Scheduled: Now</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}