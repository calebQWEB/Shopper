import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const now = new Date();
  try {
    const activePromos = await prisma.promotion.findMany({
      where: {
        status: "active",
        startDate: { lte: now },
        endDate: { gte: now },
      },
    });

    return NextResponse.json(
      {
        activePromos: activePromos,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Cannot get promos" }, { status: 500 });
  }
}
