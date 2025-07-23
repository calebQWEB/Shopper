import React from "react";

const Support = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh] bg-gradient-to-br from-gray-50 to-white px-4">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-md w-full text-center space-y-6 border border-gray-100">
        <h1 className="font-montserrat text-2xl md:text-3xl font-semibold text-gray-800">
          Need Help?
        </h1>
        <p className="text-sm text-gray-600">
          If you're having trouble using the platform, we’ve got you covered.
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <button className="w-full md:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg hover:scale-105 active:scale-95">
            View Documentation
          </button>
          <button className="w-full md:w-auto px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg hover:scale-105 active:scale-95">
            Send a Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default Support;
