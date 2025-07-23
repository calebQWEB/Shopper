import { Info, Medal, Trophy, UserX } from "lucide-react";
import Link from "next/link";
import React from "react";

const CustomerTable = ({
  customerFetchData,
  customerFetchError,
  customerFetchLoad,
}) => {
  if (customerFetchLoad)
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <p className="text-gray-600 text-lg">Loading customers...</p>
      </div>
    );

  if (customerFetchError)
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <p className="text-red-500 text-lg">{customerFetchError}</p>
      </div>
    );

  const renderStatus = (st) => {
    switch (st) {
      case "active":
        return (
          <span className="text-green-800 font-bold text-sm bg-green-300 px-2 py-1 rounded-2xl">
            {st}
          </span>
        );
      case "banned":
        return (
          <span className="text-red-800 font-bold text-sm bg-red-300 px-2 py-1 rounded-2xl">
            {st}
          </span>
        );
      default:
        return (
          <span className="text-gray-800 font-bold text-sm bg-gray-200 px-2 py-1 rounded-2xl">
            {st}
          </span>
        );
    }
  };

  const renderLevel = (level) => {
    switch (level) {
      case "platinum":
        return <Trophy className="text-gray-500" />;
      case "gold":
        return <Medal className="text-yellow-500" />;
      case "silver":
        return <Medal className="text-gray-300" />;
      default:
        return <Medal className="text-orange-700" />;
    }
  };

  return (
    <table className="min-w-full divide-y divide-gray-200 font-montserrat">
      <thead className="bg-gray-100">
        <tr>
          {[
            "Name",
            "Phone Number",
            "Total Spent",
            "Status",
            "Level",
            "Joined In",
            "Actions",
          ].map((heading) => (
            <th
              key={heading}
              className="px-6 py-3 text-left text-sm font-extrabold text-gray-700 uppercase tracking-wider border-b"
            >
              {heading}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {customerFetchData &&
          customerFetchData.map((customer) => (
            <tr
              key={customer.id}
              className="transition-colors duration-200 hover:bg-gray-50"
            >
              <td className="px-6 py-4 text-gray-800 font-bold text-sm">
                {customer.name}
              </td>
              <td className="px-6 py-4 text-gray-800 font-bold text-sm">
                {customer.phoneNumber || "N/A"}
              </td>
              <td className="px-6 py-4 text-gray-800 font-bold text-sm">
                ₦{customer.totalSpent.toLocaleString()}
              </td>
              <td className="px-6 py-4 text-gray-800 font-bold text-sm">
                {renderStatus(customer.status) || "N/A"}
              </td>
              <td className="px-6 py-4 text-gray-800 font-bold text-sm">
                {renderLevel(customer.spendLevel)}
              </td>
              <td className="px-6 py-4 text-gray-800 font-bold text-sm">
                {new Date(customer.createdAt).toLocaleString()}
              </td>

              <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-3">
                <Link href={`/controlpanel/customer/details/${customer.id}`}>
                  <button
                    title="View Details"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <Info size={18} />
                  </button>
                </Link>

                <button
                  title="Ban User"
                  className="text-red-600 hover:text-red-800"
                >
                  <UserX size={18} />
                </button>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default CustomerTable;
