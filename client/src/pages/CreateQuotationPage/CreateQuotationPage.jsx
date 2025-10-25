import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Save, X, Plus, Search, Trash2 } from 'lucide-react';
import { quotationService } from '../../services/quotationService';
import { productService } from '../../services/productService';

const CreateQuotationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Customer Information
  const [customer, setCustomer] = useState({
    name: '',
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    gstNumber: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    }
  });

  // Quotation Details
  const [validUntil, setValidUntil] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');
  
  // Line Items
  const [lineItems, setLineItems] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  // Pricing
  const [taxRate, setTaxRate] = useState(18);
  const [overallDiscountType, setOverallDiscountType] = useState('none');
  const [overallDiscountValue, setOverallDiscountValue] = useState(0);

  // Set default valid until date (30 days from now)
  useEffect(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    setValidUntil(date.toISOString().split('T')[0]);
  }, []);

  // Handle preselected product from Add to Quotation modal
  useEffect(() => {
    if (location.state?.preselectedProduct) {
      const product = location.state.preselectedProduct;
      addProduct(product);
    }
  }, [location.state]);

  // Search products
  useEffect(() => {
    const searchProducts = async () => {
      if (productSearch.length > 1) {
        try {
          const response = await productService.getAllProducts({ search: productSearch, limit: 10 });
          setSearchResults(response.data.products);
          setShowSearch(true);
        } catch (error) {
          console.error('Search error:', error);
        }
      } else {
        setSearchResults([]);
        setShowSearch(false);
      }
    };

    const timer = setTimeout(searchProducts, 300);
    return () => clearTimeout(timer);
  }, [productSearch]);

  // Add product to line items
  const addProduct = (product) => {
    const newItem = {
      product: product._id,
      productCode: product.sku,
      productName: product.name,
      productType: product.productStructure || 'standalone',
      unitPrice: product.sellingPrice,
      quantity: 1,
      unit: product.unit || 'pcs',
      discountType: 'none',
      discountValue: 0,
      lineSubtotal: product.sellingPrice,
      lineTotal: product.sellingPrice
    };
    
    setLineItems([...lineItems, newItem]);
    setProductSearch('');
    setShowSearch(false);
  };

  // Update line item
  const updateLineItem = (index, field, value) => {
    const updated = [...lineItems];
    updated[index][field] = value;

    // Recalculate
    if (field === 'quantity' || field === 'unitPrice' || field === 'discountType' || field === 'discountValue') {
      const item = updated[index];
      item.lineSubtotal = item.unitPrice * item.quantity;

      if (item.discountType === 'percentage') {
        item.lineTotal = item.lineSubtotal - (item.lineSubtotal * item.discountValue / 100);
      } else if (item.discountType === 'fixed') {
        item.lineTotal = item.lineSubtotal - item.discountValue;
      } else {
        item.lineTotal = item.lineSubtotal;
      }
    }

    setLineItems(updated);
  };

  // Remove line item
  const removeLineItem = (index) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
    
    let amountAfterDiscount = subtotal;
    if (overallDiscountType === 'percentage') {
      amountAfterDiscount = subtotal - (subtotal * overallDiscountValue / 100);
    } else if (overallDiscountType === 'fixed') {
      amountAfterDiscount = subtotal - overallDiscountValue;
    }

    const taxAmount = amountAfterDiscount * (taxRate / 100);
    const grandTotal = amountAfterDiscount + taxAmount;

    return { subtotal, amountAfterDiscount, taxAmount, grandTotal };
  };

  const totals = calculateTotals();

  // Submit quotation
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (lineItems.length === 0) {
      setError('Please add at least one product');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const quotationData = {
        customer,
        lineItems,
        validUntil,
        referenceNumber,
        notes,
        taxRate,
        overallDiscountType,
        overallDiscountValue
      };

      await quotationService.createQuotation(quotationData);
      navigate('/quotations');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create quotation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6 -m-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Quotation</h1>
            <p className="text-gray-600 mt-1">Fill in the details below to generate a quotation</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/quotations')}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-white rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
            <span>Cancel</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Customer Information */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={customer.companyName}
                  onChange={(e) => setCustomer({ ...customer, companyName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GST Number
                </label>
                <input
                  type="text"
                  value={customer.gstNumber}
                  onChange={(e) => setCustomer({ ...customer, gstNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Quotation Details */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quotation Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valid Until *
                </label>
                <input
                  type="date"
                  required
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reference Number
                </label>
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Products Selection */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Products</h2>
            
            {/* Product Search */}
            <div className="relative mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products by SKU, name, or category..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Search Results */}
              {showSearch && searchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-64 overflow-y-auto">
                  {searchResults.map((product) => (
                    <button
                      key={product._id}
                      type="button"
                      onClick={() => addProduct(product)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0"
                    >
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-600">SKU: {product.sku} | Price: ₹{product.sellingPrice}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Line Items */}
            {lineItems.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Plus className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>No products added yet. Search and add products above.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {lineItems.map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.productName}</h3>
                        <p className="text-sm text-gray-600">SKU: {item.productCode}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeLineItem(index)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(index, 'quantity', parseInt(e.target.value))}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-teal-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Unit Price</label>
                        <input
                          type="number"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) => updateLineItem(index, 'unitPrice', parseFloat(e.target.value))}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-teal-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Discount Type</label>
                        <select
                          value={item.discountType}
                          onChange={(e) => updateLineItem(index, 'discountType', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-teal-500"
                        >
                          <option value="none">No Discount</option>
                          <option value="percentage">Percentage</option>
                          <option value="fixed">Fixed Amount</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Discount Value</label>
                        <input
                          type="number"
                          min="0"
                          value={item.discountValue}
                          onChange={(e) => updateLineItem(index, 'discountValue', parseFloat(e.target.value))}
                          disabled={item.discountType === 'none'}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Line Total</label>
                        <div className="px-2 py-1 bg-emerald-50 border border-emerald-200 rounded text-sm font-bold text-emerald-700">
                          ₹{item.lineTotal.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pricing Summary */}
          {lineItems.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Pricing Summary</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={taxRate}
                      onChange={(e) => setTaxRate(parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Overall Discount Type
                    </label>
                    <select
                      value={overallDiscountType}
                      onChange={(e) => setOverallDiscountType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="none">No Discount</option>
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Value
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={overallDiscountValue}
                      onChange={(e) => setOverallDiscountValue(parseFloat(e.target.value))}
                      disabled={overallDiscountType === 'none'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">₹{totals.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {overallDiscountType !== 'none' && (
                    <div className="flex justify-between text-base text-orange-600">
                      <span>Discount:</span>
                      <span>-₹{(totals.subtotal - totals.amountAfterDiscount).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">Tax ({taxRate}%):</span>
                    <span className="font-semibold">₹{totals.taxAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-2xl font-bold text-teal-600 pt-2 border-t">
                    <span>Grand Total:</span>
                    <span>₹{totals.grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Notes</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="4"
              placeholder="Add any special instructions or notes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/quotations')}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || lineItems.length === 0}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-lg transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-5 w-5" />
              <span>{loading ? 'Creating...' : 'Create Quotation'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuotationPage;

