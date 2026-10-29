import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/libs/prisma";
import PromotionForm from "../../components/PromotionForm";
import { PageHeader } from "../../components/ui";

export const metadata = { title: "New promotion" };

const CreatePromotionPage = async () => {
  const products = await prisma.product.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-3xl">
      <Link href="/controlpanel/promotions" className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-headline">
        <ArrowLeft size={16} />
        Promotions
      </Link>
      <div className="mt-2 mb-6">
        <PageHeader title="New promotion" />
      </div>
      <PromotionForm products={products} />
    </div>
  );
};

export default CreatePromotionPage;
