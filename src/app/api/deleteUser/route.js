import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/libs/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

// Deletes the signed-in user's own account. The id is taken from the session,
// never from the request body, so nobody can delete someone else's account.
export async function DELETE() {
  const session = await getServerSession(authOptions);
  const userID = Number(session?.user?.id);

  if (!userID) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const orderCount = await prisma.order.count({ where: { userId: userID } });
    if (orderCount > 0) {
      return NextResponse.json(
        {
          message:
            "Accounts with order history can't be deleted here. Please contact support.",
        },
        { status: 409 }
      );
    }

    // Delete all related email verification tokens
    await prisma.emailVerificationToken.deleteMany({
      where: { userId: userID },
    });

    // Delete the user (saved addresses are removed by cascade)
    await prisma.user.delete({
      where: { id: userID },
    });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
