import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, Plus, Search, Filter, Calendar, Eye, Edit, Copy, Trash2,
  TrendingUp, Clock, CheckCircle, XCircle
} from 'lucide-react';
import { quotationService } from '../../services/quotationService';

const QuotationsPage = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchQuotations();
    fetchStats();
  }, [searchTerm, statusFilter]);

  const fetchQuotations = async () => {
    setLoading(true);
    try {
      const params = {
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        limit: 50
      };

      const response = await quotationService.getAllQuotations(params);
      setQuotations(response.data.quotations);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch quotations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await quotationService.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quotation?')) return;

    try {
      await quotationService.deleteQuotation(id);
      fetchQuotations();
      fetchStats();
    } catch (error) {
      console.error('Failed to delete quotation:', error);
      alert('Failed to delete quotation. Only draft quotations can be deleted.');
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await quotationService.duplicateQuotation(id);
      fetchQuotations();
      alert('Quotation duplicated successfully!');
    } catch (error) {
      console.error('Failed to duplicate quotation:', error);
      alert('Failed to duplicate quotation');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { bg: 'bg-gray-100', text: 'text-gray-700', icon: Clock },
      sent: { bg: 'bg-blue-100', text: 'text-blue-700', icon: FileText },
      approved: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
      expired: { bg: 'bg-orange-100', text: 'text-orange-700', icon: Clock },
      converted: { bg: 'bg-purple-100', text: 'text-purple-700', icon: TrendingUp }
    };

    const config = statusConfig[status] || statusConfig.draft;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6 -m-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Quotations</h1>
          <p className="mt-2 text-base text-gray-600">
            {pagination?.totalItems || 0} quotations
          </p>
        </div>
        <Link
          to="/quotations/create"
          className="mt-4 sm:mt-0 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <Plus className="h-5 w-5" />
          <span>New Quotation</span>
        </Link>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Total Quotations</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalQuotations}</p>
              </div>
              <div className="bg-teal-100 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-teal-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Draft</p>
                <p className="text-3xl font-bold text-gray-900">{stats.draftQuotations}</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Sent</p>
                <p className="text-3xl font-bold text-gray-900">{stats.sentQuotations}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Approved</p>
                <p className="text-3xl font-bold text-gray-900">{stats.approvedQuotations}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by quotation number, customer name, or reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="expired">Expired</option>
              <option value="converted">Converted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quotations List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      ) : quotations.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
          <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No quotations found</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first quotation</p>
          <Link
            to="/quotations/create"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-lg transition-colors shadow-md"
          >
            <Plus className="h-5 w-5" />
            <span>New Quotation</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {quotations.map((quotation) => (
            <div
              key={quotation._id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  {/* Left Section */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="bg-teal-100 p-3 rounded-lg">
                        <FileText className="h-6 w-6 text-teal-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{quotation.quotationNumber}</h3>
                          {getStatusBadge(quotation.status)}
                        </div>
                        <p className="text-base text-gray-600 font-medium mb-1">
                          {quotation.customer.name}
                          {quotation.customer.companyName && ` • ${quotation.customer.companyName}`}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(quotation.quotationDate)}
                          </span>
                          <span>Valid Until: {formatDate(quotation.validUntil)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Amount */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-right">
                      <p className="text-sm text-gray-500 font-medium">Grand Total</p>
                      <p className="text-2xl font-bold text-teal-600">
                        {formatCurrency(quotation.grandTotal)}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {quotation.lineItems.length} item{quotation.lineItems.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200 mt-4">
                  <Link
                    to={`/quotations/${quotation._id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors font-medium"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                  </Link>
                  {quotation.status === 'draft' && (
                    <Link
                      to={`/quotations/${quotation._id}/edit`}
                      className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </Link>
                  )}
                  <button
                    onClick={() => handleDuplicate(quotation._id)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                  >
                    <Copy className="h-4 w-4" />
                    <span>Duplicate</span>
                  </button>
                  {quotation.status === 'draft' && (
                    <button
                      onClick={() => handleDelete(quotation._id)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuotationsPage;

