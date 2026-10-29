import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { Box, Package, TrendingUp, Users } from "lucide-react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/libs/prisma";
import { formatDate, formatNaira } from "@/libs/format";
import OrderStatus, { orderRef } from "@/components/ui/OrderStatus";
import SalesChart from "./components/SalesChart";
import WeatherChip from "./components/WeatherChip";
import { EmptyState } from "./components/ui";

export const metadata = { title: "Dashboard" };

const DAYS = 30;
const LOW_STOCK = 5;

// Local calendar day, matching the local-midnight boundaries used below
const dayKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const Stat = ({ icon: Icon, label, value, hint }) => (
  <div className="card p-4">
    <div className="flex items-center gap-2 text-sm text-slate-500">
      <Icon size={16} />
      {label}
    </div>
    <p className="mt-2 text-2xl font-bold">{value}</p>
    {hint && <p className="mt-0.5 text-xs text-slate-500">{hint}</p>}
  </div>
);

const page = async () => {
  const session = await getServerSession(authOptions);

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const since = new Date(startOfToday);
  since.setDate(since.getDate() - (DAYS - 1));

  const [allTime, today, customerCount, productCount, lowStock, recentOrders, periodOrders] =
    await Promise.all([
      prisma.order.aggregate({ _sum: { totalPrice: true }, _count: true }),
      prisma.order.aggregate({
        where: { createdAt: { gte: startOfToday } },
        _sum: { totalPrice: true },
        _count: true,
      }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.product.count(),
      prisma.product.findMany({
        where: { quantity: { lte: LOW_STOCK }, status: { not: "draft" } },
        orderBy: { quantity: "asc" },
        take: 5,
        select: { id: true, name: true, quantity: true, imageURL: true },
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { user: { select: { name: true } } },
      }),
      prisma.order.findMany({
        where: { createdAt: { gte: since } },
        select: { createdAt: true, totalPrice: true },
      }),
    ]);

  // One point per day, including days with no sales
  const byDay = new Map();
  for (let i = 0; i < DAYS; i++) {
    const date = new Date(since);
    date.setDate(since.getDate() + i);
    byDay.set(dayKey(date), {
      date: dayKey(date),
      label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      revenue: 0,
      orders: 0,
    });
  }
  for (const order of periodOrders) {
    const day = byDay.get(dayKey(order.createdAt));
    if (day) {
      day.revenue += order.totalPrice;
      day.orders += 1;
    }
  }

  const firstName = session.user.name?.split(" ")[0] ?? "";

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">
            {greeting()}, {firstName}
          </h1>
          <p className="mt-1 text-sm text-slate-500">Here&apos;s how your store is doing.</p>
        </div>
        <WeatherChip />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat icon={TrendingUp} label="Total revenue" value={formatNaira(allTime._sum.totalPrice)} />
        <Stat
          icon={TrendingUp}
          label="Today's revenue"
          value={formatNaira(today._sum.totalPrice)}
          hint={`${today._count} ${today._count === 1 ? "order" : "orders"} today`}
        />
        <Stat icon={Package} label="Orders" value={allTime._count} />
        <Stat icon={Users} label="Customers" value={customerCount} hint={`${productCount} products listed`} />
      </div>

      <SalesChart data={[...byDay.values()]} />

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <section className="card">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <h2 className="font-semibold">Recent orders</h2>
            <Link href="/controlpanel/orders" className="text-sm font-semibold hover:underline">
              View all
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <EmptyState title="No orders yet" description="New orders will appear here as soon as customers pay." />
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentOrders.map((order) => (
                <li key={order.id}>
                  <Link href={`/orders/${order.id}`} className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">
                        {orderRef(order.reference)}{" "}
                        <span className="font-normal text-slate-500">· {order.user?.name ?? order.email}</span>
                      </p>
                      <p className="text-xs text-slate-500">{formatDate(order.createdAt)}</p>
                    </div>
                    <OrderStatus status={order.status} />
                    <span className="w-24 text-right font-semibold">{formatNaira(order.totalPrice)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <h2 className="font-semibold">Low stock</h2>
            <span className="text-xs text-slate-500">{LOW_STOCK} or fewer left</span>
          </div>
          {lowStock.length === 0 ? (
            <EmptyState title="All stocked up" description="No products are running low." />
          ) : (
            <ul className="divide-y divide-slate-100">
              {lowStock.map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/controlpanel/product/edit/${product.id}`}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50"
                  >
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md bg-slate-100">
                      <Image src={product.imageURL} alt="" fill sizes="36px" className="object-cover" />
                    </div>
                    <span className="min-w-0 flex-1 truncate">{product.name}</span>
                    <span className={`font-semibold ${product.quantity === 0 ? "text-rose-600" : "text-amber-600"}`}>
                      {product.quantity} left
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <div className="border-t border-slate-200 px-4 py-3">
            <Link href="/controlpanel/products" className="inline-flex items-center gap-2 text-sm font-semibold hover:underline">
              <Box size={14} />
              Manage products
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default page;
