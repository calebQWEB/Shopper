import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  const { id } = await context.params;

  try {
    const promotion = await prisma.promotion.findUnique({
      where: { id: id },
    });

    if (!promotion) {
      return NextResponse.json(
        { error: "Promotion not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(promotion, { status: 200 });
  } catch (error) {
    console.error("Error fetching promotion:", error);
    return NextResponse.json(
      { error: "Failed to fetch promotion" },
      { status: 500 }
    );
  }
}
