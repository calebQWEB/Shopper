import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

//2vJIKM78ri8OBYys0m267JHOmZt_2X7wrTKxQJTUHejkcicuo

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("📩 Received Order Data:", body);

    const { userId, shippingAddress, items, totalPrice } = body;

    // Validate required fields
    // if (!userId) throw new Error("Invalid or missing userId");
    if (!shippingAddress || typeof shippingAddress !== "object")
      throw new Error("Invalid or missing shippingAddress");
    if (!Array.isArray(items) || items.length === 0)
      throw new Error("Invalid or empty items array");
    if (!totalPrice || isNaN(totalPrice))
      throw new Error("Invalid or missing totalPrice");

    // Create order
    const order = await prisma.order.create({
      data: {
        userId,
        shippingAddress,
        items,
        totalPrice,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error) {
    console.error("❌ Order Creation Error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
