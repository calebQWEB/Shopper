"use client";
import {
  CircleHelp,
  Home,
  ListOrdered,
  LogOut,
  Menu,
  Settings,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import Support from "../SubComponents/Support";
import DashboardHome from "../SubComponents/DashboardHome";
import DashboardSettings from "../SubComponents/DashboardSettings";
import Orders from "@/app/dashboard/SubComponents/Orders";
import DashboardMobileMenu from "./DashboardMobileMenu";
import { signOut } from "next-auth/react";

const DashboardComponent = () => {
  const [active, setActive] = useState("Home");
  const [mobDashboard, setMobDashboard] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  const mobDashboardClick = () => {
    setMobDashboard(true);
  };

  const activeClick = (link) => {
    setActive(link);
    if (mobDashboard) setMobDashboard(false);
  };

  return (
    <>
      {mobDashboard && (
        <DashboardMobileMenu
          mobDashboard={mobDashboard}
          setMobDashboard={setMobDashboard}
          activeClick={activeClick}
        />
      )}
      <div className="grid items-start justify-between gap-12 mt-8 sm:px-16 px-6 sm:py-4 py-2">
        {!mobDashboard && (
          <div
            className="block lg:hidden sticky top-16 bg-white shadow-sm z-40"
            onClick={mobDashboardClick}
          >
            <Menu size={30} />
          </div>
        )}
        <aside className="hidden lg:block fixed">
          <ul className="grid gap-8">
            <li
              className={`${
                active === "Home" ? "bg-gray-300 p-2 rounded-lg w-48" : ""
              } flex items-center justify-start gap-4 transition-all duration-300 ease-in-out`}
              onClick={() => activeClick("Home")}
            >
              <Home /> Home
            </li>
            <li
              className={`${
                active === "Orders" ? "bg-gray-300 p-2 rounded-lg w-48" : ""
              } flex items-center justify-start gap-4 transition-all duration-300 ease-in-out`}
              onClick={() => activeClick("Orders")}
            >
              <ListOrdered /> Orders
            </li>

            <li
              className={`${
                active === "Settings" ? "bg-gray-300 p-2 rounded-lg w-48" : ""
              } flex items-center justify-start gap-4 transition-all duration-300 ease-in-out`}
              onClick={() => activeClick("Settings")}
            >
              <Settings /> Settings
            </li>
            <li
              className={`${
                active === "Support" ? "bg-gray-300 p-2 rounded-lg w-48" : ""
              } flex items-center justify-start gap-4 transition-all duration-300 ease-in-out`}
              onClick={() => activeClick("Support")}
            >
              <CircleHelp /> Support
            </li>
          </ul>

          <div className="flex items-center justify-start gap-4 mt-36 text-red-700 cursor-pointer">
            <LogOut />
            <button
              onClick={() => {
                signOut({ callbackUrl: "/login" });
              }}
            >
              Logout
            </button>
          </div>
        </aside>

        <div className="min-h-screen min-w-full bg-white shadow-gray-400 shadow-2xl p-3 md:p-6 lg:ml-64">
          {active === "Home" && <DashboardHome />}
          {active === "Orders" && <Orders orders={orders} loading={loading} />}
          {active === "Settings" && (
            <DashboardSettings orders={orders} loading={loading} />
          )}
          {active === "Support" && <Support />}
        </div>
      </div>
    </>
  );
};

export default DashboardComponent;
