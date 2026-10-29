import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { prisma } from "@/libs/prisma";
import ProductForm from "../../../components/ProductForm";
import { PageHeader } from "../../../components/ui";

export const metadata = { title: "Edit product" };

const EditProductPage = async ({ params }) => {
  const { id } = await params;
  const productId = Number.parseInt(id, 10);
  if (Number.isNaN(productId)) notFound();

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) notFound();

  return (
    <div>
      <Link href="/controlpanel/products" className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-headline">
        <ArrowLeft size={16} />
        Products
      </Link>
      <div className="mt-2 mb-6">
        <PageHeader title={product.name} description={`Product #${product.id}`}>
          <Link href={`/product/${product.id}`} target="_blank" className="btn btn-outline">
            <ExternalLink size={16} />
            View in store
          </Link>
        </PageHeader>
      </div>
      <ProductForm product={product} />
    </div>
  );
};

export default EditProductPage;
