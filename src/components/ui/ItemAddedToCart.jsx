"use client";
import { Check } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";

const ItemAddedToCart = () => {
  const addedToCartStatus = useSelector(
    (state) => state.product.itemAddedToCart
  );

  if (!addedToCartStatus) return null;

  return (
    <div
      role="status"
      className="fixed bottom-6 left-1/2 z-50 flex animate-toast-in items-center gap-3 rounded-full bg-headline py-2 pl-3 pr-2 text-sm font-medium text-white shadow-xl"
    >
      <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-500">
        <Check size={14} />
      </span>
      Added to cart
      <Link
        href="/cart"
        className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold hover:bg-white/20"
      >
        View cart
      </Link>
    </div>
  );
};

export default ItemAddedToCart;
