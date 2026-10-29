"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { CircleHelp, LayoutGrid, LogOut, Package, Settings } from "lucide-react";
import DashboardHome from "../SubComponents/DashboardHome";
import Orders from "../SubComponents/Orders";
import DashboardSettings from "../SubComponents/DashboardSettings";
import Support from "../SubComponents/Support";
import { formatDate } from "@/libs/format";

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "orders", label: "Orders", icon: Package },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "support", label: "Support", icon: CircleHelp },
];

const DashboardComponent = ({ user, orders, initialTab }) => {
  const [active, setActive] = useState(
    tabs.some((tab) => tab.id === initialTab) ? initialTab : "overview"
  );

  // Keep the tab in the URL so it survives a refresh and can be linked to
  const selectTab = (id) => {
    setActive(id);
    window.history.replaceState(null, "", id === "overview" ? "/dashboard" : `/dashboard?tab=${id}`);
  };

  const firstName = user.name.split(" ")[0];

  return (
    <section className="container-page py-6 sm:py-8">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Hi, {firstName}</h1>
        <p className="mt-1 text-sm text-slate-500">
          Member since {formatDate(user.createdAt)}
        </p>
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[220px_1fr]">
        <nav aria-label="Account" className="-mx-4 overflow-x-auto px-4 lg:sticky lg:top-28 lg:mx-0 lg:overflow-visible lg:px-0">
          <ul className="flex gap-1 lg:flex-col">
            {tabs.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => selectTab(id)}
                  aria-current={active === id ? "page" : undefined}
                  className={`flex w-full items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    active === id
                      ? "bg-headline text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-headline"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              </li>
            ))}
            <li className="lg:mt-4 lg:border-t lg:border-slate-200 lg:pt-4">
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex w-full items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </li>
          </ul>
        </nav>

        <div className="min-w-0">
          {active === "overview" && (
            <DashboardHome user={user} orders={orders} onViewOrders={() => selectTab("orders")} />
          )}
          {active === "orders" && <Orders orders={orders} />}
          {active === "settings" && <DashboardSettings user={user} />}
          {active === "support" && <Support />}
        </div>
      </div>
    </section>
  );
};

export default DashboardComponent;
