import { Building } from 'lucide-react';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center gap-4 max-w-sm w-full mx-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-yellow-500"></div>
          <Building className="w-6 h-6 text-yellow-500 absolute top-3 left-3" />
        </div>
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700 mb-1">{message}</p>
          <p className="text-sm text-gray-500">Please wait...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;