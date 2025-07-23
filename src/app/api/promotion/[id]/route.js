import { prisma } from "@/libs/prisma";
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
      if (isNaN(new Date(body.startDate))) {
        return NextResponse.json(
          { error: "Invalid startDate format" },
          { status: 400 }
        );
      }
      data.startDate = new Date(body.startDate);
    }
    if (body.endDate !== undefined) {
      if (isNaN(new Date(body.endDate))) {
        return NextResponse.json(
          { error: "Invalid endDate format" },
          { status: 400 }
        );
      }
      data.endDate = new Date(body.endDate);
    }
    if (body.status !== undefined) data.status = body.status;
    if (body.productIds !== undefined) {
      if (
        data.type === "product" &&
        (!Array.isArray(body.productIds) || body.productIds.length === 0)
      ) {
        return NextResponse.json(
          { error: "Please select at least one product for this promotion." },
          { status: 400 }
        );
      }
      data.productIds = body.productIds;
    }

    if (body.categoryIds !== undefined) {
      if (
        data.type === "product" &&
        (!Array.isArray(body.categoryIds) || body.categoryIds.length === 0)
      ) {
        return NextResponse.json(
          { error: "Please select at least one category for this promotion." },
          { status: 400 }
        );
      }
      data.categoryIds = body.categoryIds;
    }

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
  const { id } = params;

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
