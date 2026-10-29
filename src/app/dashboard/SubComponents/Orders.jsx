import Link from "next/link";
import OrderComponent from "./OrderComponent";

const Orders = ({ orders }) => {
  if (!orders.length) {
    return (
      <div className="card grid place-items-center gap-2 px-6 py-14 text-center">
        <p className="font-semibold">You don&apos;t have any orders yet</p>
        <p className="text-sm text-slate-500">Your order history will appear here.</p>
        <Link href="/#categories" className="btn btn-primary mt-2">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-semibold">Your orders</h2>
      <div className="mt-3 grid gap-3">
        {orders.map((order) => (
          <OrderComponent key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default Orders;
