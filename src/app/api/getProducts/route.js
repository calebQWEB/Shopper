import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  if (req.method !== "GET") {
    return NextResponse.json(
      { message: "Method Not Allowed" },
      { status: 405 }
    );
  }
  try {
    const products = await prisma.product.findMany({
      select: { id: true, name: true },
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
