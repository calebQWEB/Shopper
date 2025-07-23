import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const title = searchParams.get("title");
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const applicableTo = searchParams.get("applicableTo");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const promotions = await prisma.promotion.findMany({
      where: {
        ...(title && {
          title: {
            contains: title,
            mode: "insensitive",
          },
        }),
        ...(type && {
          type: {
            equals: type,
            mode: "insensitive",
          },
        }),
        ...(status && {
          status: {
            equals: status,
            mode: "insensitive",
          },
        }),
        ...(applicableTo && {
          applicableTo: {
            equals: applicableTo,
            mode: "insensitive",
          },
        }),
      },

      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(promotions, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to fetch promotions",
      status: 500,
    });
  }
}
