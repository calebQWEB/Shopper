import { NextResponse } from "next/server";
import { headers } from "next/headers";
import crypto from "crypto";
import { prisma } from "@/libs/prisma";
import { getSpendLevel } from "@/libs/getSpendLevel";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    console.log("🚀 Webhook called!");

    const rawBody = await req.arrayBuffer();
    console.log("✅ Raw body received");

    const headList = await headers(); // ✅ Await here
    const paystackSignature = headList.get("x-paystack-signature");
    const secret = process.env.PAYSTACK_SECRET_KEY;

    const hash = crypto
      .createHmac("sha512", secret)
      .update(Buffer.from(rawBody))
      .digest("hex");

    console.log("🔐 Signature calculated:", hash);
    console.log("📦 Paystack signature:", paystackSignature);

    if (hash !== paystackSignature) {
      console.log("❌ Invalid signature");
      return NextResponse.json(
        { status: false, message: "Invalid signature" },
        { status: 401 }
      );
    }

    const body = JSON.parse(Buffer.from(rawBody).toString("utf-8"));
    const event = body.event;
    const data = body.data;

    console.log("📬 Event:", event);
    console.log("📨 Data:", data);

    if (event === "charge.success") {
      const { metadata } = data;
      const reference = data.reference;
      const email = data.customer.email;
      const customerCode = data.customer.customer_code;
      const userId = parseInt(metadata.userId);
      const totalPrice = parseFloat(metadata.totalPrice);

      console.log("📝 Creating order with metadata:", metadata);

      try {
        await prisma.$transaction(
          async (tx) => {
            const order = await tx.order.create({
              data: {
                userId,
                email,
                reference,
                shippingAddress: metadata.shippingAddress,
                totalPrice,
                status: "Processing",
              },
            });

            const orderItemsData = metadata.items.map((item) => ({
              orderId: order.id,
              productName: item.productName,
              productPrice: item.productPrice,
              productQuantity: item.productQuantity,
              productPicture: item.productPicture,
              category: item.category,
            }));

            await tx.orderItem.createMany({
              data: orderItemsData,
            });

            const userSpent = await tx.user.findUnique({
              where: { id: userId },
              select: { totalSpent: true },
            });

            const newSpendLevel = userSpent.totalSpent + totalPrice;
            const spendLevel = getSpendLevel(newSpendLevel);

            const existingUser = await tx.user.findUnique({
              where: { id: userId },
              select: { customerCode: true },
            });

            await tx.user.update({
              where: { id: userId },
              data: {
                totalSpent: newSpendLevel,
                spendLevel: spendLevel,
                ...(existingUser.customerCode ? {} : { customerCode }),
              },
            });
            return order;
          },

          {
            timeout: 20000,
            maxWait: 4000,
          }
        );

        console.log(
          "✅ Transaction successful: order, items, and totalSpent saved!"
        );
      } catch (error) {
        console.error("❌ Transaction failed:", error);
      }
    }

    return NextResponse.json({ status: true });
  } catch (error) {
    console.error("❌ Webhook Error:", error);
    return NextResponse.json(
      { status: false, error: error.message },
      { status: 500 }
    );
  }
}
