import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, MapPin, Phone } from "lucide-react";
import { prisma } from "@/libs/prisma";
import { getCustomerTransactions } from "@/libs/paystack";
import { formatDate, formatNaira } from "@/libs/format";
import OrderComponent from "@/app/dashboard/SubComponents/OrderComponent";
import CustomerStatusButton from "../../../components/CustomerStatusButton";
import { Avatar, CustomerStatusPill, LevelPill } from "../../../components/customerBadges";
import { EmptyState, Pill } from "../../../components/ui";

export const metadata = { title: "Customer" };

const paymentTone = { success: "green", failed: "red", abandoned: "red", reversed: "red" };

const page = async ({ params }) => {
  const { id } = await params;
  const customerId = Number.parseInt(id, 10);
  if (Number.isNaN(customerId)) notFound();

  const user = await prisma.user.findUnique({
    where: { id: customerId },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      createdAt: true,
      totalSpent: true,
      spendLevel: true,
      status: true,
      role: true,
      customerCode: true,
      addresses: { orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }] },
      orders: {
        orderBy: { createdAt: "desc" },
        include: { items: { select: { id: true, productPicture: true, productQuantity: true } } },
      },
    },
  });
  if (!user) notFound();

  const transactions = await getCustomerTransactions(user.customerCode);

  return (
    <div className="grid gap-6">
      <Link href="/controlpanel/customers" className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-headline">
        <ArrowLeft size={16} />
        Customers
      </Link>

      <section className="card p-4 sm:p-6">
        <div className="flex flex-wrap items-start gap-4">
          <Avatar name={user.name} size="h-14 w-14 text-lg" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold">{user.name}</h1>
              <CustomerStatusPill status={user.status} />
              <LevelPill level={user.spendLevel} />
            </div>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1.5"><Mail size={14} />{user.email}</span>
              {user.phoneNumber && <span className="inline-flex items-center gap-1.5"><Phone size={14} />{user.phoneNumber}</span>}
              <span>Joined {formatDate(user.createdAt)}</span>
            </div>
          </div>
          {user.role === "CUSTOMER" && <CustomerStatusButton customerId={user.id} status={user.status} variant="button" />}
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-200 pt-5 sm:grid-cols-3">
          <div>
            <dt className="text-xs text-slate-500">Orders</dt>
            <dd className="text-lg font-bold">{user.orders.length}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Total spent</dt>
            <dd className="text-lg font-bold">{formatNaira(user.totalSpent)}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Paystack customer code</dt>
            <dd className="truncate font-mono text-sm">{user.customerCode || "—"}</dd>
          </div>
        </dl>
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_320px]">
        <section>
          <h2 className="font-semibold">Orders</h2>
          {user.orders.length ? (
            <div className="mt-3 grid gap-3">
              {user.orders.map((order) => (
                <OrderComponent key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <div className="card mt-3">
              <EmptyState title="No orders yet" />
            </div>
          )}
        </section>

        <section>
          <h2 className="font-semibold">Saved addresses</h2>
          {user.addresses.length ? (
            <ul className="mt-3 grid gap-2">
              {user.addresses.map((address) => (
                <li key={address.id} className="card flex gap-3 p-4 text-sm">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-slate-400" />
                  <div className="flex-1">
                    <p>{address.street}</p>
                    <p className="text-slate-600">
                      {[address.city, address.state, address.postalCode].filter(Boolean).join(", ")}
                    </p>
                    <p className="text-slate-600">{address.country}</p>
                  </div>
                  {address.isDefault && <Pill tone="blue">Default</Pill>}
                </li>
              ))}
            </ul>
          ) : (
            <div className="card mt-3">
              <EmptyState title="No saved addresses" />
            </div>
          )}
        </section>
      </div>

      <section>
        <h2 className="font-semibold">Payments</h2>
        <div className="card mt-3 overflow-x-auto">
          {transactions === null ? (
            <EmptyState
              title={user.customerCode ? "Couldn't load payments" : "No payments yet"}
              description={user.customerCode ? "Paystack didn't respond. Check your Paystack secret key." : "This customer hasn't paid through Paystack yet."}
            />
          ) : transactions.length === 0 ? (
            <EmptyState title="No recent payments" description="Only the 100 most recent store transactions are checked." />
          ) : (
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  {["Amount", "Reference", "Channel", "Status", "Paid on"].map((h) => (
                    <th key={h} scope="col" className="px-4 py-3 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((txn) => (
                  <tr key={txn.id}>
                    <td className="px-4 py-3 font-semibold">{formatNaira(txn.amount / 100)}</td>
                    <td className="px-4 py-3 font-mono text-xs">{txn.reference}</td>
                    <td className="px-4 py-3 capitalize">{txn.channel}</td>
                    <td className="px-4 py-3"><Pill tone={paymentTone[txn.status] ?? "gray"}>{txn.status}</Pill></td>
                    <td className="px-4 py-3 text-slate-600">{txn.paidAt ? formatDate(txn.paidAt) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
};

export default page;
