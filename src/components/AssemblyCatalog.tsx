'use client';

import { useState } from 'react';
import { Assembly } from '@/types';

interface AssemblyCatalogProps {
  assemblies: Assembly[];
}

export default function AssemblyCatalog({ assemblies }: AssemblyCatalogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'cost' | 'category'>('name');

  const categories = Array.from(new Set(assemblies.map(a => a.category)));
  
  const filteredAssemblies = assemblies
    .filter(assembly => {
      const matchesSearch = assembly.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           assembly.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           assembly.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || assembly.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'cost':
          return b.unitCost - a.unitCost;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'foundation': 'bg-gray-100 text-gray-800',
      'framing': 'bg-yellow-100 text-yellow-800',
      'roofing': 'bg-red-100 text-red-800',
      'electrical': 'bg-blue-100 text-blue-800',
      'plumbing': 'bg-indigo-100 text-indigo-800',
      'hvac': 'bg-purple-100 text-purple-800',
      'interior': 'bg-green-100 text-green-800',
      'exterior': 'bg-orange-100 text-orange-800',
      'site-work': 'bg-brown-100 text-brown-800',
      'specialty': 'bg-pink-100 text-pink-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getProductivityRating = (rate: number) => {
    if (rate >= 8) return { color: 'text-green-600', label: 'High' };
    if (rate >= 4) return { color: 'text-yellow-600', label: 'Medium' };
    return { color: 'text-red-600', label: 'Low' };
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Assemblies
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, code, or description..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-construction-orange focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-construction-orange focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-construction-orange focus:border-transparent"
            >
              <option value="name">Name</option>
              <option value="cost">Cost (High to Low)</option>
              <option value="category">Category</option>
            </select>
          </div>
        </div>
      </div>

      {/* Assembly Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssemblies.map((assembly) => {
          const productivity = getProductivityRating(assembly.industryNorms.productivityRate);
          
          return (
            <div key={assembly.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(assembly.category)}`}>
                    {assembly.category.replace('-', ' ')}
                  </span>
                  <span className="text-xs text-gray-500">{assembly.code}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{assembly.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{assembly.description}</p>
              </div>

              {/* Pricing Information */}
              <div className="p-4">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-construction-blue">
                      {formatCurrency(assembly.unitCost)}
                    </span>
                    <span className="text-sm text-gray-500">per {assembly.unit}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Last updated: {assembly.lastUpdated.toLocaleDateString()}
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Material:</span>
                    <span className="font-medium">{formatCurrency(assembly.materialCost)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Equipment:</span>
                    <span className="font-medium">{formatCurrency(assembly.equipmentCost)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Labor Hours:</span>
                    <span className="font-medium">{assembly.laborHours} hrs/{assembly.unit}</span>
                  </div>
                </div>

                {/* Industry Norms */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Industry Norms</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Productivity:</span>
                      <span className={`font-medium ${productivity.color}`}>{productivity.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Difficulty:</span>
                      <span className="font-medium">
                        {assembly.industryNorms.difficultyMultiplier > 1.2 ? 'High' : 
                         assembly.industryNorms.difficultyMultiplier > 1.0 ? 'Medium' : 'Low'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Seasonal Impact:</span>
                      <span className="font-medium">
                        {assembly.industryNorms.seasonalAdjustment > 1.1 ? 'High' : 
                         assembly.industryNorms.seasonalAdjustment > 1.0 ? 'Medium' : 'Low'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button className="flex-1 bg-construction-orange text-white px-3 py-2 rounded text-sm font-medium hover:bg-construction-yellow transition-colors">
                    Add to Estimate
                  </button>
                  <button className="px-3 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {filteredAssemblies.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assemblies found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or browse all categories.</p>
        </div>
      )}

      {/* Summary Statistics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Catalog Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-semibold text-gray-900">{assemblies.length}</p>
            <p className="text-sm text-gray-600">Total Assemblies</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-gray-900">{categories.length}</p>
            <p className="text-sm text-gray-600">Categories</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(assemblies.reduce((sum, a) => sum + a.unitCost, 0) / assemblies.length)}
            </p>
            <p className="text-sm text-gray-600">Avg. Unit Cost</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-gray-900">
              {(assemblies.reduce((sum, a) => sum + a.laborHours, 0) / assemblies.length).toFixed(1)}
            </p>
            <p className="text-sm text-gray-600">Avg. Labor Hours</p>
          </div>
        </div>
      </div>
    </div>
  );
}