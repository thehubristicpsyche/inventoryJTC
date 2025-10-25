import { useState, useEffect } from 'react';
import { X, Database, Package, Tag, TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';

const DatabaseStatsModal = ({ isOpen, onClose, stats }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && !stats) {
      fetchStats();
    }
  }, [isOpen, stats]);

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5002/api/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }
      const data = await response.json();
      // Handle the response data here if needed
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 sm:mx-0 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="h-8 w-8 text-white" />
              <div>
                <h2 className="text-2xl font-bold text-white">Database Statistics</h2>
                <p className="text-blue-100">Current inventory overview</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading statistics...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8">
              <AlertTriangle className="h-8 w-8 text-red-500 mr-3" />
              <span className="text-red-600">{error}</span>
            </div>
          ) : stats ? (
            <div className="space-y-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Package className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Total Products</p>
                      <p className="text-2xl font-bold text-blue-900">{stats.totalProducts || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Tag className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Categories</p>
                      <p className="text-2xl font-bold text-green-900">{stats.categories?.length || 0}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Brand Distribution */}
              {stats.brands && Object.keys(stats.brands).length > 0 && (
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Brand Distribution
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(stats.brands).map(([brand, count]) => (
                      <div key={brand} className="flex items-center justify-between p-2 bg-white rounded-lg">
                        <span className="font-medium text-gray-700">{brand}</span>
                        <span className="text-sm font-bold text-gray-900">{count} products</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Category Distribution */}
              {stats.categories && Object.keys(stats.categories).length > 0 && (
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Category Distribution
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries(stats.categories).map(([category, count]) => (
                      <div key={category} className="flex items-center justify-between p-2 bg-white rounded-lg">
                        <span className="text-sm font-medium text-gray-700 truncate">{category}</span>
                        <span className="text-sm font-bold text-gray-900">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Collection Distribution */}
              {stats.collections && Object.keys(stats.collections).length > 0 && (
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Collection Distribution
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(stats.collections).map(([collection, count]) => (
                      <div key={collection} className="flex items-center justify-between p-2 bg-white rounded-lg">
                        <span className="font-medium text-gray-700">{collection || 'No Collection'}</span>
                        <span className="text-sm font-bold text-gray-900">{count} products</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <AlertTriangle className="h-8 w-8 text-yellow-500 mr-3" />
              <span className="text-yellow-600">No statistics available</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Last updated: {new Date().toLocaleString()}
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseStatsModal;