import { prisma } from "@/libs/prisma";
import ProductCard from "./ui/ProductCard";

// Featured or discounted products, falling back to the newest arrivals
const FeaturedProducts = async () => {
  let title = "Featured deals";
  let products = await prisma.product.findMany({
    where: {
      visibility: "active",
      OR: [{ isFeatured: true }, { oldPrice: { not: null } }],
    },
    orderBy: { updatedAt: "desc" },
    take: 8,
  });

  if (products.length === 0) {
    title = "New arrivals";
    products = await prisma.product.findMany({
      where: { visibility: "active" },
      orderBy: { createdAt: "desc" },
      take: 8,
    });
  }

  if (products.length === 0) return null;

  return (
    <section id="deals" className="container-page scroll-mt-28 pt-12 sm:pt-16">
      <h2 className="section-title">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">
        Hand-picked products at great prices.
      </p>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
