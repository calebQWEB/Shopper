import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req, context) {
  try {
    const raw = await req.json();
    const { publishedDate, restockDate, tax } = raw;
    const { id } = await context.params;

    const fieldsToKeep = {
      name: false,
      price: true,
      oldPrice: true,
      discount: true,
      description: false,
      imageURL: false,
      cateogory: false,
      quantity: true,
      status: false,
      isFeatured: false,
      sku: false,
      title: false,
      seoDescription: false,
      visibility: false,
      width: true,
      height: true,
      length: true,
      weight: true,
      tags: false,
    };

    const data = {};

    if (publishedDate) data.publishedDate = new Date(publishedDate);
    if (restockDate) data.restockDate = new Date(restockDate);

    for (const key in fieldsToKeep) {
      if (raw[key] !== undefined) {
        data[key] = fieldsToKeep[key] ? Number(raw[key]) : raw[key];
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data,
    });

    return NextResponse.json({ product: updatedProduct });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error updating product" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, context) {
  const { params } = context;
  const { id } = await params;

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  try {
    const deletedProduct = await prisma.product.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({
      message: "Product deleted successfully",
      deletedProduct,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
