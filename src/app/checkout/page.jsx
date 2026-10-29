import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CheckoutLayout from "@/components/SubComponents/CheckoutLayout";
import { prisma } from "@/libs/prisma";

export const metadata = { title: "Checkout" };

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/checkout");
  }

  const savedAddresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      street: true,
      city: true,
      state: true,
      postalCode: true,
      country: true,
      isDefault: true,
    },
  });

  const user = {
    id: session.user.id,
    name: session.user.name ?? "",
    email: session.user.email ?? "",
    phoneNumber: session.user.phoneNumber ?? "",
  };

  return <CheckoutLayout user={user} savedAddresses={savedAddresses} />;
};

export default Page;
