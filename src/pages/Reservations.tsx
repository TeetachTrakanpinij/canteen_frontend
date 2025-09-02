import React, { useState } from 'react';
import { Calendar, Clock, Users, Search, Filter, Plus } from 'lucide-react';
import ReservationCard from '../components/ReservationCard';
import NewReservationModal from '../components/NewReservationModal';

const Reservations = () => {
  const [showNewReservation, setShowNewReservation] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');

  const reservations = [
    {
      id: '1',
      customerName: 'John Smith',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      date: '2025-01-15',
      time: '19:00',
      guests: 4,
      table: 'T-12',
      status: 'confirmed' as const,
      notes: 'Birthday celebration'
    },
    {
      id: '2',
      customerName: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 (555) 987-6543',
      date: '2025-01-15',
      time: '20:30',
      guests: 2,
      table: 'T-08',
      status: 'pending' as const,
      notes: 'Anniversary dinner'
    },
    {
      id: '3',
      customerName: 'Mike Wilson',
      email: 'mike@example.com',
      phone: '+1 (555) 456-7890',
      date: '2025-01-16',
      time: '18:00',
      guests: 6,
      table: 'T-15',
      status: 'confirmed' as const,
      notes: 'Business dinner'
    },
    {
      id: '4',
      customerName: 'Emily Davis',
      email: 'emily@example.com',
      phone: '+1 (555) 321-0987',
      date: '2025-01-16',
      time: '19:30',
      guests: 3,
      table: 'T-05',
      status: 'cancelled' as const,
      notes: 'Family gathering'
    }
  ];

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || reservation.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const statusCounts = {
    all: reservations.length,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    pending: reservations.filter(r => r.status === 'pending').length,
    cancelled: reservations.filter(r => r.status === 'cancelled').length
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Table Reservations</h1>
          <p className="text-gray-600">Manage customer reservations and table bookings</p>
        </div>
        
        <button
          onClick={() => setShowNewReservation(true)}
          className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Reservation
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{statusCounts.all}</div>
          <div className="text-sm text-gray-600">Total Reservations</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-2xl font-bold text-green-600">{statusCounts.confirmed}</div>
          <div className="text-sm text-gray-600">Confirmed</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-2xl font-bold text-red-600">{statusCounts.cancelled}</div>
          <div className="text-sm text-gray-600">Cancelled</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search reservations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reservations List */}
      <div className="space-y-4">
        {filteredReservations.length > 0 ? (
          filteredReservations.map((reservation) => (
            <ReservationCard key={reservation.id} reservation={reservation} />
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reservations found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* New Reservation Modal */}
      {showNewReservation && (
        <NewReservationModal onClose={() => setShowNewReservation(false)} />
      )}
    </div>
  );
};

export default Reservations;