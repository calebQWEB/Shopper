"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CustomerTable from "./CustomerTable";

const Customers = () => {
  const [customerFetchData, setCustomerFetchData] = useState([]);
  const [customerFetchError, setCustomerFetchError] = useState("");
  const [customerFetchLoad, setCustomerFetchLoad] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const fetchCustomers = async (data = {}) => {
    setCustomerFetchLoad(true);
    try {
      const params = new URLSearchParams();
      if (data.name) params.append("name", data.name);
      if (data.email) params.append("email", data.email);
      if (data.status) params.append("status", data.status);
      if (data.spendRange) params.append("spendRange", data.spendRange);

      const res = await fetch(`/api/customerFilter?${params.toString()}`);
      const fetchedData = await res.json();
      if (fetchedData.length === 0) {
        setCustomerFetchError("No customer to fetch");
      } else {
        setCustomerFetchData(fetchedData);
        setCustomerFetchError("");
      }
      console.log(fetchedData);
    } catch (error) {
      console.error("Failed to fetch");
      setCustomerFetchError("Failed to fetch");
    } finally {
      setCustomerFetchLoad(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-montserrat">
      <div>
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Manage Customers
        </h2>

        <form
          onSubmit={handleSubmit(fetchCustomers)}
          className="flex items-center justify-between flex-wrap gap-4 mb-4"
        >
          {/* Name Filter */}
          <label className="flex flex-col text-sm font-semibold text-gray-700">
            Name
            <input
              {...register("name")}
              type="text"
              placeholder="e.g. John Doe"
              className="w-full border border-gray-300 px-4 py-3 rounded-xl outline-none transition"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit(fetchCustomers);
                }
              }}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </label>

          {/* Email Filter */}
          <label className="flex flex-col text-sm font-semibold text-gray-700">
            Email
            <input
              {...register("email")}
              type="email"
              placeholder="e.g. john@example.com"
              className="w-full border border-gray-300 px-4 py-3 rounded-xl outline-none transition"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </label>

          {/* Status Filter */}
          <label className="flex flex-col text-sm font-semibold text-gray-700">
            Status
            <select
              {...register("status")}
              className="w-full border border-gray-300 px-4 py-3 rounded-xl outline-none transition"
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="banned">Banned</option>
              <option value="unverified">Unverified</option>
            </select>
          </label>

          {/* Sort By Filter */}
          <label className="flex flex-col text-sm font-semibold text-gray-700">
            Spend Range
            <select
              {...register("spendRange")}
              className="w-full border border-gray-300 px-4 py-3 rounded-xl outline-none transition"
            >
              <option value="">Default</option>
              <option value="lowSpend">₦0 - ₦500,000</option>
              <option value="mediumSpend">₦500,000 - ₦5,000,000</option>
              <option value="largeSpend">₦5,000,000 - ₦15,000,000</option>
              <option value="highSpend">₦15,000,000 - ₦30,000,000</option>
            </select>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 rounded-xl text-white flex items-center justify-center font-bold gap-2 hover:scale-105 active:scale-95 transition"
          >
            Apply Filters
          </button>
        </form>
      </div>

      <div className="overflow-x-scroll">
        <CustomerTable
          customerFetchData={customerFetchData}
          customerFetchError={customerFetchError}
          customerFetchLoad={customerFetchLoad}
        />
      </div>
    </div>
  );
};

export default Customers;
