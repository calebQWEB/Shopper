import { getUserDetails } from "@/libs/getUserDetails";
import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getUserDetails();
  if (!user || !user.id) {
    return NextResponse.json(
      { success: false, error: "User not found" },
      { status: 400 }
    );
  }
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });
  if (!dbUser) {
    return NextResponse.json(
      { success: false, error: "User not found" },
      { status: 400 }
    );
  }
  return NextResponse.json({ success: true, user: dbUser }, { status: 200 });
}
