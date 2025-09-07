import React from 'react';
import { Clock, Users, Coffee, Calendar } from 'lucide-react';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'reservation',
      message: 'New reservation for 4 guests',
      customer: 'John Smith',
      time: '2 minutes ago',
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      id: 2,
      type: 'table',
      message: 'Table T-12 marked as occupied',
      customer: 'Sarah Johnson',
      time: '5 minutes ago',
      icon: Coffee,
      color: 'text-orange-600'
    },
    {
      id: 3,
      type: 'checkout',
      message: 'Table T-08 checked out',
      customer: 'Mike Wilson',
      time: '12 minutes ago',
      icon: Users,
      color: 'text-green-600'
    },
    {
      id: 4,
      type: 'reservation',
      message: 'Reservation cancelled',
      customer: 'Emily Davis',
      time: '18 minutes ago',
      icon: Calendar,
      color: 'text-red-600'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
      
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`p-2 rounded-lg bg-gray-100 ${activity.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                <p className="text-sm text-gray-600">{activity.customer}</p>
              </div>
              
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="w-3 h-3 mr-1" />
                {activity.time}
              </div>
            </div>
          );
        })}
      </div>
      
      <button className="w-full mt-4 py-2 text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors">
        View All Activity
      </button>
    </div>
  );
};

export default RecentActivity;