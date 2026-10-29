// Server-only: uses the Paystack secret key

// Recent Paystack transactions for one customer, or null if they couldn't be loaded
export async function getCustomerTransactions(customerCode) {
  if (!customerCode || !process.env.PAYSTACK_SECRET_KEY) return null;

  try {
    const res = await fetch("https://api.paystack.co/transaction?perPage=100", {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      cache: "no-store",
    });
    const result = await res.json();
    if (!result.status) return null;
    return result.data.filter((txn) => txn.customer?.customer_code === customerCode);
  } catch (error) {
    console.error("Could not load Paystack transactions:", error);
    return null;
  }
}
