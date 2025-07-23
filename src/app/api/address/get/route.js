import { getUserDetails } from "@/libs/getUserDetails";
import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getUserDetails();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 400 }
      );
    }

    const address = await prisma.address.findMany({
      where: { userId: user.id },
    });

    return NextResponse.json({ success: true, address }, { status: 200 });
  } catch (error) {
    console.error("Address fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
