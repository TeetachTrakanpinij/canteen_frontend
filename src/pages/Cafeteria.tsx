import React, { useState } from 'react';
import { Grid, BarChart3, Settings, Plus } from 'lucide-react';
import TableGrid from '../components/TableGrid';
import TableStats from '../components/TableStats';

const Cafeteria = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'stats'>('grid');
  const [density, setDensity] = useState<'comfortable' | 'compact' | 'cozy'>('comfortable');

  const densityOptions = [
    { value: 'comfortable', label: 'Comfortable', description: 'More space between tables' },
    { value: 'compact', label: 'Compact', description: 'Standard spacing' },
    { value: 'cozy', label: 'Cozy', description: 'Closer table arrangement' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cafeteria Management</h1>
          <p className="text-gray-600">Manage your restaurant's table layout and monitor occupancy</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Add Table
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* View Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">View:</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid className="w-4 h-4 mr-2" />
                Table Layout
              </button>
              <button
                onClick={() => setViewMode('stats')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'stats'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Statistics
              </button>
            </div>
          </div>

          {/* Density Control */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Density:</span>
            <div className="flex space-x-2">
              {densityOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDensity(option.value as any)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    density === option.value
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={option.description}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Total Tables */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Total Tables:</span>
            <span className="text-2xl font-bold text-orange-600">24</span>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'grid' ? (
        <TableGrid density={density} />
      ) : (
        <TableStats />
      )}
    </div>
  );
};

export default Cafeteria;