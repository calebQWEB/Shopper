import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { requireAdmin } from "@/libs/requireAdmin";

const STATUSES = ["active", "banned"];

export async function PATCH(req, { params }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const { status } = await req.json();

  if (!STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: Number(id) }, select: { role: true } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (user.role === "ADMIN") {
      return NextResponse.json({ error: "Admins can't be banned" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: Number(id) },
      data: { status },
      select: { id: true, status: true },
    });
    return NextResponse.json({ user: updated });
  } catch (err) {
    console.error("Error updating customer status:", err);
    return NextResponse.json({ error: "Could not update customer" }, { status: 500 });
  }
}
