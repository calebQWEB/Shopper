"use client";
import { Check } from "lucide-react";
import { useSelector } from "react-redux";

const ItemAddedToCart = () => {
  const addedToCartStatus = useSelector(
    (state) => state.product.itemAddedToCart
  );
  return (
    addedToCartStatus && (
      <div className="fixed top-50 left-1/2 -translate-x-1/2 flex items-center gap-3 px-5 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 ease-in-out animate-slideDown z-50">
        <Check className="w-6 h-6" />
        <span>Item Added</span>
      </div>
    )
  );
};

export default ItemAddedToCart;
