import { redirect } from "next/navigation";

// Promotion details now live on the edit page
const page = async ({ params }) => {
  const { id } = await params;
  redirect(`/controlpanel/promotions/edit/${id}`);
};

export default page;
