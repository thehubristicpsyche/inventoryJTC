import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Edit, Download, Mail, CheckCircle, XCircle, 
  FileText, User, Calendar, Package, DollarSign
} from 'lucide-react';
import { quotationService } from '../../services/quotationService';

const ViewQuotationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuotation();
  }, [id]);

  const fetchQuotation = async () => {
    try {
      const response = await quotationService.getQuotationById(id);
      setQuotation(response.data.quotation);
    } catch (error) {
      console.error('Error fetching quotation:', error);
      setError('Failed to load quotation');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!window.confirm(`Are you sure you want to change status to ${newStatus}?`)) return;

    setStatusLoading(true);
    try {
      await quotationService.updateStatus(id, newStatus);
      fetchQuotation();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setStatusLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { bg: 'bg-gray-100', text: 'text-gray-700', icon: FileText },
      sent: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Mail },
      approved: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
      expired: { bg: 'bg-orange-100', text: 'text-orange-700', icon: Calendar },
      converted: { bg: 'bg-purple-100', text: 'text-purple-700', icon: CheckCircle }
    };

    const config = statusConfig[status] || statusConfig.draft;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ${config.bg} ${config.text}`}>
        <Icon className="h-4 w-4" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error || !quotation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quotation Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The quotation you are looking for does not exist.'}</p>
            <Link
              to="/quotations"
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Quotations</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6 -m-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/quotations')}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-white rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{quotation.quotationNumber}</h1>
              <p className="text-gray-600">Created on {formatDate(quotation.quotationDate)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {quotation.status === 'draft' && (
              <Link
                to={`/quotations/${id}/edit`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </Link>
            )}
            <button
              onClick={() => alert('PDF generation coming soon')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Status and Quick Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                {getStatusBadge(quotation.status)}
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Valid Until</p>
                <p className="text-base font-semibold text-gray-900">{formatDate(quotation.validUntil)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Grand Total</p>
                <p className="text-2xl font-bold text-teal-600">{formatCurrency(quotation.grandTotal)}</p>
              </div>
            </div>

            {/* Status Actions */}
            {quotation.status !== 'converted' && (
              <div className="flex items-center gap-2">
                {quotation.status === 'draft' && (
                  <button
                    onClick={() => handleStatusChange('sent')}
                    disabled={statusLoading}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    Mark as Sent
                  </button>
                )}
                {quotation.status === 'sent' && (
                  <>
                    <button
                      onClick={() => handleStatusChange('approved')}
                      disabled={statusLoading}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange('rejected')}
                      disabled={statusLoading}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-gray-500" />
            <h2 className="text-xl font-bold text-gray-900">Customer Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Customer Name</p>
              <p className="text-base font-semibold text-gray-900">{quotation.customer.name}</p>
            </div>
            {quotation.customer.companyName && (
              <div>
                <p className="text-sm text-gray-500">Company</p>
                <p className="text-base font-semibold text-gray-900">{quotation.customer.companyName}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-base font-semibold text-gray-900">{quotation.customer.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-base font-semibold text-gray-900">{quotation.customer.phone}</p>
            </div>
            {quotation.customer.gstNumber && (
              <div>
                <p className="text-sm text-gray-500">GST Number</p>
                <p className="text-base font-semibold text-gray-900">{quotation.customer.gstNumber}</p>
              </div>
            )}
          </div>
        </div>

        {/* Line Items */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-5 w-5 text-gray-500" />
            <h2 className="text-xl font-bold text-gray-900">Products ({quotation.lineItems.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Product</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-gray-700">Unit Price</th>
                  <th className="text-center px-4 py-3 text-sm font-semibold text-gray-700">Qty</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-gray-700">Discount</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {quotation.lineItems.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-gray-900">{item.productName}</p>
                        <p className="text-sm text-gray-600">SKU: {item.productCode}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">{formatCurrency(item.unitPrice)}</td>
                    <td className="px-4 py-3 text-center">{item.quantity} {item.unit}</td>
                    <td className="px-4 py-3 text-right">
                      {item.discountType !== 'none' ? (
                        <span className="text-orange-600">
                          {item.discountType === 'percentage' ? `${item.discountValue}%` : formatCurrency(item.discountValue)}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">{formatCurrency(item.lineTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-5 w-5 text-gray-500" />
            <h2 className="text-xl font-bold text-gray-900">Pricing Summary</h2>
          </div>
          <div className="space-y-3 max-w-md ml-auto">
            <div className="flex justify-between text-base">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold">{formatCurrency(quotation.subtotal)}</span>
            </div>
            {quotation.overallDiscountType !== 'none' && (
              <div className="flex justify-between text-base text-orange-600">
                <span>Overall Discount:</span>
                <span>-{formatCurrency(quotation.subtotal - quotation.amountAfterDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-base">
              <span className="text-gray-600">Amount After Discount:</span>
              <span className="font-semibold">{formatCurrency(quotation.amountAfterDiscount)}</span>
            </div>
            <div className="flex justify-between text-base">
              <span className="text-gray-600">Tax ({quotation.taxRate}%):</span>
              <span className="font-semibold">{formatCurrency(quotation.taxAmount)}</span>
            </div>
            <div className="flex justify-between text-2xl font-bold text-teal-600 pt-3 border-t-2 border-gray-300">
              <span>Grand Total:</span>
              <span>{formatCurrency(quotation.grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {quotation.notes && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Notes</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{quotation.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewQuotationPage;






