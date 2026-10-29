"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ORDER_STATUSES } from "@/components/ui/OrderStatus";

const OrderStatusSelect = ({ orderId, status }) => {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  // Older orders may carry a status outside the editable list, so keep it selectable
  const options = ORDER_STATUSES.includes(status) ? ORDER_STATUSES : [status, ...ORDER_STATUSES];

  const handleChange = async (e) => {
    const next = e.target.value;
    const previous = value;
    setValue(next);
    setSaving(true);
    setError(false);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setValue(previous);
      setError(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <select
        value={value}
        onChange={handleChange}
        disabled={saving}
        aria-label="Order status"
        className="input w-36 py-1.5 text-xs font-semibold"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-rose-600">Couldn&apos;t save</p>}
    </div>
  );
};

export default OrderStatusSelect;
