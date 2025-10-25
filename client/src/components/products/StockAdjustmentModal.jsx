import { useState } from 'react';
import { X } from 'lucide-react';

const StockAdjustmentModal = ({ product, isOpen, onClose, onAdjust }) => {
  const [adjustment, setAdjustment] = useState(0);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onAdjust(product._id, parseInt(adjustment), reason);
      setAdjustment(0);
      setReason('');
      onClose();
    } catch (error) {
      alert('Failed to adjust stock');
    } finally {
      setLoading(false);
    }
  };

  const newQuantity = product.quantity + parseInt(adjustment || 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Adjust Stock: {product.name}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Current Stock */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Current Stock</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {product.quantity} {product.unit}
                  </p>
                </div>

                {/* Adjustment Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adjustment *
                  </label>
                  <input
                    type="number"
                    required
                    value={adjustment}
                    onChange={(e) => setAdjustment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter positive or negative number"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Use positive numbers to add stock, negative to subtract
                  </p>
                </div>

                {/* New Quantity Preview */}
                {adjustment && (
                  <div className={`p-3 rounded-lg ${newQuantity < 0 ? 'bg-red-50' : 'bg-blue-50'}`}>
                    <p className="text-sm text-gray-600">New Stock Level</p>
                    <p className={`text-xl font-bold ${newQuantity < 0 ? 'text-red-600' : 'text-blue-600'}`}>
                      {newQuantity} {product.unit}
                      {newQuantity < 0 && (
                        <span className="text-sm font-normal text-red-600 ml-2">
                          (Invalid - cannot be negative)
                        </span>
                      )}
                    </p>
                  </div>
                )}

                {/* Reason */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason
                  </label>
                  <textarea
                    rows="3"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter reason for adjustment (optional)"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !adjustment || newQuantity < 0}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adjusting...' : 'Confirm Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockAdjustmentModal;





