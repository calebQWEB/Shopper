import Link from "next/link";
import { prisma } from "@/libs/prisma";
import { formatDate, formatNaira } from "@/libs/format";
import { ORDER_STATUSES, orderRef } from "@/components/ui/OrderStatus";
import OrderStatusSelect from "../components/OrderStatusSelect";
import { EmptyState, FilterBar, PageHeader, Table } from "../components/ui";

export const metadata = { title: "Orders" };

const page = async ({ searchParams }) => {
  const { q = "", status = "" } = await searchParams;
  const query = q.trim();

  const orders = await prisma.order.findMany({
    where: {
      ...(query && {
        OR: [
          { reference: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
          { user: { name: { contains: query, mode: "insensitive" } } },
        ],
      }),
      ...(status && { status: { equals: status, mode: "insensitive" } }),
    },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      user: { select: { id: true, name: true } },
      items: { select: { productQuantity: true } },
    },
  });

  const filtered = Boolean(query || status);

  return (
    <div>
      <PageHeader title="Orders" description="Track payments and update delivery status." />

      <FilterBar>
        <input
          name="q"
          defaultValue={query}
          placeholder="Reference, customer or email"
          aria-label="Search orders"
          className="input w-full sm:w-72"
        />
        <select name="status" defaultValue={status} aria-label="Status" className="input w-full sm:w-44">
          <option value="">All statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {filtered && (
          <Link href="/controlpanel/orders" className="btn btn-ghost">
            Clear
          </Link>
        )}
      </FilterBar>

      {orders.length === 0 ? (
        <div className="card mt-4">
          <EmptyState
            title={filtered ? "No orders match these filters" : "No orders yet"}
            description={filtered ? "Try a different search or status." : "Orders appear here once Paystack confirms a payment."}
          />
        </div>
      ) : (
        <Table head={["Order", "Customer", "Items", "Total", "Status"]}>
          {orders.map((order) => {
            const itemCount = order.items.reduce((sum, item) => sum + item.productQuantity, 0);
            return (
              <tr key={order.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link href={`/orders/${order.id}`} className="font-semibold hover:underline">
                    {orderRef(order.reference)}
                  </Link>
                  <p className="text-xs text-slate-500">{formatDate(order.createdAt)}</p>
                </td>
                <td className="px-4 py-3">
                  {order.user ? (
                    <Link href={`/controlpanel/customer/details/${order.user.id}`} className="font-medium hover:underline">
                      {order.user.name}
                    </Link>
                  ) : (
                    <span className="text-slate-500">Deleted account</span>
                  )}
                  <p className="text-xs text-slate-500">{order.email}</p>
                </td>
                <td className="px-4 py-3">{itemCount}</td>
                <td className="px-4 py-3 font-semibold">{formatNaira(order.totalPrice)}</td>
                <td className="px-4 py-3">
                  <OrderStatusSelect orderId={order.id} status={order.status} />
                </td>
              </tr>
            );
          })}
        </Table>
      )}
      {orders.length === 100 && (
        <p className="mt-3 text-xs text-slate-500">Showing the 100 most recent matches. Narrow your search to see older orders.</p>
      )}
    </div>
  );
};

export default page;
