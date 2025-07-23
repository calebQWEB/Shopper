import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const reference = searchParams.get("reference");
  const city = searchParams.get("city");
  const country = searchParams.get("country");
  const startDate = searchParams.get("date");
  const status = searchParams.get("status");
  const email = searchParams.get("email");

  try {
    const orders = await prisma.order.findMany({
      where: {
        ...(reference && {
          reference: {
            contains: reference,
            mode: "insensitive",
          },
        }),
        ...(city && {
          city: {
            contains: city,
            mode: "insensitive",
          },
        }),
        ...(country && {
          country: {
            contains: country,
            mode: "insensitive",
          },
        }),
        ...(status && {
          status: {
            contains: status,
            mode: "insensitive",
          },
        }),
        ...(email && {
          email: {
            contains: email,
            mode: "insensitive",
          },
        }),
        ...(startDate && {
          createdAt: {
            gte: new Date(startDate),
          },
        }),
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log(orders);
    return NextResponse.json(orders);
  } catch (error) {
    console.log("Error fetching order:", error);

    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 }
    );
  }
}
