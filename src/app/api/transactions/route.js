import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const customerCode = searchParams.get("customer");

  try {
    const res = await fetch("https://api.paystack.co/transaction", {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (!result.status) {
      return NextResponse.json(
        { message: "Failed to retrieve transactions" },
        { status: 500 }
      );
    }

    // Optional: filter by customer code
    const filtered = customerCode
      ? result.data.filter(
          (txn) => txn.customer?.customer_code === customerCode
        )
      : result.data;

    return NextResponse.json(filtered);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
