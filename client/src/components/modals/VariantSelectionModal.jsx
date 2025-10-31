import { useState } from 'react';
import { X, Check, Package } from 'lucide-react';

const VariantSelectionModal = ({ 
  isOpen, 
  onClose, 
  product, 
  onAddToQuotation 
}) => {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const handleAddToQuotation = () => {
    if (selectedVariant) {
      onAddToQuotation({
        ...product,
        selectedVariant,
        quantity,
        finalPrice: selectedVariant.price
      });
      onClose();
    }
  };

  const getVariantOptions = () => {
    if (product.priceByColor && product.priceByColor.length > 0) {
      return product.priceByColor.map((variant, index) => ({
        id: index,
        name: variant.color || 'Standard',
        price: variant.price,
        stock: variant.stock || 0,
        description: variant.description || ''
      }));
    }
    
    // Fallback for products without priceByColor
    return [{
      id: 0,
      name: 'Standard',
      price: product.sellingPrice,
      stock: product.quantity || 0,
      description: ''
    }];
  };

  const variantOptions = getVariantOptions();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Package className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Select Variant
              </h2>
              <p className="text-sm text-gray-600">
                {product.name} - {product.sku}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-600">SKU: {product.sku}</p>
              {product.accessoryName && (
                <p className="text-sm text-blue-600 mt-1">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">i</span>
                    </span>
                    {product.accessoryName}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Variant Selection */}
        <div className="p-6">
          <h4 className="font-medium text-gray-900 mb-4">Available Options</h4>
          
          <div className="space-y-3">
            {variantOptions.map((variant) => (
              <div
                key={variant.id}
                onClick={() => setSelectedVariant(variant)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedVariant?.id === variant.id
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedVariant?.id === variant.id
                        ? 'border-teal-500 bg-teal-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedVariant?.id === variant.id && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">
                        {variant.name}
                      </h5>
                      {variant.description && (
                        <p className="text-sm text-gray-600">
                          {variant.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      ₹{variant.price?.toLocaleString() || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      Stock: {variant.stock || 0} units
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quantity Selection */}
          {selectedVariant && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center"
                  min="1"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Total Price */}
          {selectedVariant && (
            <div className="mt-4 p-4 bg-teal-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">Total Price:</span>
                <span className="text-xl font-bold text-teal-600">
                  ₹{(selectedVariant.price * quantity).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddToQuotation}
            disabled={!selectedVariant}
            className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Package className="h-4 w-4" />
            Add to Quotation
          </button>
        </div>
      </div>
    </div>
  );
};

export default VariantSelectionModal;





