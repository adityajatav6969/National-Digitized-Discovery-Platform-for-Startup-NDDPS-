import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin" />
      <p className="mt-4 text-sm font-medium text-gray-500">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
