import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Plus, User, LogOut, Upload, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useState, useEffect } from 'react';

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    if (saved !== null) {
      setIsCollapsed(saved === 'true');
    }
  }, []);

  // Save collapsed state to localStorage
  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', newState.toString());
  };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/products', icon: Package, label: 'Products' },
    { to: '/products/add', icon: Plus, label: 'Add Product' },
    { to: '/quotations', icon: FileText, label: 'Quotations' },
    { to: '/import', icon: Upload, label: 'Import Data' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-r border-gray-700 shadow-2xl transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Toggle */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
            {!isCollapsed && (
              <>
                <div className="flex items-center space-x-2">
                  <img 
                    src="/logo.png" 
                    alt="JTC Logo" 
                    className="h-10 w-auto"
                  />
                  <div>
                    <span className="font-bold text-base text-white">Johari Trading</span>
                    <p className="text-[10px] text-gray-400">Inventory System</p>
                  </div>
                </div>
                <button
                  onClick={toggleCollapse}
                  className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </>
            )}
            {isCollapsed && (
              <button
                onClick={toggleCollapse}
                className="flex items-center justify-center w-full h-full hover:bg-gray-700 rounded-lg transition-all duration-200 group"
                title="Expand sidebar"
              >
                <img 
                  src="/logo.png" 
                  alt="JTC" 
                  className="h-10 w-auto group-hover:scale-105 transition-transform duration-200"
                />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                title={isCollapsed ? item.label : ''}
                className={({ isActive }) =>
                  `flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/50'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white hover:scale-105'
                  }`
                }
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
              </NavLink>
            ))}
          </nav>

          {/* Logout button */}
          <div className="p-3 border-t border-gray-700">
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              title={isCollapsed ? 'Logout' : ''}
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 w-full text-red-400 hover:bg-red-900/30 hover:text-red-300 rounded-lg transition-colors`}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

