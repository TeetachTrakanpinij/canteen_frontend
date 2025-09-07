import React from 'react';
import { BarChart3, TrendingUp, Clock, Users } from 'lucide-react';

const TableStats = () => {
  const hourlyData = [
    { hour: '12:00', occupied: 8, available: 16 },
    { hour: '13:00', occupied: 15, available: 9 },
    { hour: '14:00', occupied: 12, available: 12 },
    { hour: '15:00', occupied: 6, available: 18 },
    { hour: '16:00', occupied: 4, available: 20 },
    { hour: '17:00', occupied: 9, available: 15 },
    { hour: '18:00', occupied: 18, available: 6 },
    { hour: '19:00', occupied: 22, available: 2 },
    { hour: '20:00', occupied: 20, available: 4 },
    { hour: '21:00', occupied: 14, available: 10 }
  ];

  const maxOccupied = Math.max(...hourlyData.map(d => d.occupied));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 rounded-lg">
              <Coffee className="w-6 h-6 text-orange-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Peak Occupancy</h3>
          <p className="text-2xl font-bold text-gray-900">92%</p>
          <p className="text-sm text-green-600">+5% from yesterday</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Avg. Table Turn</h3>
          <p className="text-2xl font-bold text-gray-900">1.2h</p>
          <p className="text-sm text-green-600">-8 min from last week</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Daily Guests</h3>
          <p className="text-2xl font-bold text-gray-900">156</p>
          <p className="text-sm text-green-600">+12% from yesterday</p>
        </div>
      </div>

      {/* Hourly Occupancy Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Hourly Table Occupancy</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Occupied</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <span className="text-sm text-gray-600">Available</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {hourlyData.map((data, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-16 text-sm font-medium text-gray-600">{data.hour}</div>
              
              <div className="flex-1 flex bg-gray-200 rounded-full h-8 overflow-hidden">
                <div 
                  className="bg-orange-500 flex items-center justify-center text-white text-xs font-medium transition-all duration-500"
                  style={{ width: `${(data.occupied / 24) * 100}%` }}
                >
                  {data.occupied > 0 && data.occupied}
                </div>
                <div 
                  className="bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-medium"
                  style={{ width: `${(data.available / 24) * 100}%` }}
                >
                  {data.available > 0 && data.available}
                </div>
              </div>
              
              <div className="w-20 text-sm text-gray-600 text-right">
                {Math.round((data.occupied / 24) * 100)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table Size Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Table Size Distribution</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 mb-1">8</div>
            <div className="text-sm text-gray-600">2-Seat Tables</div>
            <div className="text-xs text-gray-500 mt-1">33% of total</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 mb-1">10</div>
            <div className="text-sm text-gray-600">4-Seat Tables</div>
            <div className="text-xs text-gray-500 mt-1">42% of total</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 mb-1">4</div>
            <div className="text-sm text-gray-600">6-Seat Tables</div>
            <div className="text-xs text-gray-500 mt-1">17% of total</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 mb-1">2</div>
            <div className="text-sm text-gray-600">8-Seat Tables</div>
            <div className="text-xs text-gray-500 mt-1">8% of total</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableStats;