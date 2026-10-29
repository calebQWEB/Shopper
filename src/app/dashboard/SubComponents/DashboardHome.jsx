import Link from "next/link";
import { Award, Package, Wallet } from "lucide-react";
import OrderComponent from "./OrderComponent";
import { formatNaira } from "@/libs/format";

// Same thresholds as libs/getSpendLevel.js
const levels = [
  { name: "silver", min: 5000 },
  { name: "gold", min: 15000 },
  { name: "platinum", min: 40000 },
];

const nextLevel = (spent) => levels.find((level) => spent < level.min);

const Stat = ({ icon: Icon, label, value, hint }) => (
  <div className="card p-4">
    <div className="flex items-center gap-2 text-sm text-slate-500">
      <Icon size={16} />
      {label}
    </div>
    <p className="mt-2 text-xl font-bold capitalize">{value}</p>
    {hint && <p className="mt-0.5 text-xs text-slate-500">{hint}</p>}
  </div>
);

const DashboardHome = ({ user, orders, onViewOrders }) => {
  const upcoming = nextLevel(user.totalSpent);

  return (
    <div className="grid gap-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat icon={Package} label="Orders" value={orders.length} />
        <Stat icon={Wallet} label="Total spent" value={formatNaira(user.totalSpent)} />
        <Stat
          icon={Award}
          label="Member level"
          value={user.spendLevel}
          hint={
            upcoming
              ? `${formatNaira(upcoming.min - user.totalSpent)} more to reach ${upcoming.name}`
              : "Top level reached"
          }
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Recent orders</h2>
          {orders.length > 0 && (
            <button type="button" onClick={onViewOrders} className="text-sm font-semibold hover:underline">
              View all
            </button>
          )}
        </div>
        {orders.length > 0 ? (
          <div className="mt-3 grid gap-3">
            {orders.slice(0, 3).map((order) => (
              <OrderComponent key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <div className="card mt-3 grid place-items-center gap-2 px-6 py-10 text-center">
            <p className="font-semibold">No orders yet</p>
            <p className="text-sm text-slate-500">When you place an order, it will show up here.</p>
            <Link href="/#categories" className="btn btn-primary mt-2">
              Start shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
