import { prisma } from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function PATCH(req) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { First_Name, Email, Phone } = body;

    if (!Email || !First_Name || !Phone) {
      return NextResponse.json(
        { status: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: First_Name,
        phoneNumber: Phone,
        email: Email,
      },
    });

    return NextResponse.json(
      { status: true, message: "User updated successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in webhook:", err);
    return NextResponse.json(
      { status: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
