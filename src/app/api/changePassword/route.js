import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { compare, hash } from "bcryptjs";

export async function PATCH(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json("Unauthorized", { status: 401 });
  }

  const { Current_Password, New_Password, Confirm_Password } = await req.json();
  if (New_Password !== Confirm_Password) {
    return NextResponse.json(
      { message: "Passwords do not match" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  const isValid = await compare(Current_Password, user.password);

  if (!isValid) {
    return NextResponse.json({ message: "Invalid Password" }, { status: 400 });
  }

  const hashedPassword = await hash(New_Password, 10);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashedPassword },
  });

  return NextResponse.json(
    { message: "Password changed successfully" },
    { status: 200 }
  );
}
