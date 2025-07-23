import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const {
      title,
      description,
      type,
      value,
      startDate,
      endDate,
      status,
      applicableTo,
      productIds,
      categoryIds,
    } = await req.json();

    if (
      (!title || !type || !value || !startDate || !endDate,
      !status,
      !applicableTo,
      !productIds,
      !categoryIds,
      !description)
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (isNaN(parseFloat(value))) {
      return NextResponse.json(
        { error: "Value must be a number" },
        { status: 400 }
      );
    }

    if (isNaN(new Date(startDate)) || isNaN(new Date(endDate))) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    if (
      type === "product" &&
      (!Array.isArray(productIds) || productIds.length === 0)
    ) {
      return NextResponse.json(
        { error: "Please select at least one product for this promotion." },
        { status: 400 }
      );
    }

    const data = {
      title,
      description,
      type,
      applicableTo,
      value: parseFloat(value),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status,
      productIds,
      categoryIds,
    };

    await prisma.promotion.create({
      data,
    });

    return NextResponse.json(
      { success: true, message: "Promotion created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating promotion:", error);
    return NextResponse.json(
      { error: "Server Error", details: error.message },
      { status: 500 }
    );
  }
}
