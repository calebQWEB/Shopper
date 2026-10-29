import { prisma } from "@/libs/prisma";
import { parseEndDate, parseStartDate } from "@/libs/promotionDates";
import { NextResponse } from "next/server";

export async function PATCH(req, context) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    // Build data object only with present fields
    const data = {};

    if (body.title !== undefined) data.title = body.title;
    if (body.description !== undefined) data.description = body.description;
    if (body.type !== undefined) data.type = body.type;
    if (body.applicableTo !== undefined) data.applicableTo = body.applicableTo;
    if (body.isSpecial !== undefined) data.isSpecial = Boolean(body.isSpecial);

    if (body.value !== undefined) {
      if (isNaN(parseFloat(body.value))) {
        return NextResponse.json(
          { error: "Value must be a number" },
          { status: 400 }
        );
      }
      data.value = parseFloat(body.value);
    }

    if (body.startDate !== undefined) {
      const start = parseStartDate(body.startDate);
      if (isNaN(start)) {
        return NextResponse.json(
          { error: "Invalid startDate format" },
          { status: 400 }
        );
      }
      data.startDate = start;
    }

    if (body.endDate !== undefined) {
      const end = parseEndDate(body.endDate);
      if (isNaN(end)) {
        return NextResponse.json(
          { error: "Invalid endDate format" },
          { status: 400 }
        );
      }
      data.endDate = end;
    }

    if (body.status !== undefined) data.status = body.status;

    // Stored as comma-separated strings
    if (body.productIds !== undefined) data.productIds = body.productIds || null;
    if (body.categoryIds !== undefined) data.categoryIds = body.categoryIds || null;

    await prisma.promotion.update({
      where: { id: id },
      data,
    });

    return NextResponse.json({ message: "Promotion updated successfully" });
  } catch (error) {
    console.error("Error updating promotion:", error);
    return NextResponse.json(
      { error: "Error updating promotion" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  const { id } = await params;

  try {
    if (!id)
      return NextResponse.json(
        { error: "Id could not be found" },
        { status: 400 }
      );

    await prisma.promotion.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Promo deleted successfully" });
  } catch (error) {
    console.error("Error deleting promo:", error);
    return NextResponse.json(
      { error: "Error Deleting promo" },
      { status: 500 }
    );
  }
}
