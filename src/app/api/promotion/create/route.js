import { prisma } from "@/libs/prisma";
import { parseEndDate, parseStartDate } from "@/libs/promotionDates";
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
      isSpecial,
    } = await req.json();

    if (
      !title ||
      !description ||
      !type ||
      value === undefined ||
      value === "" ||
      !startDate ||
      !endDate ||
      !status ||
      !applicableTo
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

    const start = parseStartDate(startDate);
    const end = parseEndDate(endDate);
    if (isNaN(start) || isNaN(end)) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    if (applicableTo === "product" && !productIds) {
      return NextResponse.json(
        { error: "Please select at least one product for this promotion." },
        { status: 400 }
      );
    }
    if (applicableTo === "category" && !categoryIds) {
      return NextResponse.json(
        { error: "Please select at least one category for this promotion." },
        { status: 400 }
      );
    }

    const data = {
      title,
      description,
      type,
      applicableTo,
      value: parseFloat(value),
      startDate: start,
      endDate: end,
      status,
      isSpecial: Boolean(isSpecial),
      // Stored as comma-separated strings
      productIds: productIds || null,
      categoryIds: categoryIds || null,
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
