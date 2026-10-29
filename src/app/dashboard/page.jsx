import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/libs/prisma";
import DashboardComponent from "./Components/DashboardComponent";

export const metadata = { title: "My account" };

const page = async ({ searchParams }) => {
  const session = await getServerSession(authOptions);
  const { tab } = await searchParams;

  const [user, orders] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        email: true,
        phoneNumber: true,
        createdAt: true,
        totalSpent: true,
        spendLevel: true,
      },
    }),
    prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        reference: true,
        status: true,
        totalPrice: true,
        createdAt: true,
        shippingAddress: true,
        items: {
          select: {
            id: true,
            productName: true,
            productPicture: true,
            productQuantity: true,
          },
        },
      },
    }),
  ]);

  // The session can outlive a deleted account
  if (!user) redirect("/login");

  return <DashboardComponent user={user} orders={orders} initialTab={tab} />;
};

export default page;
