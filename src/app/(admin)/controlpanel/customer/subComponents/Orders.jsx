import OrderComponent from "@/app/dashboard/SubComponents/OrderComponent";
import React from "react";

const Orders = ({ orders }) => {
  return (
    <div className="grid gap-3">
      {orders.map((order) => (
        <OrderComponent key={order.id} order={order} />
      ))}
    </div>
  );
};

export default Orders;
