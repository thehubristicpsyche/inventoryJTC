import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Package, AlertTriangle, TrendingUp, Plus, UploadCloud, FileText } from 'lucide-react';
import { productService } from '../services/productService';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockCount: 0,
    totalValue: 0,
    activeProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productService.getStats();
      const statsData = response.data;

      setStats({
        totalProducts: statsData.totalProducts,
        lowStockCount: statsData.lowStockProducts,
        totalValue: statsData.totalValue,
        activeProducts: statsData.activeProducts,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'from-teal-500 to-cyan-500',
      textColor: 'text-teal-600',
      bgColor: 'bg-teal-50',
      change: '+12% from last month',
      changeColor: 'text-teal-600',
      link: '/products',
    },
    {
      title: 'Low Stock Alerts',
      value: stats.lowStockCount,
      icon: AlertTriangle,
      color: 'from-orange-500 to-red-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: '-8% from last month',
      changeColor: 'text-orange-600',
      link: '/products?lowStock=true',
    },
    {
      title: 'Total Inventory Value',
      value: `₹${stats.totalValue.toLocaleString('en-IN')}`,
      icon: TrendingUp,
      color: 'from-emerald-500 to-teal-500',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      change: '+18% from last month',
      changeColor: 'text-emerald-600',
      link: '/products',
    },
    {
      title: 'Active Products',
      value: stats.activeProducts,
      icon: Package,
      color: 'from-cyan-500 to-blue-500',
      textColor: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      change: '+2 from last month',
      changeColor: 'text-cyan-600',
      link: '/products?active=true',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 -m-6">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center gap-4 mb-3">
          <img 
            src="/logo.png" 
            alt="JTC Logo" 
            className="h-12 w-auto object-contain"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Stock Planner</h1>
            <p className="mt-1 text-sm text-gray-600">Manage your inventory and create quotations with ease</p>
          </div>
        </div>
      </div>

      {/* Stats Grid - More Compact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {statCards.map((stat) => (
          <Link
            key={stat.title}
            to={stat.link}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 border border-gray-200 group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`${stat.bgColor} p-2.5 rounded-lg`}>
                <stat.icon className={`h-5 w-5 ${stat.textColor}`} />
              </div>
              <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${stat.bgColor} ${stat.textColor} uppercase`}>
                ACTIVE
              </span>
            </div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{stat.title}</p>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className={`text-xs font-medium ${stat.changeColor}`}>{stat.change}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions - More Compact */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link
            to="/products/add"
            className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-lg transition-all duration-200 hover:shadow-md text-white group"
          >
            <div className="bg-white bg-opacity-30 p-3 rounded-lg mb-2 group-hover:scale-105 transition-transform">
              <Plus className="h-6 w-6 text-emerald-600" />
            </div>
            <span className="font-semibold text-sm">Add Product</span>
            <p className="text-[11px] text-emerald-100 mt-0.5">Create a new product entry</p>
          </Link>

          <Link
            to="/import"
            className="flex flex-col items-center justify-center p-4 bg-white hover:bg-gray-50 rounded-lg transition-all duration-200 hover:shadow-md border border-gray-200 group"
          >
            <div className="bg-teal-50 p-2.5 rounded-lg mb-2 group-hover:bg-teal-100 transition-colors">
              <UploadCloud className="h-5 w-5 text-teal-600" />
            </div>
            <span className="font-semibold text-sm text-gray-900">Import Data</span>
            <p className="text-[11px] text-gray-600 mt-0.5">Upload products from CSV/Excel</p>
          </Link>

          <Link
            to="/quotations/create"
            className="flex flex-col items-center justify-center p-4 bg-white hover:bg-gray-50 rounded-lg transition-all duration-200 hover:shadow-md border border-gray-200 group"
          >
            <div className="bg-cyan-50 p-2.5 rounded-lg mb-2 group-hover:bg-cyan-100 transition-colors">
              <FileText className="h-5 w-5 text-cyan-600" />
            </div>
            <span className="font-semibold text-sm text-gray-900">Create Quotation</span>
            <p className="text-[11px] text-gray-600 mt-0.5">Generate a new quotation</p>
          </Link>

          <Link
            to="/products"
            className="flex flex-col items-center justify-center p-4 bg-white hover:bg-gray-50 rounded-lg transition-all duration-200 hover:shadow-md border border-gray-200 group"
          >
            <div className="bg-emerald-50 p-2.5 rounded-lg mb-2 group-hover:bg-emerald-100 transition-colors">
              <Package className="h-5 w-5 text-emerald-600" />
            </div>
            <span className="font-semibold text-sm text-gray-900">View Products</span>
            <p className="text-[11px] text-gray-600 mt-0.5">Browse all inventory items</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
