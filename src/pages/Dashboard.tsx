import React from 'react';
import { Coffee, Users, Clock, TrendingUp } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import RecentActivity from '../components/RecentActivity';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Tables',
      value: '24',
      icon: Coffee,
      color: 'orange',
      change: '+2 from last month'
    },
    {
      title: 'Active Reservations',
      value: '18',
      icon: Users,
      color: 'blue',
      change: '+12% from yesterday'
    },
    {
      title: 'Average Wait Time',
      value: '15 min',
      icon: Clock,
      color: 'green',
      change: '-5 min from last week'
    },
    {
      title: 'Daily Revenue',
      value: '$2,847',
      icon: TrendingUp,
      color: 'purple',
      change: '+8% from yesterday'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening at your restaurant today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Cafeteria Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Cafeteria Overview</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Occupied</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Reserved</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">24</div>
            <div className="text-sm text-gray-600">Total Tables</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">8</div>
            <div className="text-sm text-gray-600">Available</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">12</div>
            <div className="text-sm text-gray-600">Occupied</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">4</div>
            <div className="text-sm text-gray-600">Reserved</div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Table Occupancy</span>
            <span className="text-sm text-gray-600">67%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-orange-500 h-2 rounded-full" style={{ width: '67%' }}></div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
};

export default Dashboard;