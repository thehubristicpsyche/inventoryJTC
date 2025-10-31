import React from 'react';

/**
 * Loading Spinner Component
 * Reusable loading spinner with customizable size and message
 */
const LoadingSpinner = ({
  size = 'md',
  message = '',
  fullScreen = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const containerClass = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75 z-50'
    : 'flex items-center justify-center';

  return (
    <div className={`${containerClass} ${className}`}>
      <div className="flex flex-col items-center">
        <div
          className={`${sizeClasses[size]} border-4 border-gray-200 border-t-teal-600 rounded-full animate-spin`}
        />
        {message && (
          <p className="mt-4 text-sm text-gray-600 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;

