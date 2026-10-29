import { SearchX } from "lucide-react";
import CategoryChips from "@/components/CategoryChips";
import ProductCard from "@/components/ui/ProductCard";
import { prisma } from "@/libs/prisma";

export const metadata = { title: "Search" };

const SearchPage = async ({ searchParams }) => {
  const { q = "" } = await searchParams;
  const query = String(q).trim();

  const products = query
    ? await prisma.product.findMany({
        where: {
          visibility: "active",
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { cateogory: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        orderBy: { salesCount: "desc" },
        take: 48,
      })
    : [];

  return (
    <section className="container-page py-6 sm:py-8">
      <h1 className="text-2xl font-bold sm:text-3xl">
        {query ? <>Results for &ldquo;{query}&rdquo;</> : "Search"}
      </h1>
      {query && (
        <p className="mt-1 text-sm text-slate-500">
          {products.length} {products.length === 1 ? "product" : "products"} found
        </p>
      )}

      {products.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="card mt-6 grid place-items-center gap-2 px-6 py-14 text-center">
          <SearchX size={40} className="text-slate-400" />
          <p className="font-semibold">
            {query ? "No products match your search" : "Type in the search bar to find products"}
          </p>
          <p className="text-sm text-slate-500">Or browse a category:</p>
          <div className="mt-2 w-full max-w-2xl">
            <CategoryChips />
          </div>
        </div>
      )}
    </section>
  );
};

export default SearchPage;
