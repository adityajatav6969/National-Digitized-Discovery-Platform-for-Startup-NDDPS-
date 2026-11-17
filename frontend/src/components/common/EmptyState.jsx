import React from 'react';
import { Link } from 'react-router-dom';

const EmptyState = ({ icon: Icon, title = 'Nothing here yet', description = '', actionLabel, actionLink }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {Icon && (
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
          <Icon className="h-8 w-8 text-gray-400" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-gray-500 max-w-md">{description}</p>
      )}
      {actionLabel && actionLink && (
        <Link
          to={actionLink}
          className="mt-6 inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
