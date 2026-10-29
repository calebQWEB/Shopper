"use client";
import Image from "next/image";
import { formatNaira, formatPrice, toNaira } from "@/libs/format";

export const getSubtotal = (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

const OrderSummary = ({ items }) => {
  const subtotal = getSubtotal(items);

  return (
    <aside className="card p-5 lg:sticky lg:top-28">
      <h2 className="font-semibold">Order summary</h2>
      <ul className="mt-4 grid gap-3">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-50">
              <Image src={item.imageURL} alt="" fill sizes="48px" className="object-cover" />
              <span className="absolute -right-0 -top-0 grid h-5 min-w-5 place-items-center rounded-bl-lg bg-headline px-1 text-[10px] font-bold text-white">
                {item.quantity}
              </span>
            </div>
            <p className="line-clamp-2 flex-1 text-sm">{item.name}</p>
            <p className="text-sm font-semibold">
              {formatPrice(item.price * item.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <dl className="mt-4 grid gap-2 border-t border-slate-200 pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-slate-600">Subtotal</dt>
          <dd className="font-semibold">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="font-semibold">You pay</dt>
          <dd className="text-lg font-bold">{formatNaira(toNaira(subtotal))}</dd>
        </div>
      </dl>
      <p className="mt-2 text-xs text-slate-500">
        Charged in naira via Paystack.
      </p>
    </aside>
  );
};

export default OrderSummary;
