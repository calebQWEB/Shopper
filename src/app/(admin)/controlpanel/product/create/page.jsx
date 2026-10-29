import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProductForm from "../../components/ProductForm";
import { PageHeader } from "../../components/ui";

export const metadata = { title: "Add product" };

const CreateProductPage = () => {
  return (
    <div>
      <Link href="/controlpanel/products" className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-headline">
        <ArrowLeft size={16} />
        Products
      </Link>
      <div className="mt-2 mb-6">
        <PageHeader title="Add product" />
      </div>
      <ProductForm />
    </div>
  );
};

export default CreateProductPage;
