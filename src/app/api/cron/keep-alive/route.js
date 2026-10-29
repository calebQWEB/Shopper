import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

// Called daily by Vercel Cron (see vercel.json) so the Supabase free-tier
// project sees activity and isn't paused after 7 days of inactivity.
export const dynamic = "force-dynamic";

export async function GET(request) {
  // Vercel sends "Authorization: Bearer <CRON_SECRET>" when CRON_SECRET is set
  const authHeader = request.headers.get("authorization");
  if (
    !process.env.CRON_SECRET ||
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const users = await prisma.user.count();

    return NextResponse.json(
      { ok: true, users, checkedAt: new Date().toISOString() },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Database ping failed" }, { status: 500 });
  }
}
