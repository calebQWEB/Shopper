import { prisma } from "@/libs/prisma";
import UserDetailsComponent from "../../Components/UserDetailsComponent";

const page = async ({ params }) => {
  const { id } = await params;
  const intId = Number(id);

  const user = await prisma.user.findUnique({
    where: { id: intId },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      createdAt: true,
      totalSpent: true,
      spendLevel: true,
      status: true,
      orders: true,
      customerCode: true,
    },
  });

  return (
    <section>
      <UserDetailsComponent user={user} />
    </section>
  );
};

export default page;
