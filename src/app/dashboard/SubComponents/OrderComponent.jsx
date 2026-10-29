import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import OrderStatus, { orderRef } from "@/components/ui/OrderStatus";
import { formatDate, formatNaira } from "@/libs/format";

const OrderComponent = ({ order }) => {
  const items = order.items ?? [];
  const itemCount = items.reduce((sum, item) => sum + item.productQuantity, 0);
  const destination = [order.shippingAddress?.city, order.shippingAddress?.country]
    .filter(Boolean)
    .join(", ");

  return (
    <Link
      href={`/orders/${order.id}`}
      className="card flex items-center gap-4 p-3 transition hover:border-slate-300 hover:shadow-sm sm:p-4"
    >
      <div className="flex shrink-0 -space-x-3">
        {items.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className="relative h-12 w-12 overflow-hidden rounded-lg border-2 border-white bg-slate-100"
          >
            <Image src={item.productPicture} alt="" fill sizes="48px" className="object-cover" />
          </div>
        ))}
        {items.length > 3 && (
          <div className="grid h-12 w-12 place-items-center rounded-lg border-2 border-white bg-slate-100 text-xs font-semibold">
            +{items.length - 3}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold">{orderRef(order.reference)}</span>
          <OrderStatus status={order.status} />
        </div>
        <p className="mt-0.5 truncate text-xs text-slate-500">
          {formatDate(order.createdAt)} · {itemCount} {itemCount === 1 ? "item" : "items"}
          {destination && ` · ${destination}`}
        </p>
      </div>

      <div className="text-right">
        <p className="font-bold">{formatNaira(order.totalPrice)}</p>
      </div>
      <ChevronRight size={18} className="shrink-0 text-slate-400" />
    </Link>
  );
};

export default OrderComponent;
