import React from 'react';
import { Calendar, Clock, Users, Phone, Mail, MoreVertical } from 'lucide-react';

interface Reservation {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  table: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  notes?: string;
}

interface ReservationCardProps {
  reservation: Reservation;
}

const ReservationCard: React.FC<ReservationCardProps> = ({ reservation }) => {
  const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{reservation.customerName}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(reservation.status)}`}>
              {reservation.status}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(reservation.date)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{reservation.time}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>{reservation.guests} guests</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">Table:</span>
              <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-medium">
                {reservation.table}
              </span>
            </div>
          </div>
        </div>

        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
        <div className="flex items-center space-x-2 text-gray-600">
          <Mail className="w-4 h-4" />
          <span>{reservation.email}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Phone className="w-4 h-4" />
          <span>{reservation.phone}</span>
        </div>
      </div>

      {reservation.notes && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <span className="text-sm font-medium text-gray-700">Notes: </span>
          <span className="text-sm text-gray-600">{reservation.notes}</span>
        </div>
      )}

      <div className="flex space-x-2">
        {reservation.status === 'pending' && (
          <>
            <button className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors">
              Confirm
            </button>
            <button className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors">
              Cancel
            </button>
          </>
        )}
        {reservation.status === 'confirmed' && (
          <button className="px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 transition-colors">
            Check In
          </button>
        )}
        <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 transition-colors">
          Edit
        </button>
      </div>
    </div>
  );
};

export default ReservationCard;