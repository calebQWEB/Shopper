import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(req) {
  try {
    const { reference } = await req.json();

    if (!reference) {
      return NextResponse.json(
        { status: false, message: "No reference provided" },
        { status: 400 }
      );
    }

    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const result = await res.json();
    const data = result?.data;

    if (result.status !== true || !data || data.status !== "success") {
      return NextResponse.json(
        { status: false, message: "Transaction not successful" },
        { status: 400 }
      );
    }

    // Extract metadata
    const metadata = data.metadata;
    const email = data.customer.email;
    const customerCode = data.customer.customer_code;
    const userId = parseInt(metadata.userId);
    const totalPrice = parseFloat(metadata.totalPrice);
    const referenceId = data.reference;

    // Check if order already exists (important to avoid duplicates)
    const existing = await prisma.order.findUnique({
      where: { reference: referenceId },
    });

    if (existing) {
      return NextResponse.json({
        status: true,
        message: "Order already exists",
      });
    }

    // Create the order and related data
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          email,
          reference: referenceId,
          shippingAddress: metadata.shippingAddress,
          totalPrice,
          status: "Processing",
        },
      });

      const orderItems = metadata.items.map((item) => ({
        orderId: order.id,
        productName: item.productName,
        productPrice: item.productPrice,
        productQuantity: item.productQuantity,
        productPicture: item.productPicture,
        category: item.category,
      }));

      await tx.orderItem.createMany({ data: orderItems });

      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { totalSpent: true, customerCode: true },
      });

      const newTotal = user.totalSpent + totalPrice;

      await tx.user.update({
        where: { id: userId },
        data: {
          totalSpent: newTotal,
          spendLevel: getSpendLevel(newTotal),
          ...(user.customerCode ? {} : { customerCode }),
        },
      });
    });

    return NextResponse.json({
      status: true,
      message: "Payment verified and order created",
    });
  } catch (error) {
    console.error("❌ Verification Error:", error);
    return NextResponse.json(
      { status: false, error: error.message },
      { status: 500 }
    );
  }
}
