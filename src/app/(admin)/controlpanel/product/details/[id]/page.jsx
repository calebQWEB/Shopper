import { redirect } from "next/navigation";

// Product details now live on the edit page
const page = async ({ params }) => {
  const { id } = await params;
  redirect(`/controlpanel/product/edit/${id}`);
};

export default page;
