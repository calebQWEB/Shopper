const statusStyles = {
  processing: "bg-amber-50 text-amber-700",
  pending: "bg-amber-50 text-amber-700",
  shipped: "bg-sky-50 text-sky-700",
  delivered: "bg-emerald-50 text-emerald-700",
  completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-rose-50 text-rose-700",
  failed: "bg-rose-50 text-rose-700",
};

// Statuses an admin can set from the control panel
export const ORDER_STATUSES = ["Processing", "Shipped", "Delivered", "Cancelled"];

export const orderRef = (reference = "") =>
  `#${reference.slice(0, 8).toUpperCase()}`;

const OrderStatus = ({ status = "" }) => (
  <span
    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
      statusStyles[status.toLowerCase()] ?? "bg-slate-100 text-slate-600"
    }`}
  >
    {status.toLowerCase()}
  </span>
);

export default OrderStatus;
