import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const name = searchParams.get("name");
    const email = searchParams.get("email");
    const status = searchParams.get("status");
    const spendRange = searchParams.get("spendRange");

    const spendFilters = {
      lowSpend: { gte: 0, lte: 500000 },
      mediumSpend: { gte: 500000, lte: 5000000 },
      largeSpend: { gte: 5000000, lte: 15000000 },
      highSpend: { gte: 15000000, lte: 30000000 },
    };

    const customers = await prisma.user.findMany({
      where: {
        ...(name && {
          name: {
            contains: name,
            mode: "insensitive",
          },
        }),
        ...(email && {
          email: {
            contains: email,
            mode: "insensitive",
          },
        }),
        ...(status && {
          status: { equals: status },
        }),
        ...(spendRange &&
          spendFilters[spendRange] && {
            totalSpent: spendFilters[spendRange],
          }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        createdAt: true,
        totalSpent: true,
        spendLevel: true,
        status: true,
        orders: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(customers);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}
