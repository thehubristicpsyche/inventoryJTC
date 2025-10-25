import { Menu, Bell, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
          >
            <Menu className="h-6 w-6 text-gray-700" />
          </button>
          <div className="hidden sm:flex items-center space-x-3">
            <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse shadow-sm"></div>
            <span className="text-sm font-medium text-gray-700">All Systems Operational</span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-3">
          <button className="p-2.5 rounded-lg hover:bg-gray-100 transition-all duration-200 relative">
            <Bell className="h-5 w-5 text-gray-700" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-sm">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-gray-900">{user?.fullName}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

