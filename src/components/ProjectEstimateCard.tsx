'use client';

import { ProjectEstimate } from '@/types';

interface ProjectEstimateCardProps {
  estimate: ProjectEstimate;
}

export default function ProjectEstimateCard({ estimate }: ProjectEstimateCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTopAssemblies = () => {
    return estimate.breakdown
      .sort((a, b) => b.totalCost - a.totalCost)
      .slice(0, 5);
  };

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-gradient-to-r from-construction-blue to-construction-orange rounded-lg p-6 text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-lg font-medium opacity-90">Total Project Cost</h3>
            <p className="text-3xl font-bold">{formatCurrency(estimate.totalCost)}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium opacity-90">Total Labor Hours</h3>
            <p className="text-3xl font-bold">{estimate.totalHours.toFixed(0)}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium opacity-90">Estimated Timeline</h3>
            <p className="text-3xl font-bold">{Math.ceil(estimate.totalHours / 40)} weeks</p>
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cost Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Cost Breakdown</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Base Cost</span>
              <span className="font-medium">{formatCurrency(estimate.totalCost - estimate.contingency - estimate.overhead - estimate.profit)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Contingency (10%)</span>
              <span className="font-medium">{formatCurrency(estimate.contingency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Overhead (12%)</span>
              <span className="font-medium">{formatCurrency(estimate.overhead)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Profit (15%)</span>
              <span className="font-medium">{formatCurrency(estimate.profit)}</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatCurrency(estimate.totalCost)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Assemblies */}
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Top Cost Items</h4>
          <div className="space-y-3">
            {getTopAssemblies().map((item, index) => (
              <div key={item.assembly.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.assembly.name}</p>
                  <p className="text-xs text-gray-500">
                    {item.quantity} {item.assembly.unit} × {formatCurrency(item.unitCost)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatCurrency(item.totalCost)}</p>
                  <p className="text-xs text-gray-500">{item.laborHours.toFixed(1)}h</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Assembly List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-medium text-gray-900">Detailed Assembly Breakdown</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assembly
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Labor Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Cost
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {estimate.breakdown.map((item) => (
                <tr key={item.assembly.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.assembly.name}</div>
                      <div className="text-sm text-gray-500">{item.assembly.code}</div>
                      {item.notes && (
                        <div className="text-xs text-gray-400 mt-1">{item.notes}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                      {item.assembly.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.quantity.toLocaleString()} {item.assembly.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(item.unitCost)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.laborHours.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(item.totalCost)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-400">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-2xl">🤖</span>
          </div>
          <div className="ml-3">
            <h4 className="text-lg font-medium text-blue-900">AI Insights & Recommendations</h4>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Material costs have increased 7% over the past 6 months. Consider locking in prices soon.</li>
                <li>Similar projects in this region typically take 15-20% longer than estimated due to permit delays.</li>
                <li>Weather patterns suggest scheduling concrete work between March-October for optimal conditions.</li>
                <li>Consider upgrading to energy-efficient HVAC systems for potential tax incentives worth $2,400-$4,800.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}