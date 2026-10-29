import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { prisma } from "@/libs/prisma";
import { formatDate, formatNaira } from "@/libs/format";
import CustomerStatusButton from "../components/CustomerStatusButton";
import { Avatar, CustomerStatusPill, LEVELS, LevelPill } from "../components/customerBadges";
import { EmptyState, FilterBar, PageHeader, Table } from "../components/ui";

export const metadata = { title: "Customers" };

const page = async ({ searchParams }) => {
  const { q = "", status = "", level = "" } = await searchParams;
  const query = q.trim();

  const customers = await prisma.user.findMany({
    where: {
      role: "CUSTOMER",
      ...(query && {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
          { phoneNumber: { contains: query } },
        ],
      }),
      ...(status && { status }),
      ...(level && { spendLevel: level }),
    },
    orderBy: { createdAt: "desc" },
    take: 200,
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      createdAt: true,
      totalSpent: true,
      spendLevel: true,
      status: true,
      _count: { select: { orders: true } },
    },
  });

  const filtered = Boolean(query || status || level);

  return (
    <div>
      <PageHeader
        title="Customers"
        description={`${customers.length} ${customers.length === 1 ? "customer" : "customers"}${filtered ? " match your filters" : ""}`}
      />

      <FilterBar>
        <input name="q" defaultValue={query} placeholder="Name, email or phone" aria-label="Search customers" className="input w-full sm:w-64" />
        <select name="status" defaultValue={status} aria-label="Status" className="input w-full sm:w-36">
          <option value="">Any status</option>
          <option value="active">Active</option>
          <option value="banned">Banned</option>
        </select>
        <select name="level" defaultValue={level} aria-label="Level" className="input w-full capitalize sm:w-36">
          <option value="">Any level</option>
          {LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        {filtered && (
          <Link href="/controlpanel/customers" className="btn btn-ghost">
            Clear
          </Link>
        )}
      </FilterBar>

      {customers.length === 0 ? (
        <div className="card mt-4">
          <EmptyState
            title={filtered ? "No customers match these filters" : "No customers yet"}
            description={filtered ? "Try a different search." : "Customers appear here when they create an account."}
          />
        </div>
      ) : (
        <Table head={["Customer", "Phone", "Orders", "Total spent", "Level", "Status", ""]}>
          {customers.map((customer) => {
            const href = `/controlpanel/customer/details/${customer.id}`;
            return (
              <tr key={customer.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link href={href} className="flex items-center gap-3">
                    <Avatar name={customer.name} />
                    <span className="min-w-0">
                      <span className="block truncate font-semibold hover:underline">{customer.name}</span>
                      <span className="block truncate text-xs text-slate-500">{customer.email}</span>
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-600">{customer.phoneNumber || "—"}</td>
                <td className="px-4 py-3">{customer._count.orders}</td>
                <td className="px-4 py-3 font-semibold">{formatNaira(customer.totalSpent)}</td>
                <td className="px-4 py-3">
                  <LevelPill level={customer.spendLevel} />
                </td>
                <td className="px-4 py-3">
                  <CustomerStatusPill status={customer.status} />
                  <p className="mt-0.5 text-xs text-slate-500">Joined {formatDate(customer.createdAt)}</p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <CustomerStatusButton customerId={customer.id} status={customer.status} />
                    <Link
                      href={href}
                      aria-label={`View ${customer.name}`}
                      className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-headline"
                    >
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </Table>
      )}
    </div>
  );
};

export default page;
