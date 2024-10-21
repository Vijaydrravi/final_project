import React from 'react';

const NoAccess = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
        <p className="text-gray-700 mb-6">
          You do not have the necessary permissions to view this page. 
        </p>
        <p className="text-gray-500 mb-6">
          If you believe this is an error, please contact your administrator.
        </p>
        <a
          href="/"
          className="text-blue-500 hover:underline"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NoAccess;
