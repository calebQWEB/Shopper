"use client";
import OrderComponent from "@/app/dashboard/SubComponents/OrderComponent";
import { ChevronDown } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const Orders = ({ orders }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [filterQuery, setFilterQuery] = useState("Reference");
  const [filterValue, setFilterValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [searchedOrders, setSearchedOrders] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (orders) {
      setSearchedOrders(orders.orders);
    }
  }, [orders]);

  const getQueryKey = () => {
    switch (filterQuery) {
      case "Reference":
        return "reference";
      case "Order Date":
        return "date";
      case "Customer Email":
        return "email";
      case "Customer Name":
        return "name";
      case "City":
        return "city";
      case "Country":
        return "country";
      case "User ID":
        return "userId";
      case "Status":
        return "status";
      default:
        return "";
    }
  };

  const handleSearch = async () => {
    try {
      const queryKey = getQueryKey();
      const res = await fetch(`/api/search?${queryKey}=${filterValue}`);
      const data = await res.json();

      if (!filterValue) {
        setSearchedOrders(orders.orders);
      }

      if (!data || data.length === 0) {
        setErrorMessage(
          `No ${filterQuery?.toLowerCase()} found with "${filterValue}"`
        );
        setSearchedOrders([]);
      } else {
        setErrorMessage("");
        setShowFilter(false);
        console.log(data);
        setSearchedOrders(data);
      }
    } catch (error) {
      console.error("Error during search:", error);
      setErrorMessage("An error occurred while searching. Please try again.");
    }
  };

  return (
    <section>
      <form className="flex items-center justify-center lg:items-end lg:justify-end">
        <div className="flex items-center justify-end gap-3 relative">
          <div
            className="flex items-center justify-end gap-3 relative"
            ref={dropdownRef}
          >
            <label className="relative">
              {errorMessage && (
                <p className="absolute bottom-full mb-2 text-red-700 text-sm mt-2 w-fit bg-yellow-100 p-2 rounded-lg border border-yellow-300">
                  {errorMessage}
                </p>
              )}
              <input
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
                onChange={(e) => setFilterValue(e.target.value)}
                value={filterValue}
                type="text"
                placeholder={filterQuery || "Filter by..."}
                className="text-sm md:text-base border border-gray-300 bg-gray-50 text-gray-900 rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all placeholder:text-sm md:placeholder:text-base"
              />
            </label>
            <div
              className={`${
                showFilter ? "" : "-rotate-180"
              } cursor-pointer transition-all ease-in-out`}
              onClick={() => setShowFilter((prev) => !prev)}
            >
              <ChevronDown />
            </div>

            {showFilter && (
              <ul className="mt-3 shadow-sm py-5 grid items-start justify-start gap-2 rounded-lg w-full absolute top-full right-0 z-30 border border-gray-300 bg-gray-50">
                <li
                  className="font-montserrat text-sm md:text-base font-medium cursor-pointer hover:bg-gray-400 px-2 py-1"
                  onClick={() => {
                    setShowFilter(false);
                    setFilterValue("");
                    setFilterQuery("Reference");
                  }}
                >
                  Reference
                </li>
                <li
                  className="font-montserrat text-sm md:text-base font-medium cursor-pointer hover:bg-gray-400 px-2 py-1"
                  onClick={() => {
                    setShowFilter(false);
                    setFilterValue("");
                    setFilterQuery("Order Date");
                  }}
                >
                  Order Date
                </li>
                <li
                  className="font-montserrat text-sm md:text-base font-medium cursor-pointer hover:bg-gray-400 px-2 py-1"
                  onClick={() => {
                    setShowFilter(false);
                    setFilterValue("");
                    setFilterQuery("Customer Email");
                  }}
                >
                  Customer Email
                </li>
                {/*<li
                  className="font-montserrat text-sm md:text-base font-medium cursor-pointer hover:bg-gray-400 px-2 py-1"
                  onClick={() => {
                    setShowFilter(false);
                    setFilterValue("");
                    setFilterQuery("Customer Name");
                  }}
                >
                  Customer Name
                </li>*/}
                <li
                  className="font-montserrat text-sm md:text-base font-medium cursor-pointer hover:bg-gray-400 px-2 py-1"
                  onClick={() => {
                    setShowFilter(false);
                    setFilterValue("");
                    setFilterQuery("City");
                  }}
                >
                  City
                </li>
                <li
                  className="font-montserrat text-sm md:text-base font-medium cursor-pointer hover:bg-gray-400 px-2 py-1"
                  onClick={() => {
                    setShowFilter(false);
                    setFilterValue("");
                    setFilterQuery("Country");
                  }}
                >
                  Country
                </li>
                <li
                  className="font-montserrat text-sm md:text-base font-medium cursor-pointer hover:bg-gray-400 px-2 py-1"
                  onClick={() => {
                    setShowFilter(false);
                    setFilterValue("");
                    setFilterQuery("User ID");
                  }}
                >
                  User ID
                </li>
                <li
                  className="font-montserrat text-sm md:text-base font-medium cursor-pointer hover:bg-gray-400 px-2 py-1"
                  onClick={() => {
                    setShowFilter(false);
                    setFilterValue("");
                    setFilterQuery("Status");
                  }}
                >
                  Status
                </li>
              </ul>
            )}
          </div>
        </div>
      </form>
      <div className="my-6 text-center lg:text-start">
        <h2 className="font-montserrat text-lg md:text-2xl font-bold">
          Orders
        </h2>
        <p className="font-montserrat text-sm md:text-base">
          Monitor your orders
        </p>
      </div>

      <div className="space-y-6">
        {searchedOrders.map((order) => (
          <OrderComponent key={order.id} order={order} />
        ))}
      </div>
    </section>
  );
};

export default Orders;
