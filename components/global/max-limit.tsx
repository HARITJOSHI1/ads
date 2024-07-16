import React from 'react';
import { AlertCircle } from 'lucide-react';

const MaxLimitReached: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-yellow-500 p-4">
          <div className="flex items-center justify-center">
            <AlertCircle className="text-white mr-2" size={24} />
            <h2 className="text-2xl font-bold text-white">Max Limit Reached</h2>
          </div>
        </div>
        <div className="p-6">
          <p className="text-gray-700 text-lg mb-4">
            You've reached the maximum limit for this action. Please upgrade your plan or contact support for assistance.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 ease-in-out">
              Upgrade Plan
            </button>
            <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition duration-300 ease-in-out">
              Contact Support
            </button>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4">
          <p className="text-sm text-gray-600 text-center">
            If you believe this is an error, please refresh the page or try again later.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaxLimitReached;