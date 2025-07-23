"use client";
import { Medal, Trophy, User } from "lucide-react";
import React, { useState } from "react";
import Orders from "../subComponents/Orders";
import Payment from "../subComponents/Payment";
import Address from "../subComponents/Address";
import Account from "../subComponents/Account";

const UserDetailsComponent = ({ user }) => {
  const [activeTab, setActiveTab] = useState("Orders");
  const Tabs = ["Orders", "Payment", "Address", "Account"];

  const renderStatus = (st) => {
    switch (st) {
      case "active":
        return (
          <span className="text-black font-bold text-sm bg-green-600 px-2 py-1 rounded-2xl">
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
        return <Trophy className="text-gray-500" size={60} />;
      case "gold":
        return <Medal className="text-yellow-500" size={60} />;
      case "silver":
        return <Medal className="text-gray-300" size={60} />;
      default:
        return <Medal className="text-orange-700" size={60} />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-start justify-start gap-6">
      <aside className="lg:w-[30%] w-full font-montserrat bg-gray-300 rounded-2xl shadow-xl text-start space-y-6 border border-gray-400 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <User size={60} />
            <div>
              <p className="text-xl md:text-2xl font-bold">{user.name}</p>
              <span className="italic text-blue-500 text-xs md:text-sm font-bold">
                {user.email}
              </span>
            </div>
          </div>
          <div>{renderLevel(user.spendLevel)}</div>
        </div>

        <ul className="grid gap-4 mt-8 text-sm md:text-base font-semibold">
          <li>{user.phoneNumber}</li>
          <li>{renderStatus(user.status)}</li>
          <li>{new Date(user.createdAt).toLocaleString()}</li>
          <li>${user.totalSpent.toLocaleString()}</li>
        </ul>
      </aside>

      <div className="flex-1 w-full h-full px-2 py-8">
        <div className="flex gap-6 border-b mb-4">
          {Tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-3 font-semibold border-b-2 transition ${
                activeTab === tab
                  ? "border-[#ebb26c] text-[#ebb26c]"
                  : "border-transparent text-gray-500 hover:text-[#ebb26c]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Orders" && <Orders orders={user.orders} />}
        {activeTab === "Payment" && (
          <Payment customerCode={user.customerCode} />
        )}
        {activeTab === "Address" && <Address />}
        {activeTab === "Account" && <Account user={user} />}
      </div>
    </div>
  );
};

export default UserDetailsComponent;
