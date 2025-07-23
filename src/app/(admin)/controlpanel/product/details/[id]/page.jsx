import { prisma } from "@/libs/prisma";
import { styles } from "@/libs/styles";
import Image from "next/image";

const page = async ({ params }) => {
  const { id } = params;
  const IntId = parseInt(id, 10);
  const mainProduct = await prisma.product.findUnique({
    where: { id: IntId },
  });

  return (
    <section className={`${styles.padding} font-montserrat`}>
      {mainProduct ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Image + Title */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">
              {mainProduct.name}
            </h2>
            <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
              <Image
                src={mainProduct.imageURL}
                alt={mainProduct.name}
                width={500}
                height={500}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white/90 rounded-3xl shadow-md border border-gray-200 p-6 space-y-4">
            {[
              ["Description", mainProduct.description],
              ["Category", mainProduct.cateogory],
              ["Price", `$${mainProduct.price.toFixed(2)}`],
              [
                "Old Price",
                mainProduct.oldPrice
                  ? `$${mainProduct.oldPrice.toFixed(2)}`
                  : "N/A",
              ],
              [
                "Discount",
                mainProduct.discount ? `${mainProduct.discount}%` : "None",
              ],
              ["Tax", mainProduct.tax ? `${mainProduct.tax}%` : "None"],
              ["Quantity", mainProduct.quantity],
              ["SKU", mainProduct.sku || "N/A"],
              [
                "Status",
                mainProduct.quantity > 0 ? "In Stock" : "Out of Stock",
              ],
              [
                "Restock Date",
                mainProduct.restockDate
                  ? new Date(mainProduct.restockDate).toLocaleDateString()
                  : "N/A",
              ],
              ["Visibility", mainProduct.visibility],
              [
                "Published",
                mainProduct.publishedDate
                  ? new Date(mainProduct.publishedDate).toLocaleDateString()
                  : "N/A",
              ],
              ["SEO Title", mainProduct.title || "N/A"],
              ["SEO Description", mainProduct.seoDescription || "N/A"],
              ["Width", mainProduct.width ? `${mainProduct.width} cm` : "N/A"],
              [
                "Height",
                mainProduct.height ? `${mainProduct.height} cm` : "N/A",
              ],
              [
                "Length",
                mainProduct.length ? `${mainProduct.length} cm` : "N/A",
              ],
              [
                "Weight",
                mainProduct.weight ? `${mainProduct.weight} kg` : "N/A",
              ],
              [
                "Tags",
                Array.isArray(mainProduct.tags)
                  ? mainProduct.tags.join(", ")
                  : "N/A",
              ],
            ].map(([label, value]) => (
              <div key={label} className="flex items-start gap-4">
                <span className="min-w-[120px] text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                  {label}
                </span>
                <span className="text-sm text-gray-800 leading-relaxed">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-red-600 font-medium text-center">
          Product not found
        </p>
      )}
    </section>
  );
};

export default page;
