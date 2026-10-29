import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/libs/prisma";
import PromotionForm from "../../../components/PromotionForm";
import { PageHeader } from "../../../components/ui";

export const metadata = { title: "Edit promotion" };

const EditPromotionPage = async ({ params }) => {
  const { id } = await params;

  const [promotion, products] = await Promise.all([
    prisma.promotion.findUnique({ where: { id } }),
    prisma.product.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);
  if (!promotion) notFound();

  return (
    <div className="max-w-3xl">
      <Link href="/controlpanel/promotions" className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-headline">
        <ArrowLeft size={16} />
        Promotions
      </Link>
      <div className="mt-2 mb-6">
        <PageHeader title={promotion.title} description="Edit promotion" />
      </div>
      <PromotionForm promotion={promotion} products={products} />
    </div>
  );
};

export default EditPromotionPage;
