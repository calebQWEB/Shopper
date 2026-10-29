"use client";

import { itemAddedReturn, itemIsAddedToCart } from "@/app/slices/productSlice";
import { useUtils } from "@/libs/utils";
import { ShoppingCart } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { useDispatch } from "react-redux";

// Shows an icon-only button unless a label is passed
const AddToCartButton = ({ mainProduct, label, disabled = false, className = "" }) => {
  const { addItemsToCart } = useUtils();
  const dispatch = useDispatch();
  const posthog = usePostHog();

  const handleClick = () => {
    posthog?.capture("add_to_cart", {
      product_id: mainProduct.id,
      product_name: mainProduct.name,
      product_price: mainProduct.price,
    });
    addItemsToCart(mainProduct);
    dispatch(itemIsAddedToCart());
    setTimeout(() => dispatch(itemAddedReturn()), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-label="Add to cart"
      title="Add to cart"
      className={`btn btn-outline ${label ? "" : "px-3"} ${className}`}
    >
      <ShoppingCart size={18} />
      {label}
    </button>
  );
};

export default AddToCartButton;
