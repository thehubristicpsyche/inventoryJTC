import React from 'react';
import { AlertCircle, X } from 'lucide-react';

/**
 * Error Message Component
 * Displays error messages with dismiss functionality
 */
const ErrorMessage = ({
  message,
  onDismiss,
  type = 'error',
  className = '',
  showIcon = true,
}) => {
  if (!message) return null;

  const typeClasses = {
    error: 'bg-red-50 border-red-200 text-red-700',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700',
  };

  const iconColors = {
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500',
  };

  return (
    <div
      className={`${typeClasses[type]} border rounded-lg px-4 py-3 flex items-start gap-3 ${className}`}
      role="alert"
    >
      {showIcon && (
        <AlertCircle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${iconColors[type]}`} />
      )}
      <p className="flex-1 text-sm font-medium">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;

