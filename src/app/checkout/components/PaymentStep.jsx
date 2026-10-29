"use client";
import { useEffect } from "react";
import { MapPin, ShieldCheck } from "lucide-react";
import { useSelector } from "react-redux";
import PayButton from "../SubComponents/PayButton";
import { getSubtotal } from "./OrderSummary";
import { formatAddress } from "./DeliveryStep";
import { formatNaira, toNaira } from "@/libs/format";

const PaymentStep = ({ user, items, onEditDelivery, onPaid }) => {
  const shipping = useSelector((state) => state.product.shippingDetails) || {};
  const hasDelivery = Boolean(shipping.fullName && shipping.city);
  const amount = toNaira(getSubtotal(items));

  // Delivery details saved by an older version of checkout use a different shape
  useEffect(() => {
    if (!hasDelivery) onEditDelivery();
  }, [hasDelivery, onEditDelivery]);

  if (!hasDelivery) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold">Confirm and pay</h2>

      <div className="mt-4 flex items-start gap-3 rounded-lg border border-slate-200 p-4 text-sm">
        <MapPin size={18} className="mt-0.5 shrink-0 text-slate-500" />
        <div className="flex-1">
          <p className="font-semibold">{shipping.fullName}</p>
          <p className="text-slate-600">{formatAddress(shipping)}</p>
          {shipping.landmark && <p className="text-slate-500">Landmark: {shipping.landmark}</p>}
          <p className="mt-1 text-slate-500">
            {shipping.phone} · {shipping.email}
          </p>
        </div>
        <button type="button" onClick={onEditDelivery} className="text-sm font-semibold text-headline hover:underline">
          Change
        </button>
      </div>

      <div className="mt-6 rounded-lg bg-slate-50 p-4">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-slate-600">Total to pay</span>
          <span className="text-2xl font-bold">{formatNaira(amount)}</span>
        </div>
        <PayButton
          userId={user.id}
          email={shipping.email}
          amount={amount}
          shippingAddress={shipping}
          items={items}
          onSuccess={onPaid}
        />
        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-500">
          <ShieldCheck size={14} className="text-emerald-600" />
          Secure payment powered by Paystack
        </p>
      </div>
    </div>
  );
};

export default PaymentStep;
