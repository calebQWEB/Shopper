"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserCheck, UserX } from "lucide-react";

const CustomerStatusButton = ({ customerId, status, variant = "icon" }) => {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [saving, setSaving] = useState(false);
  const banned = status === "banned";
  const next = banned ? "active" : "banned";

  const update = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/customers/${customerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (res.ok) router.refresh();
    } finally {
      setSaving(false);
      setConfirming(false);
    }
  };

  // Unbanning is harmless; banning asks for confirmation first
  if (confirming) {
    return (
      <span className="inline-flex items-center gap-1">
        <button type="button" onClick={update} disabled={saving} className="rounded-md bg-rose-600 px-2 py-1 text-xs font-semibold text-white hover:bg-rose-700">
          {saving ? "Banning…" : "Ban"}
        </button>
        <button type="button" onClick={() => setConfirming(false)} className="rounded-md px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100">
          Cancel
        </button>
      </span>
    );
  }

  const onClick = banned ? update : () => setConfirming(true);
  const Icon = banned ? UserCheck : UserX;
  const label = banned ? "Unban" : "Ban";

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={saving}
        className={`btn ${banned ? "btn-outline" : "border border-rose-300 bg-white text-rose-700 hover:bg-rose-50"}`}
      >
        <Icon size={16} />
        {saving ? "Saving…" : `${label} customer`}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={saving}
      title={`${label} customer`}
      aria-label={`${label} customer`}
      className={`grid h-8 w-8 place-items-center rounded-lg ${
        banned ? "text-emerald-600 hover:bg-emerald-50" : "text-slate-500 hover:bg-rose-50 hover:text-rose-600"
      }`}
    >
      <Icon size={16} />
    </button>
  );
};

export default CustomerStatusButton;
