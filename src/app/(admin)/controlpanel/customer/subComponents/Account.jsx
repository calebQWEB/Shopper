import React from "react";

const Account = ({ user }) => {
  if (!user)
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <p className="text-red-500 text-lg">User not found</p>
      </div>
    );

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-3xl w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 font-montserrat">
        Account Information
      </h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 font-medium">Name:</span>
          <span className="text-gray-900 font-semibold">
            {user.name || "N/A"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600 font-medium">Email:</span>
          <span className="text-gray-900 font-semibold">
            {user.email || "N/A"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600 font-medium">Phone Number:</span>
          <span className="text-gray-900 font-semibold">
            {user.phone || "N/A"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600 font-medium">Customer Code:</span>
          <span className="text-gray-900 font-semibold">
            {user.customerCode || "N/A"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600 font-medium">Spend Level:</span>
          <span className="text-gray-900 font-semibold capitalize">
            {user.spendLevel || "N/A"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600 font-medium">Status:</span>
          <span className="text-gray-900 font-semibold capitalize">
            {user.status || "N/A"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600 font-medium">Total Spent:</span>
          <span className="text-green-600 font-bold">
            ₦{user.totalSpent?.toLocaleString() || "0"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Account;
