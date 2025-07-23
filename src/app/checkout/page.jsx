import CheckoutLayout from "@/components/SubComponents/CheckoutLayout";
import { prisma } from "@/libs/prisma";

const Page = async () => {
  return <CheckoutLayout />;
};

export default Page;
