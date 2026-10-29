"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const PromotionStatusToggle = ({ id, status }) => {
  const router = useRouter();
  const [active, setActive] = useState(status === "active");
  const [saving, setSaving] = useState(false);

  const toggle = async () => {
    const next = !active;
    setActive(next);
    setSaving(true);
    try {
      const res = await fetch(`/api/promotion/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next ? "active" : "inactive" }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setActive(!next);
    } finally {
      setSaving(false);
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      aria-label={active ? "Turn promotion off" : "Turn promotion on"}
      onClick={toggle}
      disabled={saving}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
        active ? "bg-emerald-500" : "bg-slate-300"
      } disabled:opacity-60`}
    >
      <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition ${active ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
};

export default PromotionStatusToggle;
