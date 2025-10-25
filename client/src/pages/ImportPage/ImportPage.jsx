import { useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, XCircle, AlertCircle, Download, RefreshCw } from 'lucide-react';
import axios from 'axios';
import DatabaseStatsModal from '../../components/modals/DatabaseStatsModal';

const ImportPage = () => {
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [showStatsModal, setShowStatsModal] = useState(false);

  const handleBatchImport = async () => {
    setImporting(true);
    setError('');
    setResults(null);

    try {
      const response = await axios.post('http://localhost:5002/api/import/batch', {
        directory: '/Users/psyche/JTC/Product Categories'
      });

      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to import products');
      console.error('Import error:', err);
    } finally {
      setImporting(false);
    }
  };

  const handleGetStats = () => {
    setShowStatsModal(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Data Import</h1>
        <p className="mt-2 text-base text-gray-600">
          Import product data from CSV files into the system
        </p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Batch Import Card */}
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200 hover:shadow-md transition-shadow flex flex-col">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-indigo-100 p-4 rounded-xl">
              <FileSpreadsheet className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Batch Import</h2>
              <p className="text-sm text-gray-600 mt-1">Import all CSV files at once</p>
            </div>
          </div>
          
          <p className="text-gray-700 mb-6 flex-grow">
            Import all product data from the Product Categories folder. The system will automatically 
            detect product structures, parse pricing, and handle duplicates.
          </p>

          <button
            onClick={handleBatchImport}
            disabled={importing}
            className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center space-x-2 mt-auto"
          >
            {importing ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Importing...</span>
              </>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                <span>Start Batch Import</span>
              </>
            )}
          </button>
        </div>

        {/* Statistics Card */}
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200 hover:shadow-md transition-shadow flex flex-col">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-green-100 p-4 rounded-xl">
              <Download className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Database Stats</h2>
              <p className="text-sm text-gray-600 mt-1">View current data statistics</p>
            </div>
          </div>
          
          <p className="text-gray-700 mb-6 flex-grow">
            Get detailed statistics about imported products, categories, and product structures 
            currently in the database.
          </p>

          <button
            onClick={handleGetStats}
            className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2 mt-auto"
          >
            <Download className="h-5 w-5" />
            <span>View Statistics</span>
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
          <div className="flex items-start space-x-3">
            <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-red-900 mb-1">Import Failed</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Results Display */}
      {results && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Summary Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Import Complete</h2>
                <p className="text-indigo-100">
                  Processed {results.total_files} files • {results.total_inserted} products imported
                </p>
              </div>
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-8 border-b border-gray-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{results.total_files}</div>
              <div className="text-sm text-gray-600 mt-1">Total Files</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{results.successful}</div>
              <div className="text-sm text-gray-600 mt-1">Successful</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{results.failed}</div>
              <div className="text-sm text-gray-600 mt-1">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">{results.total_products}</div>
              <div className="text-sm text-gray-600 mt-1">Total Products</div>
            </div>
          </div>

          {/* File Details */}
          <div className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">File Details</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {results.files.map((file, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    file.status === 'success'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {file.status === 'success' ? (
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                        )}
                        <span className="font-semibold text-gray-900 break-all">
                          {file.file}
                        </span>
                      </div>
                      
                      {file.status === 'success' ? (
                        <div className="ml-8 grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Products:</span>
                            <span className="ml-2 font-medium text-gray-900">{file.products}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Inserted:</span>
                            <span className="ml-2 font-medium text-green-600">{file.inserted}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Duplicates:</span>
                            <span className="ml-2 font-medium text-gray-600">{file.duplicates}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="ml-8 text-sm text-red-700">
                          {file.error}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Information Panel */}
      {!results && !error && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Import Information</h3>
              <ul className="text-blue-700 space-y-2 text-sm">
                <li>• The system automatically detects product structures (standalone, sets, two-part systems, etc.)</li>
                <li>• Duplicate SKUs will be updated with the latest data</li>
                <li>• All products start with stock = 0 (update stock separately)</li>
                <li>• Color variants and set components are automatically parsed</li>
                <li>• Pricing is parsed from INR format (handles commas)</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Database Stats Modal */}
      <DatabaseStatsModal 
        isOpen={showStatsModal} 
        onClose={() => setShowStatsModal(false)} 
      />
    </div>
  );
};

export default ImportPage;

