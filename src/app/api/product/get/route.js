import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const name = searchParams.get("name");
  const cateogory = searchParams.get("cateogory");
  const inStock = searchParams.get("inStock");
  const products = await prisma.product.findMany({
    where: {
      ...(name && {
        name: {
          contains: name,
          mode: "insensitive",
        },
      }),
      ...(cateogory && {
        contains: cateogory,
        mode: "insensitive",
      }),
      ...(inStock && {
        quantity: {
          gt: 0,
        },
      }),
    },

    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}
