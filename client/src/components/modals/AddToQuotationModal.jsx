import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, FileText, Search, CheckCircle } from 'lucide-react';
import { quotationService } from '../../services/quotationService';

const AddToQuotationModal = ({ isOpen, onClose, product }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('select'); // 'select' or 'create'
  const [quotations, setQuotations] = useState([]);
  const [filteredQuotations, setFilteredQuotations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchQuotations();
      setMode('select');
      setSearchTerm('');
      setSelectedQuotation(null);
      setQuantity(1);
      setSuccess(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = quotations.filter(q => 
        q.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (q.customer.companyName && q.customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredQuotations(filtered);
    } else {
      setFilteredQuotations(quotations);
    }
  }, [searchTerm, quotations]);

  const fetchQuotations = async () => {
    try {
      const response = await quotationService.getAllQuotations({ 
        status: 'draft,sent',
        limit: 100 
      });
      setQuotations(response.data.quotations || []);
      setFilteredQuotations(response.data.quotations || []);
    } catch (error) {
      console.error('Failed to fetch quotations:', error);
    }
  };

  const handleAddToExisting = async () => {
    if (!selectedQuotation) return;

    setLoading(true);
    try {
      await quotationService.addLineItem(selectedQuotation._id, {
        product: product._id,
        productCode: product.sku,
        productName: product.selectedVariant 
          ? `${product.name} (${product.selectedVariant.name})`
          : product.name,
        productType: product.productStructure || 'standalone',
        unitPrice: product.finalPrice || product.sellingPrice,
        quantity: quantity,
        unit: product.unit || 'pcs',
        variantInfo: product.selectedVariant ? {
          variantName: product.selectedVariant.name,
          variantDescription: product.selectedVariant.description
        } : null
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
        navigate(`/quotations/${selectedQuotation._id}`);
      }, 1000);
    } catch (error) {
      console.error('Failed to add to quotation:', error);
      alert('Failed to add product to quotation');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    onClose();
    navigate('/quotations/create', { 
      state: { 
        preselectedProduct: {
          ...product,
          quantity: quantity,
          finalPrice: product.finalPrice || product.sellingPrice,
          selectedVariant: product.selectedVariant
        }
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Add to Quotation</h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Success State */}
        {success && (
          <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center z-10">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <p className="text-xl font-semibold text-gray-900">Product added successfully!</p>
              <p className="text-gray-600 mt-2">Redirecting to quotation...</p>
            </div>
          </div>
        )}

        {/* Product Info */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-900">{product?.name}</h3>
              <p className="text-sm text-gray-600">SKU: {product?.sku}</p>
              
              {/* Show variant information if available */}
              {product?.selectedVariant && (
                <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-800">
                    Selected: {product.selectedVariant.name}
                  </p>
                  <p className="text-xs text-blue-600">
                    {product.selectedVariant.description}
                  </p>
                </div>
              )}
              
              <p className="text-lg font-bold text-teal-600 mt-1">
                ₹{(product?.finalPrice || product?.sellingPrice)?.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Quantity:</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex gap-3">
            <button
              onClick={() => setMode('select')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                mode === 'select'
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FileText className="h-5 w-5 inline-block mr-2" />
              Add to Existing
            </button>
            <button
              onClick={() => setMode('create')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                mode === 'create'
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Plus className="h-5 w-5 inline-block mr-2" />
              Create New
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto max-h-96">
          {mode === 'select' ? (
            <>
              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search quotations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Quotations List */}
              {filteredQuotations.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">
                    {quotations.length === 0 
                      ? 'No draft or sent quotations available'
                      : 'No quotations match your search'
                    }
                  </p>
                  <button
                    onClick={() => setMode('create')}
                    className="mt-4 text-teal-600 hover:text-teal-700 font-medium"
                  >
                    Create a new quotation instead →
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredQuotations.map((quotation) => (
                    <button
                      key={quotation._id}
                      onClick={() => setSelectedQuotation(quotation)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedQuotation?._id === quotation._id
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-gray-900">{quotation.quotationNumber}</p>
                          <p className="text-sm text-gray-600">{quotation.customer.name}</p>
                          {quotation.customer.companyName && (
                            <p className="text-xs text-gray-500">{quotation.customer.companyName}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                            quotation.status === 'draft'
                              ? 'bg-gray-100 text-gray-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {quotation.status}
                          </span>
                          <p className="text-sm font-semibold text-gray-900 mt-1">
                            ₹{quotation.grandTotal.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Plus className="h-16 w-16 text-teal-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Create New Quotation</h3>
              <p className="text-gray-600 mb-6">
                This product will be pre-added to your new quotation.<br />
                You can then add customer details and more products.
              </p>
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-lg transition-all shadow-md"
              >
                <Plus className="h-5 w-5" />
                Create Quotation with this Product
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {mode === 'select' && filteredQuotations.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddToExisting}
                disabled={!selectedQuotation || loading}
                className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-lg transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding...' : 'Add to Quotation'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddToQuotationModal;

