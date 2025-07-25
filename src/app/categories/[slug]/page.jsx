import ItemAddedToCart from "@/components/ui/ItemAddedToCart";
import ProductCard from "@/components/ui/ProductCard";
import { prisma } from "@/libs/prisma";
import { styles } from "@/libs/styles";

const Page = async ({ params }) => {
  const { slug } = params;
  const decodedSlug = decodeURIComponent(slug);

  const products = await prisma.product.findMany({
    where: { cateogory: decodedSlug },
  });

  return (
    <section className={`${styles.padding} relative mt-32 main-bg`}>
      {<ItemAddedToCart /> || ""}
      <h1
        className={`${styles.sectionHeadText} font-montserrat font-black text-center md:text-start`}
      >
        {decodedSlug} for you
      </h1>
      {products.length > 0 ? (
        <div className="flex flex-wrap items-center justify-evenly gap-10 mt-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p>No products to show</p>
      )}
    </section>
  );
};

export default Page;
