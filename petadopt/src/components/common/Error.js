import React from 'react';
import { FaExclamationCircle } from 'react-icons/fa';

const Error = ({ message, retry, className = '' }) => {
  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-3">
        <FaExclamationCircle className="text-red-500 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-red-700">{message}</p>
          {retry && (
            <button
              onClick={retry}
              className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Error; 