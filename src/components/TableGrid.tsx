import React, { useState } from 'react';
import { Users, MoreVertical } from 'lucide-react';

interface Table {
  id: string;
  number: number;
  seats: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  customer?: string;
  timeOccupied?: string;
}

interface TableGridProps {
  density: 'comfortable' | 'compact' | 'cozy';
}

const TableGrid: React.FC<TableGridProps> = ({ density }) => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const tables: Table[] = [
    { id: 'T-01', number: 1, seats: 2, status: 'available' },
    { id: 'T-02', number: 2, seats: 4, status: 'occupied', customer: 'John Smith', timeOccupied: '45 min' },
    { id: 'T-03', number: 3, seats: 2, status: 'reserved', customer: 'Sarah Johnson' },
    { id: 'T-04', number: 4, seats: 6, status: 'available' },
    { id: 'T-05', number: 5, seats: 4, status: 'cleaning' },
    { id: 'T-06', number: 6, seats: 2, status: 'occupied', customer: 'Mike Wilson', timeOccupied: '20 min' },
    { id: 'T-07', number: 7, seats: 4, status: 'available' },
    { id: 'T-08', number: 8, seats: 8, status: 'reserved', customer: 'Emily Davis' },
    { id: 'T-09', number: 9, seats: 2, status: 'available' },
    { id: 'T-10', number: 10, seats: 4, status: 'occupied', customer: 'David Brown', timeOccupied: '1h 15min' },
    { id: 'T-11', number: 11, seats: 2, status: 'available' },
    { id: 'T-12', number: 12, seats: 6, status: 'available' },
    { id: 'T-13', number: 13, seats: 4, status: 'reserved', customer: 'Lisa Garcia' },
    { id: 'T-14', number: 14, seats: 2, status: 'occupied', customer: 'Tom Anderson', timeOccupied: '30 min' },
    { id: 'T-15', number: 15, seats: 4, status: 'available' },
    { id: 'T-16', number: 16, seats: 2, status: 'cleaning' },
    { id: 'T-17', number: 17, seats: 6, status: 'available' },
    { id: 'T-18', number: 18, seats: 4, status: 'occupied', customer: 'Anna White', timeOccupied: '55 min' },
    { id: 'T-19', number: 19, seats: 2, status: 'available' },
    { id: 'T-20', number: 20, seats: 4, status: 'reserved', customer: 'Chris Lee' },
    { id: 'T-21', number: 21, seats: 8, status: 'available' },
    { id: 'T-22', number: 22, seats: 2, status: 'occupied', customer: 'Maria Rodriguez', timeOccupied: '25 min' },
    { id: 'T-23', number: 23, seats: 4, status: 'available' },
    { id: 'T-24', number: 24, seats: 6, status: 'available' }
  ];

  const getStatusColor = (status: Table['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'occupied':
        return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'reserved':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'cleaning':
        return 'bg-gray-100 border-gray-300 text-gray-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getDensityClasses = () => {
    switch (density) {
      case 'comfortable':
        return 'grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6';
      case 'compact':
        return 'grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4';
      case 'cozy':
        return 'grid-cols-5 md:grid-cols-7 lg:grid-cols-10 gap-3';
      default:
        return 'grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Table Layout</h2>
        <div className="text-sm text-gray-600">
          Click on a table to view details
        </div>
      </div>

      <div className={`grid ${getDensityClasses()}`}>
        {tables.map((table) => (
          <div
            key={table.id}
            onClick={() => setSelectedTable(selectedTable === table.id ? null : table.id)}
            className={`
              relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md
              ${getStatusColor(table.status)}
              ${selectedTable === table.id ? 'ring-2 ring-orange-500 ring-offset-2' : ''}
            `}
          >
            <div className="text-center">
              <div className="font-bold text-lg mb-1">{table.number}</div>
              <div className="flex items-center justify-center text-xs mb-2">
                <Users className="w-3 h-3 mr-1" />
                {table.seats}
              </div>
              <div className="text-xs font-medium capitalize">{table.status}</div>
              
              {table.customer && (
                <div className="mt-2 text-xs">
                  <div className="font-medium truncate">{table.customer}</div>
                  {table.timeOccupied && (
                    <div className="text-gray-600">{table.timeOccupied}</div>
                  )}
                </div>
              )}
            </div>

            <button className="absolute top-1 right-1 p-1 opacity-0 group-hover:opacity-100 hover:bg-white hover:bg-opacity-50 rounded transition-opacity">
              <MoreVertical className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Table Details Panel */}
      {selectedTable && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          {(() => {
            const table = tables.find(t => t.id === selectedTable);
            if (!table) return null;
            
            return (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Table {table.number} Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Seats:</span>
                    <span className="ml-2 font-medium">{table.seats}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <span className="ml-2 font-medium capitalize">{table.status}</span>
                  </div>
                  {table.customer && (
                    <div>
                      <span className="text-gray-600">Customer:</span>
                      <span className="ml-2 font-medium">{table.customer}</span>
                    </div>
                  )}
                  {table.timeOccupied && (
                    <div>
                      <span className="text-gray-600">Duration:</span>
                      <span className="ml-2 font-medium">{table.timeOccupied}</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <button className="px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 transition-colors">
                    Update Status
                  </button>
                  <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 transition-colors">
                    View History
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default TableGrid;