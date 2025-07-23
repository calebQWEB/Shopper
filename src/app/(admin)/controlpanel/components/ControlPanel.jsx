"use client";
import {
  BarChart,
  Box,
  Gift,
  ListOrdered,
  LogOut,
  Menu,
  Settings,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import Dashboard from "../subComponents/Dashboard";
import Products from "../subComponents/Products";
import Customers from "../subComponents/Customers";
import Promotions from "../subComponents/Promotions";
import SalesReport from "../subComponents/SalesReport";
import DashboardSettings from "../subComponents/DashboardSettings";
import Orders from "../subComponents/Orders";
import { signOut } from "next-auth/react";

const ControlPanel = () => {
  const [isActive, setIsActive] = useState("Dashboard");
  const [orders, setOrders] = useState(null);
  const [orderLoading, setOrderLoading] = useState(true);
  const [showAside, setShowAside] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setOrderLoading(true);
      try {
        const res = await fetch("/api/allOrders");
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setOrderLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <section>
      <aside
        className={`${
          showAside ? "slide-out-left" : ""
        } lg:hidden lg:w-[20%] h-screen bg-white shadow fixed top-0 left-0 z-30 px-5`}
      >
        <button className="mt-32" onClick={() => setShowAside(true)}>
          <Menu />
        </button>
      </aside>
      <aside
        className={`${
          showAside ? "slide-in-left right-0" : "hidden lg:block"
        } lg:w-[20%] h-screen bg-white shadow fixed top-0 left-0 z-30 px-5 py-24`}
      >
        <ul className="grid gap-8">
          <li
            onClick={() => {
              setShowAside(false);
              setIsActive("Dashboard");
            }}
            className={`${
              isActive === "Dashboard" ? "bg-gray-300 p-2 rounded-lg" : ""
            } flex items-center justify-start gap-4 transition-all duration-300 ease-in-out cursor-pointer w-fit lg:w-full text-2xl lg:text-base font-bold lg:font-normal`}
          >
            <Menu /> Dashboard
          </li>
          <li
            onClick={() => {
              setShowAside(false);
              setIsActive("Orders");
            }}
            className={`${
              isActive === "Orders" ? "bg-gray-300 p-2 rounded-lg" : ""
            } flex items-center justify-start gap-4 transition-all duration-300 ease-in-out cursor-pointer w-fit lg:w-full text-2xl lg:text-base font-bold lg:font-normal`}
          >
            <ListOrdered /> Orders
          </li>
          <li
            onClick={() => {
              setShowAside(false);
              setIsActive("Products");
            }}
            className={`${
              isActive === "Products" ? "bg-gray-300 p-2 rounded-lg" : ""
            } flex items-center justify-start gap-4 transition-all duration-300 ease-in-out cursor-pointer w-fit lg:w-full text-2xl lg:text-base font-bold lg:font-normal`}
          >
            <Box /> Products
          </li>
          <li
            onClick={() => {
              setShowAside(false);
              setIsActive("Customers");
            }}
            className={`${
              isActive === "Customers" ? "bg-gray-300 p-2 rounded-lg" : ""
            } flex items-center justify-start gap-4 transition-all duration-300 ease-in-out cursor-pointer w-fit lg:w-full text-2xl lg:text-base font-bold lg:font-normal`}
          >
            <User /> Customer
          </li>
          <li
            onClick={() => {
              setShowAside(false);
              setIsActive("Promotions");
            }}
            className={`${
              isActive === "Promotions" ? "bg-gray-300 p-2 rounded-lg" : ""
            } flex items-center justify-start gap-4 transition-all duration-300 ease-in-out cursor-pointer w-fit lg:w-full text-2xl lg:text-base font-bold lg:font-normal`}
          >
            <Gift /> Promotions
          </li>
          <li
            onClick={() => {
              setShowAside(false);
              setIsActive("Sales");
            }}
            className={`${
              isActive === "Sales" ? "bg-gray-300 p-2 rounded-lg" : ""
            } flex items-center justify-start gap-4 transition-all duration-300 ease-in-out cursor-pointer w-fit lg:w-full text-2xl lg:text-base font-bold lg:font-normal`}
          >
            <BarChart /> Sales Report
          </li>
          <li
            onClick={() => {
              setShowAside(false);
              setIsActive("Settings");
            }}
            className={`${
              isActive === "Settings" ? "bg-gray-300 p-2 rounded-lg" : ""
            } flex items-center justify-start gap-4 transition-all duration-300 ease-in-out cursor-pointer w-fit lg:w-full text-2xl lg:text-base font-bold lg:font-normal`}
          >
            <Settings /> Settings
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

        <button
          className="absolute top-5 right-5 text-2xl font-bold mt-28 block lg:hidden"
          onClick={() => setShowAside(false)}
        >
          <Menu />
        </button>
      </aside>

      <div className="w-[80%] h-screen ml-[20%] px-2 py-8">
        <div className="w-full h-full rounded-lg">
          {isActive === "Dashboard" && (
            <Dashboard orders={orders} orderLoading={orderLoading} />
          )}
          {isActive === "Orders" && (
            <Orders orders={orders} orderLoading={orderLoading} />
          )}
          {isActive === "Products" && <Products />}
          {isActive === "Customers" && <Customers />}
          {isActive === "Promotions" && <Promotions />}
          {isActive === "Sales" && <SalesReport />}
          {isActive === "Settings" && <DashboardSettings />}
        </div>
      </div>
    </section>
  );
};

export default ControlPanel;
