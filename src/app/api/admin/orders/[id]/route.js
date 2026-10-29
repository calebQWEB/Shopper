import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { requireAdmin } from "@/libs/requireAdmin";
import { ORDER_STATUSES } from "@/components/ui/OrderStatus";

export async function PATCH(req, { params }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const { status } = await req.json();

  if (!ORDER_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    const order = await prisma.order.update({
      where: { id: Number(id) },
      data: { status },
      select: { id: true, status: true },
    });
    return NextResponse.json({ order });
  } catch (err) {
    console.error("Error updating order status:", err);
    return NextResponse.json({ error: "Could not update order" }, { status: 500 });
  }
}
