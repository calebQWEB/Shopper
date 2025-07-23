import {
  ArrowRightLeft,
  CircleHelp,
  Heart,
  Home,
  ListOrdered,
  Settings,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import React from "react";

const DashboardMobileMenu = ({
  mobDashboard,
  setMobDashboard,
  activeClick,
}) => {
  const mobDashboardClick = () => {
    setMobDashboard(false);
  };
  return (
    <div
      className={`${
        mobDashboard ? "slide-in-left" : "slide-out-left"
      } bg-primary absolute top-0 right-0 left-0 bottom-0 py-6 z-50`}
    >
      <div className="cursor-pointer px-6 " onClick={mobDashboardClick}>
        <XCircle size={40} />
      </div>
      <ul className="grid gap-4 mt-9">
        <Link href="/">
          <li className="text-3xl font-bold font-montserrat flex items-center justify-start gap-4 border-b border-1 px-6 py-6 cursor-pointer">
            <ArrowRightLeft />
            Home page
          </li>
        </Link>
        <li
          onClick={() => activeClick("Home")}
          className="text-3xl font-bold font-montserrat flex items-center justify-start gap-4 border-b border-1 px-6 py-6 cursor-pointer"
        >
          <Home />
          Home
        </li>
        <li
          onClick={() => activeClick("Orders")}
          className="text-3xl font-bold font-montserrat flex items-center justify-start gap-4 border-b border-1 px-6 py-6 cursor-pointer"
        >
          <ListOrdered />
          Orders
        </li>
        <li
          onClick={() => activeClick("Wishlist")}
          className="text-3xl font-bold font-montserrat flex items-center justify-start gap-4 border-b border-1 px-6 py-6 cursor-pointer"
        >
          <Heart />
          Wishlist
        </li>
        <li
          onClick={() => activeClick("Support")}
          className="text-3xl font-bold font-montserrat flex items-center justify-start gap-4 border-b border-1 px-6 py-6 cursor-pointer"
        >
          <CircleHelp />
          Support
        </li>
        <li
          onClick={() => activeClick("Settings")}
          className="text-3xl font-bold font-montserrat flex items-center justify-start gap-4 border-b border-1 px-6 py-6 cursor-pointer"
        >
          <Settings />
          Settings
        </li>
      </ul>
    </div>
  );
};

export default DashboardMobileMenu;
