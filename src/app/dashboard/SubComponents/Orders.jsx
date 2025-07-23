"use client";
import OrderComponent from "./OrderComponent";

const Orders = ({ orders, loading }) => {
  if (loading) return <p>Loading orders...</p>;
  if (!orders.length) return <p>You don't have any orders</p>;

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <OrderComponent key={order.id} order={order} />
      ))}
    </div>
  );
};

export default Orders;
