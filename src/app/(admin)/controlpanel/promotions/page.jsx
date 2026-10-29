import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { prisma } from "@/libs/prisma";
import { formatDate } from "@/libs/format";
import DeleteButton from "../components/DeleteButton";
import PromotionStatusToggle from "../components/PromotionStatusToggle";
import { EmptyState, FilterBar, PageHeader, Pill, SavedNotice, Table } from "../components/ui";

export const metadata = { title: "Promotions" };

const splitIds = (value) => (value ? value.split(",").filter(Boolean) : []);

const appliesTo = (promo) => {
  if (promo.applicableTo === "product") {
    const count = splitIds(promo.productIds).length;
    return `${count} ${count === 1 ? "product" : "products"}`;
  }
  if (promo.applicableTo === "category") {
    return splitIds(promo.categoryIds).join(", ") || "Categories";
  }
  return "All products";
};

// Whether the promotion is running right now, based on its dates and switch
const timing = (promo, now) => {
  if (promo.status !== "active") return { tone: "gray", label: "Off" };
  if (promo.startDate > now) return { tone: "blue", label: "Scheduled" };
  if (promo.endDate < now) return { tone: "gray", label: "Ended" };
  return { tone: "green", label: "Live" };
};

const page = async ({ searchParams }) => {
  const { q = "", status = "", type = "", saved } = await searchParams;
  const query = q.trim();

  const promotions = await prisma.promotion.findMany({
    where: {
      ...(query && {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      }),
      ...(status && { status }),
      ...(type && { type }),
    },
    orderBy: { createdAt: "desc" },
  });

  const now = new Date();
  const filtered = Boolean(query || status || type);

  return (
    <div>
      <PageHeader title="Promotions" description="Discounts shown in the banner at the top of the store.">
        <Link href="/controlpanel/promotions/create" className="btn btn-primary">
          <Plus size={16} />
          New promotion
        </Link>
      </PageHeader>

      {saved && <SavedNotice>{saved === "created" ? "Promotion created." : "Promotion saved."}</SavedNotice>}

      <FilterBar>
        <input name="q" defaultValue={query} placeholder="Search promotions" aria-label="Search promotions" className="input w-full sm:w-60" />
        <select name="status" defaultValue={status} aria-label="Status" className="input w-full sm:w-36">
          <option value="">Any status</option>
          <option value="active">On</option>
          <option value="inactive">Off</option>
        </select>
        <select name="type" defaultValue={type} aria-label="Type" className="input w-full sm:w-40">
          <option value="">Any type</option>
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed amount</option>
        </select>
        {filtered && (
          <Link href="/controlpanel/promotions" className="btn btn-ghost">
            Clear
          </Link>
        )}
      </FilterBar>

      {promotions.length === 0 ? (
        <div className="card mt-4">
          <EmptyState
            title={filtered ? "No promotions match these filters" : "No promotions yet"}
            description={filtered ? "Try a different search." : "Create a promotion to show a discount banner across the store."}
          >
            {!filtered && (
              <Link href="/controlpanel/promotions/create" className="btn btn-primary">
                New promotion
              </Link>
            )}
          </EmptyState>
        </div>
      ) : (
        <Table head={["Promotion", "Discount", "Applies to", "Period", "On", ""]}>
          {promotions.map((promo) => {
            const state = timing(promo, now);
            return (
              <tr key={promo.id} className="hover:bg-slate-50">
                <td className="max-w-xs px-4 py-3">
                  <Link href={`/controlpanel/promotions/edit/${promo.id}`} className="font-semibold hover:underline">
                    {promo.title}
                  </Link>
                  {promo.isSpecial && <span className="ml-2"><Pill tone="amber">Special</Pill></span>}
                  <p className="truncate text-xs text-slate-500">{promo.description}</p>
                </td>
                <td className="px-4 py-3 font-semibold">
                  {promo.type === "percentage" ? `${promo.value}% off` : `₦${promo.value.toLocaleString()} off`}
                </td>
                <td className="px-4 py-3 capitalize text-slate-600">{appliesTo(promo)}</td>
                <td className="px-4 py-3">
                  <Pill tone={state.tone}>{state.label}</Pill>
                  <p className="mt-0.5 whitespace-nowrap text-xs text-slate-500">
                    {formatDate(promo.startDate)} – {formatDate(promo.endDate)}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <PromotionStatusToggle id={promo.id} status={promo.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/controlpanel/promotions/edit/${promo.id}`}
                      aria-label={`Edit ${promo.title}`}
                      title="Edit"
                      className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-headline"
                    >
                      <Pencil size={16} />
                    </Link>
                    <DeleteButton url={`/api/promotion/${promo.id}`} label={promo.title} />
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
