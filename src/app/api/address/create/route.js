import { getUserDetails } from "@/libs/getUserDetails";
import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Addresses are always saved to the signed-in user, never to an id from the request
    const user = await getUserDetails();
    const userId = user?.id;
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { country, state, city, postalCode, street, isDefault } = body;

    if (!userId || !country || !state || !city || !postalCode || !street) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    // If setting this address as default, unset others for the same user
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId,
        country,
        state,
        city,
        postalCode,
        street,
        isDefault: !!isDefault,
      },
    });

    return NextResponse.json({ success: true, address });
  } catch (error) {
    console.error("Error creating address:", error);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}
