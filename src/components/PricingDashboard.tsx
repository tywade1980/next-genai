'use client';

import { useState } from 'react';
import { ProjectEstimator } from '@/lib/estimator';
import { currentPriceIndices } from '@/data/assemblies';

interface PricingDashboardProps {
  estimator: ProjectEstimator;
}

export default function PricingDashboard({ estimator }: PricingDashboardProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1M' | '3M' | '6M' | '1Y'>('6M');
  
  // Simulate trend analysis
  const trendAnalysis = estimator.calculateCostTrends([
    'FND-001', 'FRM-001', 'ROF-001', 'ELE-001', 'PLB-001'
  ]);

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'increasing': return '📈';
      case 'decreasing': return '📉';
      default: return '➡️';
    }
  };

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'increasing': return 'text-red-600';
      case 'decreasing': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getVolatilityColor = (volatility: number) => {
    if (volatility > 0.2) return 'text-red-600 bg-red-100';
    if (volatility > 0.1) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <h3 className="text-lg font-medium opacity-90">Market Trend</h3>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{getTrendIcon(trendAnalysis.overallTrend)}</span>
              <span className="text-2xl font-bold capitalize">{trendAnalysis.overallTrend}</span>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium opacity-90">Avg. Volatility</h3>
            <p className="text-2xl font-bold">{formatPercentage(trendAnalysis.averageVolatility)}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium opacity-90">Risk Level</h3>
            <p className="text-2xl font-bold capitalize">{trendAnalysis.riskLevel}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium opacity-90">Last Updated</h3>
            <p className="text-lg">Dec 1, 2024</p>
          </div>
        </div>
      </div>

      {/* Price Indices */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Material Price Indices</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Timeframe:</span>
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value as any)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-construction-orange"
              >
                <option value="1M">1 Month</option>
                <option value="3M">3 Months</option>
                <option value="6M">6 Months</option>
                <option value="1Y">1 Year</option>
              </select>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPriceIndices.map((index, i) => (
              <div key={i} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 text-sm">{index.material}</h4>
                  <span className={`text-lg ${getTrendColor(index.trend)}`}>
                    {getTrendIcon(index.trend)}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  {formatCurrency(index.currentPrice)}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Volatility:</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getVolatilityColor(index.volatility)}`}>
                    {formatPercentage(index.volatility)}
                  </span>
                </div>
                
                {/* Historical Price Mini Chart */}
                <div className="mt-3">
                  <div className="flex items-end space-x-1 h-8">
                    {index.historicalPrices.map((price, j) => {
                      const maxPrice = Math.max(...index.historicalPrices.map(p => p.price));
                      const minPrice = Math.min(...index.historicalPrices.map(p => p.price));
                      const height = ((price.price - minPrice) / (maxPrice - minPrice)) * 100;
                      
                      return (
                        <div
                          key={j}
                          className="flex-1 bg-construction-orange rounded-sm"
                          style={{ height: `${Math.max(height, 10)}%` }}
                          title={`${price.date.toLocaleDateString()}: ${formatCurrency(price.price)}`}
                        ></div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{index.historicalPrices[0]?.date.toLocaleDateString()}</span>
                    <span>{index.historicalPrices[index.historicalPrices.length - 1]?.date.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Assembly Trend Analysis */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Assembly Cost Trends</h3>
          <p className="text-sm text-gray-600">Price movement analysis for key construction assemblies</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assembly
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trend
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Volatility
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Forecast
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {trendAnalysis.trends.map((trend) => (
                <tr key={trend.assemblyId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{trend.assemblyName}</div>
                    <div className="text-sm text-gray-500">{trend.assemblyId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(trend.currentPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className={`text-lg ${getTrendColor(trend.direction)}`}>
                        {getTrendIcon(trend.direction)}
                      </span>
                      <span className={`text-sm font-medium capitalize ${getTrendColor(trend.direction)}`}>
                        {trend.direction}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getVolatilityColor(trend.volatility)}`}>
                      {formatPercentage(trend.volatility)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {trend.lastUpdated.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {trend.direction === 'increasing' ? '+3-5%' : 
                     trend.direction === 'decreasing' ? '-2-4%' : 'Stable'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Market Alerts */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Market Alerts</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-red-400 text-xl">⚠️</span>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-red-800">High Volatility Alert</h4>
                <p className="text-sm text-red-700 mt-1">
                  Lumber prices showing 25% volatility this month. Consider locking in rates for upcoming projects.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-yellow-400 text-xl">🔔</span>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-yellow-800">Price Increase Notice</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Steel rebar prices expected to increase 8-12% next quarter due to supply chain constraints.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-green-400 text-xl">💡</span>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-green-800">Cost Savings Opportunity</h4>
                <p className="text-sm text-green-700 mt-1">
                  Concrete prices stable with seasonal discounts available through February. Good time for foundation work.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-400">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-2xl">🤖</span>
          </div>
          <div className="ml-3">
            <h4 className="text-lg font-medium text-blue-900">AI Pricing Recommendations</h4>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Consider submitting bids 5-7% higher than usual to account for material price increases</li>
                <li>Include price escalation clauses for projects extending beyond 6 months</li>
                <li>Stock up on lumber and steel for Q1 2025 projects while prices are stable</li>
                <li>Monitor concrete prices closely - potential 10% increase expected by spring due to cement shortages</li>
                <li>Electrical materials showing consistent pricing - good category for competitive bidding</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}