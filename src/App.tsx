import React, { useState } from 'react';
import { LayoutDashboard, Coffee, Calendar, User, Menu, X } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Cafeteria from './pages/Cafeteria';
import Reservations from './pages/Reservations';
import Profile from './pages/Profile';

type Page = 'dashboard' | 'cafeteria' | 'reservations' | 'profile';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'cafeteria', name: 'Cafeteria', icon: Coffee },
    { id: 'reservations', name: 'Table Reservations', icon: Calendar },
    { id: 'profile', name: 'Profile', icon: User },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'cafeteria':
        return <Cafeteria />;
      case 'reservations':
        return <Reservations />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">RestaurantOS</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="mt-8 px-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id as Page);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center px-4 py-3 mb-2 text-left rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-orange-50 text-orange-600 border-r-4 border-orange-500' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-orange-500' : ''}`} />
                <span className="font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
              <span className="text-gray-700 font-medium">Admin User</span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;