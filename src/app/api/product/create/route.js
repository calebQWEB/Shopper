import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const raw = await req.json();
    const { publishedDate, restockDate } = raw;

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

    const createdProduct = await prisma.product.create({
      data,
    });

    return NextResponse.json(
      { success: true, createdProduct },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
