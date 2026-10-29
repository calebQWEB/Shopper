"use client";
import { addItemToBuyNow, userWantsToBuyNow } from "@/app/slices/productSlice";
import { useRouter } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import { useDispatch } from "react-redux";

// "Buy now": checks out a single product, skipping the cart
const Button = ({
  mainProduct,
  quantity = 1,
  className = "btn btn-primary",
  disabled = false,
  children = "Buy now",
}) => {
  const dispatch = useDispatch();
  const posthog = usePostHog();
  const router = useRouter();

  const handleClick = () => {
    if (!mainProduct) return;

    posthog?.capture("buy_now_clicked", {
      product_name: mainProduct.name,
      product_price: mainProduct.price,
      category: mainProduct.cateogory,
    });

    dispatch(userWantsToBuyNow());
    dispatch(
      addItemToBuyNow({
        id: mainProduct.id,
        name: mainProduct.name,
        imageURL: mainProduct.imageURL,
        price: mainProduct.price,
        quantity,
        category: mainProduct.cateogory,
      })
    );
    router.push("/checkout");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  );
};

export default Button;
