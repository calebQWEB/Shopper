import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function DELETE(req) {
  try {
    const body = await req.json();
    const userID = Number(body.id);

    const user = await prisma.user.findUnique({
      where: { id: userID },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Delete all related email verification tokens
    await prisma.emailVerificationToken.deleteMany({
      where: { userId: userID },
    });

    // Delete the user
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
