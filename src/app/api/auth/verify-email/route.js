// app/api/auth/verify-email/route.js

import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token is missing" }, { status: 400 });
  }

  // Find the token in the database and include the related user
  const record = await prisma.emailVerificationToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!record || record.expiresAt < new Date()) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 400 }
    );
  }

  // Mark the user's email as verified
  await prisma.user.update({
    where: { id: record.userId },
    data: { emailVerified: new Date() },
  });

  // Optionally, delete the token to prevent reuse
  await prisma.emailVerificationToken.delete({ where: { token } });

  // Redirect to the login page with a query param indicating successful verification
  return NextResponse.redirect(new URL("/login?verified=true", request.url));
}
