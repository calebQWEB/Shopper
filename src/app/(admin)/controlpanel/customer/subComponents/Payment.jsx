"use client";
import React, { useEffect, useState } from "react";

const Payment = ({ customerCode }) => {
  const [customerPayDetails, setCustomerPayDetails] = useState([]);
  const [customerPayError, setCustomerPayError] = useState("");
  const [customerPayLoading, setCustomerPayLoading] = useState(false);

  const fetchPaymentDetails = async () => {
    try {
      setCustomerPayLoading(true);
      const res = await fetch(`/api/transactions?customer=${customerCode}`);
      if (!res.ok) {
        const errorData = await res.json();
        setCustomerPayError(
          errorData.message || "Failed to fetch payment details"
        );
        return;
      }
      const data = await res.json();
      setCustomerPayDetails(data);
      console.log(data);
    } catch (error) {
      setCustomerPayError(error.message || "Unknown error");
      console.error(error);
    } finally {
      setCustomerPayLoading(false);
    }
  };

  useEffect(() => {
    if (!customerCode) return;
    fetchPaymentDetails();
  }, [customerCode]);

  const renderStatus = (st) => {
    const commonClasses = "font-bold text-sm px-2 py-1 rounded-2xl capitalize";

    switch (st) {
      case "success":
        return (
          <span className={`text-green-800 bg-green-300 ${commonClasses}`}>
            {st}
          </span>
        );

      case "failed":
      case "abandoned":
      case "reversed":
        return (
          <span className={`text-red-800 bg-red-200 ${commonClasses}`}>
            {st}
          </span>
        );

      default:
        return (
          <span className={`text-gray-800 bg-gray-300 ${commonClasses}`}>
            {st}
          </span>
        );
    }
  };

  if (customerPayLoading)
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <p className="text-gray-600 text-lg">Loading payment details...</p>
      </div>
    );

  if (customerPayError)
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <p className="text-red-500 text-lg">{customerPayError}</p>
      </div>
    );

  return (
    <div className="font-monsterrat">
      <table className="min-w-full divide-y divide-gray-200 font-montserrat">
        <thead className="bg-gray-100">
          <tr>
            {["Amount", "Reference", "Channel", "Status", "Paid on"].map(
              (heading) => (
                <th
                  key={heading}
                  className="px-6 py-3 text-left text-sm font-extrabold text-gray-700 uppercase tracking-wider border-b"
                >
                  {heading}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {customerPayDetails &&
            customerPayDetails.map((details) => (
              <tr
                key={details.id}
                className="transition-colors duration-200 hover:bg-gray-50 border-b"
              >
                <td className="px-6 py-4 text-gray-800 font-bold text-sm">
                  ₦{(details.amount / 100).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-gray-800 font-bold text-sm">
                  {details.reference}
                </td>
                <td className="px-6 py-4 text-gray-800 font-bold text-sm">
                  {details.channel}
                </td>
                <td className="px-6 py-4 text-gray-800 font-bold text-sm">
                  {renderStatus(details.status)}
                </td>
                <td className="px-6 py-4 text-gray-800 font-bold text-sm">
                  {new Date(details.paidAt).toLocaleString()}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Payment;
