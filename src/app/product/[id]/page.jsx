import { cache } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PackageSearch, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import ProductCard from "@/components/ui/ProductCard";
import { prisma } from "@/libs/prisma";
import { formatPrice, getDiscount } from "@/libs/format";
import AddToCartButton from "../subComponents/AddToCartButton";

// cache() lets generateMetadata and the page share one query per request
const getProduct = cache(async (id) => {
  const productId = Number.parseInt(id, 10);
  if (Number.isNaN(productId)) return null;
  return prisma.product.findUnique({ where: { id: productId } });
});

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Product not found" };
  return {
    title: product.title || product.name,
    description: product.seoDescription || product.description.slice(0, 160),
  };
}

const stockLabels = {
  in_stock: { text: "In stock", className: "bg-emerald-50 text-emerald-700" },
  out_of_stock: { text: "Out of stock", className: "bg-rose-50 text-rose-700" },
  draft: { text: "Coming soon", className: "bg-slate-100 text-slate-600" },
};

const page = async ({ params }) => {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const relatedProducts = await prisma.product.findMany({
    where: {
      cateogory: product.cateogory,
      visibility: "active",
      id: { not: product.id },
    },
    take: 4,
  });

  const discount = getDiscount(product);
  const stock = stockLabels[product.status] ?? stockLabels.in_stock;
  const canBuy = product.status === "in_stock";
  const categoryHref = `/categories/${encodeURIComponent(product.cateogory)}`;

  return (
    <section className="container-page py-6 sm:py-8">
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500">
        <Link href="/" className="hover:text-headline">
          Home
        </Link>
        <span className="mx-1.5">/</span>
        <Link href={categoryHref} className="capitalize hover:text-headline">
          {product.cateogory}
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-headline">{product.name}</span>
      </nav>

      <div className="mt-4 grid gap-6 md:grid-cols-2 lg:gap-10">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <Image
            src={product.imageURL}
            alt={product.name}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
          {discount > 0 && (
            <span className="absolute left-3 top-3 rounded-md bg-accent px-2.5 py-1 text-sm font-bold">
              -{discount}%
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <Link
            href={categoryHref}
            className="self-start rounded-full bg-secondary px-3 py-1 text-xs font-semibold capitalize"
          >
            {product.cateogory}
          </Link>
          <h1 className="mt-3 text-2xl font-bold sm:text-3xl">{product.name}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-2xl font-bold sm:text-3xl">
              {formatPrice(product.price)}
            </span>
            {discount > 0 && (
              <>
                <span className="text-slate-400 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
                <span className="text-sm font-semibold text-emerald-700">
                  You save {formatPrice(product.oldPrice - product.price)}
                </span>
              </>
            )}
          </div>

          <span
            className={`mt-3 self-start rounded-full px-2.5 py-1 text-xs font-semibold ${stock.className}`}
          >
            {stock.text}
          </span>

          <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-slate-600 sm:text-base">
            {product.description}
          </p>

          <div className="mt-6 flex gap-2">
            <Button
              mainProduct={product}
              disabled={!canBuy}
              className="btn btn-primary flex-1 py-3 sm:flex-none sm:px-8"
            />
            <AddToCartButton
              mainProduct={product}
              disabled={!canBuy}
              label="Add to cart"
              className="flex-1 py-3 sm:flex-none"
            />
          </div>

          <ul className="mt-6 grid gap-2 border-t border-slate-200 pt-5 text-sm text-slate-600">
            <li className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-600" />
              Secure checkout with Paystack
            </li>
            <li className="flex items-center gap-2">
              <PackageSearch size={16} className="text-headline" />
              Track your order from your account
            </li>
          </ul>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-14">
          <h2 className="section-title">You might also like</h2>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default page;
