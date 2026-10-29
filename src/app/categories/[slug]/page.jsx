import Link from "next/link";
import { PackageOpen } from "lucide-react";
import CategoryChips from "@/components/CategoryChips";
import ProductCard from "@/components/ui/ProductCard";
import { prisma } from "@/libs/prisma";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const name = decodeURIComponent(slug);
  return { title: name.charAt(0).toUpperCase() + name.slice(1) };
}

const Page = async ({ params }) => {
  const { slug } = await params;
  const category = decodeURIComponent(slug);

  const products = await prisma.product.findMany({
    where: {
      cateogory: { equals: category, mode: "insensitive" },
      visibility: "active",
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="container-page py-6 sm:py-8">
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500">
        <Link href="/" className="hover:text-headline">
          Home
        </Link>
        <span className="mx-1.5">/</span>
        <span className="capitalize text-headline">{category}</span>
      </nav>

      <div className="mt-2 flex flex-wrap items-end justify-between gap-2">
        <h1 className="text-2xl font-bold capitalize sm:text-3xl">{category}</h1>
        <p className="text-sm text-slate-500">
          {products.length} {products.length === 1 ? "product" : "products"}
        </p>
      </div>

      <div className="mt-4">
        <CategoryChips active={category} />
      </div>

      {products.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="card mt-6 grid place-items-center gap-2 px-6 py-16 text-center">
          <PackageOpen size={40} className="text-slate-400" />
          <p className="font-semibold">No products here yet</p>
          <p className="text-sm text-slate-500">
            Check back soon, or browse another category above.
          </p>
        </div>
      )}
    </section>
  );
};

export default Page;
