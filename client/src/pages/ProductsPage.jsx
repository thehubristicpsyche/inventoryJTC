import { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, Package2, AlertCircle, Filter, X, ShoppingCart, Info, Grid3X3, List } from 'lucide-react';
import { productService } from '../services/productService';
import AddToQuotationModal from '../components/modals/AddToQuotationModal';
import VariantSelectionModal from '../components/modals/VariantSelectionModal';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState(''); // For debouncing
  const [categoryFilter, setCategoryFilter] = useState('');
  const [collectionFilter, setCollectionFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [pagination, setPagination] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [groupByCategory, setGroupByCategory] = useState(false);
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'grid' or 'list'
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [variantProduct, setVariantProduct] = useState(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        search: searchTerm || undefined,
        category: categoryFilter || undefined,
        collection: collectionFilter || undefined,
        active: activeFilter || undefined,
      };

      const response = await productService.getAllProducts(params);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, categoryFilter, collectionFilter, activeFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await productService.deleteProduct(id);
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Failed to delete product');
    }
  };

  const handleAddToQuotation = (product) => {
    // Check if product has variants
    if (product.priceByColor && product.priceByColor.length > 1) {
      setVariantProduct(product);
      setIsVariantModalOpen(true);
    } else {
      setSelectedProduct(product);
      setIsQuotationModalOpen(true);
    }
  };

  const handleVariantSelected = (productWithVariant) => {
    setSelectedProduct(productWithVariant);
    setIsVariantModalOpen(false);
    setIsQuotationModalOpen(true);
  };

  const categories = [...new Set(products.map(p => p.category))];
  const collections = [...new Set(products.map(p => p.collection).filter(Boolean))];

  // Group products by category
  const groupedProducts = products.reduce((groups, product) => {
    const category = product.category || 'Uncategorized';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(product);
    return groups;
  }, {});

  const renderProductCardGrid = (product) => (
    <div
      key={product._id}
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-teal-400 transition-all duration-300 overflow-hidden flex flex-col h-full"
    >
      {/* Product Image Placeholder */}
      <div className="h-40 bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 flex items-center justify-center relative">
        <Package2 className="h-16 w-16 text-gray-400" />
        <span className={`absolute top-3 right-3 px-2.5 py-1 text-xs font-bold rounded-lg border shadow-sm ${
          product.isActive
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : 'bg-gray-100 text-gray-600 border-gray-300'
        }`}>
          {product.isActive ? '● ON' : '○ OFF'}
        </span>
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 leading-snug min-h-[2.5rem]">
          {product.name}
        </h3>
        
        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">SKU</span>
            <span className="text-xs font-mono font-bold bg-gray-100 px-2 py-1 rounded border border-gray-200 text-gray-800">
              {product.sku}
            </span>
          </div>
          
          {product.category && (
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</span>
              <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-1 rounded border border-teal-200">
                {product.category}
              </span>
            </div>
          )}

          {product.quantity !== undefined && (
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Stock</span>
              <span className={`text-xs font-bold px-2 py-1 rounded ${
                product.isLowStock 
                  ? 'bg-orange-100 text-orange-700 border border-orange-200' 
                  : 'bg-gray-100 text-gray-700 border border-gray-200'
              }`}>
                {product.quantity} {product.unit}
              </span>
            </div>
          )}
        </div>

        {/* Price Display */}
        <div className="mb-3 p-3 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-lg border border-teal-200">
          <p className="text-xs font-semibold text-teal-700 mb-1 uppercase tracking-wide">Price Range</p>
          <div className="text-xl font-bold text-teal-900">
            {product.priceRange || '₹' + (product.sellingPrice?.toLocaleString('en-IN') || 'N/A')}
          </div>
          {product.priceByColor && product.priceByColor.length > 0 && (
            <div className="text-xs text-teal-700 mt-1 font-medium">
              {product.priceByColor.length} {product.priceByColor.length === 1 ? 'variant' : 'variants'}
            </div>
          )}
        </div>

        {/* Color Variants Preview */}
        {product.priceByColor && product.priceByColor.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-semibold text-gray-600 mb-2">Available Colors</p>
            <div className="flex flex-wrap gap-1.5">
              {product.priceByColor.slice(0, 3).map((colorOption, index) => (
                <div key={index} className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs">
                  <div className="w-2 h-2 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full"></div>
                  <span className="text-gray-700 font-medium">{colorOption.color || 'Standard'}</span>
                </div>
              ))}
              {product.priceByColor.length > 3 && (
                <div className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-xs text-gray-600 font-semibold">
                  +{product.priceByColor.length - 3}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => handleAddToQuotation(product)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-sm font-semibold"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">
              {product.priceByColor && product.priceByColor.length > 1 ? 'Select' : 'Add'}
            </span>
          </button>
          
          <Link
            to={`/products/edit/${product._id}`}
            className="inline-flex items-center justify-center px-3 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all duration-200 border border-blue-200 hover:border-blue-300 hover:shadow-md"
            title="Edit Product"
          >
            <Edit className="h-4 w-4" />
          </Link>
          
          <button
            onClick={() => handleDelete(product._id)}
            className="inline-flex items-center justify-center px-3 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all duration-200 border border-red-200 hover:border-red-300 hover:shadow-md"
            title="Delete Product"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderProductCard = (product) => (
    <div
      key={product._id}
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-teal-400 transition-all duration-300 overflow-hidden"
    >
      {/* Header Section - Brand, Status & SKU */}
      <div className="px-6 py-4 bg-gradient-to-r from-slate-50 via-gray-50 to-slate-50 border-b border-gray-200">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-3 py-1.5 bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 text-sm font-semibold rounded-lg border border-purple-200">
              {product.brand || 'CERA'}
            </span>
            <span className={`px-3 py-1.5 text-xs font-bold rounded-lg border ${
              product.isActive
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-gray-100 text-gray-600 border-gray-300'
            }`}>
              {product.isActive ? '● ACTIVE' : '○ INACTIVE'}
            </span>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs font-medium text-gray-500 mb-0.5">SKU</p>
            <p className="text-sm font-bold text-gray-900 font-mono bg-white px-3 py-1 rounded border border-gray-200">{product.sku}</p>
          </div>
        </div>
      </div>

      {/* Product Name and Tags */}
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center px-3 py-1.5 bg-teal-50 text-teal-700 text-xs font-semibold rounded-lg border border-teal-200">
            {product.category}
          </span>
          {product.productType && (
            <span className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200">
              {product.productType}
            </span>
          )}
          {product.productCodeSeries && (
            <span className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg border border-gray-200">
              Series: {product.productCodeSeries}
            </span>
          )}
        </div>
      </div>

      {/* Product Variants Grid */}
      {product.priceByColor && product.priceByColor.length > 0 && (
        <div className="px-6 py-4 bg-gradient-to-br from-gray-50 to-slate-50 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
            <p className="text-sm font-bold text-gray-800">Available Variants</p>
            <span className="ml-auto text-xs font-semibold text-gray-600 bg-white px-2 py-1 rounded border border-gray-200">
              {product.priceByColor.length} {product.priceByColor.length === 1 ? 'Option' : 'Options'}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {product.priceByColor.slice(0, 6).map((colorOption, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="w-3 h-3 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex-shrink-0 ring-2 ring-white shadow-sm"></div>
                  <span className="text-sm font-medium text-gray-800 truncate">{colorOption.color || 'Standard'}</span>
                </div>
                <span className="text-sm font-bold text-teal-700 ml-2 flex-shrink-0">₹{(colorOption.price || 0).toLocaleString('en-IN')}</span>
              </div>
            ))}
            {product.priceByColor.length > 6 && (
              <div className="flex items-center justify-center p-3 bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg border border-gray-200">
                <span className="text-sm font-semibold text-gray-700">+{product.priceByColor.length - 6} More</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stock & Price Information Row */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Stock Level</p>
            <div className="flex items-baseline gap-2">
              <p className={`text-2xl font-bold ${
                product.isLowStock ? 'text-orange-600' : 'text-gray-900'
              }`}>
                {product.quantity}
              </p>
              <span className="text-sm font-medium text-gray-600">{product.unit}</span>
              {product.isLowStock && (
                <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded">LOW</span>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Price Range</p>
            <p className="text-2xl font-bold text-teal-700">{product.priceRange}</p>
          </div>
        </div>
      </div>

      {/* Compatibility Info */}
      {product.compatibility && (
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-blue-900 mb-1">Compatibility</p>
              <p className="text-sm text-blue-800 leading-relaxed">{product.compatibility}</p>
            </div>
          </div>
        </div>
      )}

      {/* Notes */}
      {product.notes && (
        <div className="px-6 py-3 bg-amber-50 border-b border-amber-100">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-amber-900 mb-1">Important Notes</p>
              <p className="text-sm text-amber-800 leading-relaxed">{product.notes}</p>
            </div>
          </div>
        </div>
      )}

      {/* Accessory Information */}
      {product.accessoryName && (
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200">
          <div className="flex items-start gap-3">
            <div className="bg-slate-600 p-2 rounded-lg flex-shrink-0 shadow-sm">
              <Info className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 mb-1">Additional Information</p>
              <p className="text-sm text-slate-700 leading-relaxed">{product.accessoryName}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="px-6 py-4 bg-gray-50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleAddToQuotation(product)}
            className="flex-1 px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <ShoppingCart className="h-5 w-5" />
            <span>
              {product.priceByColor && product.priceByColor.length > 1 
                ? 'Select Options' 
                : 'Add to Quotation'
              }
            </span>
          </button>
          
          <Link
            to={`/products/${product._id}/edit`}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium rounded-lg transition-all duration-200 border border-blue-200 hover:border-blue-300 hover:shadow-md"
            title="Edit Product"
          >
            <Edit className="h-5 w-5" />
            <span className="hidden lg:inline">Edit</span>
          </Link>
          
          <button
            onClick={() => handleDelete(product._id)}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition-all duration-200 border border-red-200 hover:border-red-300 hover:shadow-md"
            title="Delete Product"
          >
            <Trash2 className="h-5 w-5" />
            <span className="hidden lg:inline">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 -m-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-600">
            {pagination?.totalItems || 0} items
          </p>
        </div>
        <Link
          to="/products/add"
          className="mt-3 sm:mt-0 inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Link>
      </div>

      {/* Search Bar with Enhanced Placeholder */}
      <div className="mb-6">
        <div className="relative max-w-3xl">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder='Search by SKU (e.g., "S1053102", "S1", "053"), product name, or category...'
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm text-base"
            />
          {searchInput && (
            <button
              onClick={() => setSearchInput('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        {searchTerm && (
          <p className="mt-2 text-sm text-gray-600">
            Searching for "{searchTerm}" - {pagination?.totalItems || 0} results found
          </p>
        )}
      </div>

      {/* Enhanced Filters */}
      <div className="mb-6 bg-white rounded-xl shadow-sm p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="font-medium text-gray-700">Filters:</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              >
                <option value="">All Categories</option>
                {categories.sort().map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={collectionFilter}
                onChange={(e) => setCollectionFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              >
                <option value="">All Collections</option>
                {collections.sort().map(collection => (
                  <option key={collection} value={collection}>{collection}</option>
                ))}
              </select>

              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              >
                <option value="">All Statuses</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>

              <button
                onClick={() => setGroupByCategory(!groupByCategory)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  groupByCategory
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {groupByCategory ? '📁 Grouped by Category' : '📋 List View'}
              </button>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'grid'
                      ? 'bg-teal-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Grid View"
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'list'
                      ? 'bg-teal-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="List View"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>


            {(searchTerm || categoryFilter || collectionFilter || activeFilter) && (
              <button
                onClick={() => {
                  setSearchInput('');
                  setSearchTerm('');
                  setCategoryFilter('');
                  setCollectionFilter('');
                  setActiveFilter('');
                }}
                className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Products List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
          <Package2 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-6">Get started by adding your first product</p>
          <Link
            to="/products/add"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-lg transition-colors shadow-md"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Product
          </Link>
        </div>
      ) : groupByCategory ? (
        /* Grouped by Category View */
        <div className="space-y-6">
            {Object.keys(groupedProducts).sort().map(category => (
              <div key={category} className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-r from-emerald-100 to-teal-100 px-4 py-2 rounded-lg border border-teal-200">
                    <h2 className="text-xl font-bold text-gray-900">{category}</h2>
                  </div>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                    {groupedProducts[category].length} products
                  </span>
                </div>
                {viewMode === 'grid' ? (
                  <div className="grid gap-6 pl-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {groupedProducts[category].map(product => renderProductCardGrid(product))}
                  </div>
                ) : (
                  <div className="space-y-4 pl-4">
                    {groupedProducts[category].map(product => renderProductCard(product))}
                  </div>
                )}
              </div>
            ))}
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => renderProductCardGrid(product))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {products.map((product) => renderProductCard(product))}
        </div>
      )}

      {/* Add to Quotation Modal */}
      <AddToQuotationModal
        isOpen={isQuotationModalOpen}
        onClose={() => setIsQuotationModalOpen(false)}
        product={selectedProduct}
      />

      {/* Variant Selection Modal */}
      <VariantSelectionModal
        isOpen={isVariantModalOpen}
        onClose={() => setIsVariantModalOpen(false)}
        product={variantProduct}
        onAddToQuotation={handleVariantSelected}
      />
    </div>
  );
};

export default ProductsPage;
