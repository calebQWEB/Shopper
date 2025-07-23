import Link from "next/link";

const OrderComponent = ({ order }) => {
  return (
    <div
      key={order.id}
      className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-gray-100"
    >
      <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-4">
        {/* Order Info */}
        <div className="space-y-2 text-sm text-center md:text-start">
          <div className="text-gray-600">
            <span className="font-semibold text-gray-800">Order:</span> #
            {order.reference.slice(0, 8).toUpperCase()}
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${
                order.status === "PENDING"
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {order.status}
            </span>
            <span className="text-gray-500">
              {new Date(order.createdAt).toLocaleString()}
            </span>
          </div>

          <div className="text-gray-700">
            Shipping to:{" "}
            <span className="font-medium">
              {order.shippingAddress.city}, {order.shippingAddress.country}
            </span>
          </div>
        </div>

        {/* Order Summary */}
        <div className="text-center md:text-right">
          <div className="text-sm text-gray-500">Total</div>
          <div className="text-lg font-bold text-gray-800">
            ₦{order.totalPrice.toLocaleString()}
          </div>

          <Link
            href={`/orders/${order.id}`}
            className="text-sm text-blue-600 hover:underline mt-2 inline-block"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderComponent;
