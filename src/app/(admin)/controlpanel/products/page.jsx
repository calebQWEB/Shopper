import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Pencil, Plus, Star } from "lucide-react";
import { prisma } from "@/libs/prisma";
import { categories } from "@/libs/constants";
import { formatPrice } from "@/libs/format";
import DeleteButton from "../components/DeleteButton";
import { EmptyState, FilterBar, PageHeader, Pill, SavedNotice, Table } from "../components/ui";

export const metadata = { title: "Products" };

const LOW_STOCK = 5;

const statusPill = {
  in_stock: { tone: "green", label: "In stock" },
  out_of_stock: { tone: "red", label: "Out of stock" },
  draft: { tone: "gray", label: "Draft" },
};

const visibilityPill = {
  active: { tone: "blue", label: "Visible" },
  draft: { tone: "gray", label: "Draft" },
  hidden: { tone: "amber", label: "Hidden" },
};

const stockFilters = {
  low: { quantity: { lte: LOW_STOCK } },
  out: { OR: [{ quantity: { lte: 0 } }, { status: "out_of_stock" }] },
};

const page = async ({ searchParams }) => {
  const { q = "", category = "", stock = "", saved } = await searchParams;
  const query = q.trim();

  const products = await prisma.product.findMany({
    where: {
      ...(query && {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { sku: { contains: query, mode: "insensitive" } },
        ],
      }),
      ...(category && { cateogory: { equals: category, mode: "insensitive" } }),
      ...(stockFilters[stock] ?? {}),
    },
    orderBy: { createdAt: "desc" },
  });

  const filtered = Boolean(query || category || stock);

  return (
    <div>
      <PageHeader title="Products" description={`${products.length} ${products.length === 1 ? "product" : "products"}${filtered ? " match your filters" : ""}`}>
        <Link href="/controlpanel/product/create" className="btn btn-primary">
          <Plus size={16} />
          Add product
        </Link>
      </PageHeader>

      {saved && <SavedNotice>{saved === "created" ? "Product created." : "Product saved."}</SavedNotice>}

      <FilterBar>
        <input name="q" defaultValue={query} placeholder="Name or SKU" aria-label="Search products" className="input w-full sm:w-60" />
        <select name="category" defaultValue={category} aria-label="Category" className="input w-full capitalize sm:w-48">
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        <select name="stock" defaultValue={stock} aria-label="Stock" className="input w-full sm:w-40">
          <option value="">Any stock</option>
          <option value="low">Low stock</option>
          <option value="out">Out of stock</option>
        </select>
        {filtered && (
          <Link href="/controlpanel/products" className="btn btn-ghost">
            Clear
          </Link>
        )}
      </FilterBar>

      {products.length === 0 ? (
        <div className="card mt-4">
          <EmptyState
            title={filtered ? "No products match these filters" : "No products yet"}
            description={filtered ? "Try a different search or category." : "Add your first product to start selling."}
          >
            {!filtered && (
              <Link href="/controlpanel/product/create" className="btn btn-primary">
                Add product
              </Link>
            )}
          </EmptyState>
        </div>
      ) : (
        <Table head={["Product", "Category", "Price", "Stock", "Status", ""]}>
          {products.map((product) => {
            const status = statusPill[product.status] ?? statusPill.in_stock;
            const visibility = visibilityPill[product.visibility] ?? visibilityPill.active;
            return (
              <tr key={product.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      <Image src={product.imageURL} alt="" fill sizes="44px" className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <Link href={`/controlpanel/product/edit/${product.id}`} className="flex items-center gap-1.5 font-semibold hover:underline">
                        <span className="truncate">{product.name}</span>
                        {product.isFeatured && <Star size={13} className="shrink-0 fill-accent text-amber-500" aria-label="Featured" />}
                      </Link>
                      <p className="text-xs text-slate-500">{product.sku ? `SKU ${product.sku}` : "No SKU"}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 capitalize">{product.cateogory}</td>
                <td className="px-4 py-3">
                  <span className="font-semibold">{formatPrice(product.price)}</span>
                  {product.oldPrice > product.price && (
                    <span className="ml-1.5 text-xs text-slate-400 line-through">{formatPrice(product.oldPrice)}</span>
                  )}
                </td>
                <td className={`px-4 py-3 font-semibold ${product.quantity <= 0 ? "text-rose-600" : product.quantity <= LOW_STOCK ? "text-amber-600" : ""}`}>
                  {product.quantity}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    <Pill tone={status.tone}>{status.label}</Pill>
                    {product.visibility !== "active" && <Pill tone={visibility.tone}>{visibility.label}</Pill>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/controlpanel/product/edit/${product.id}`}
                      title="Edit"
                      aria-label={`Edit ${product.name}`}
                      className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-headline"
                    >
                      <Pencil size={16} />
                    </Link>
                    <Link
                      href={`/product/${product.id}`}
                      target="_blank"
                      title="View in store"
                      aria-label={`View ${product.name} in store`}
                      className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-headline"
                    >
                      <ExternalLink size={16} />
                    </Link>
                    <DeleteButton url={`/api/product/${product.id}`} label={product.name} />
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
