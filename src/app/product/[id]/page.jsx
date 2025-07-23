import Button from "@/components/ui/Button";
import { prisma } from "@/libs/prisma";
import { styles } from "@/libs/styles";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "../subComponents/AddToCartButton";
import ItemAddedToCart from "@/components/ui/ItemAddedToCart";

const page = async ({ params }) => {
  const { id } = params;
  const IntId = parseInt(id, 10);
  const mainProduct = await prisma.product.findUnique({
    where: { id: IntId },
  });

  const relatedProduct = await prisma.product.findMany({
    where: {
      cateogory: mainProduct.cateogory,
      id: { not: IntId },
    },
    take: 4,
  });

  return (
    <section className={`${styles.padding}`}>
      {<ItemAddedToCart /> || ""}
      {mainProduct ? (
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <Image
            src={mainProduct.imageURL}
            alt={mainProduct.name}
            width={450}
            height={450}
            className="rounded-xl"
          />

          <div className="flex flex-col gap-7 text-center md:text-start">
            <h2
              className={`${styles.sectionHeadText} font-montserrat font-black text-headline`}
            >
              {mainProduct.name}
            </h2>
            <p className="font-montserrat text-xl text-subHeadline">
              {mainProduct.description}
            </p>
            <p className="mt-12 font-montserrat font-semibold text-2xl text-subHeadline">
              ${mainProduct.price}
            </p>
            <div className="flex items-center gap-1 justify-center md:justify-start">
              <Button
                mainProduct={mainProduct}
                styles="bg-primary text-white font-bold text-lg px-6 py-3 rounded-lg shadow-md hover:bg-primary-dark transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
              />
              <AddToCartButton mainProduct={mainProduct} />
            </div>
          </div>
        </div>
      ) : (
        <p>Product not found</p>
      )}

      {relatedProduct.length > 0 && (
        <div className="mt-24">
          <h2 className={`${styles.sectionHeadText} font-montserrat`}>
            You might also like
          </h2>
          <div className="flex flex-wrap gap-6 md:gap-2">
            {relatedProduct.map((product) => (
              <div key={product.id} className="w-[300px] md:w-[200px]">
                <Link
                  href={`/product/${product.id}`}
                  className="block relative w-full h-[200px] md:h-[200px]"
                >
                  <Image
                    src={product.imageURL}
                    alt={product.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </Link>
                <div className="flex md:grid items-center justify-start gap-2 mt-4">
                  <p className="font-zen-dots">{product.name}</p>
                  <p>${product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default page;
