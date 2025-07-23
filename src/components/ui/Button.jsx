"use client";
import { addItemToBuyNow, userWantsToBuyNow } from "@/app/slices/productSlice";
import Link from "next/link";
import { usePostHog } from "posthog-js/react";
import { useDispatch } from "react-redux";

const Button = ({ mainProduct, styles }) => {
  const dispatch = useDispatch();
  const posthog = usePostHog();
  // const category = useSelector((state) => state.product.category);

  const handleClick = () => {
    posthog.capture("buy_now_clicked", {
      product_name: mainProduct.name,
      product_price: mainProduct.price,
      category: mainProduct.cateogory,
    });
    if (!mainProduct) return;

    dispatch(userWantsToBuyNow());
    dispatch(
      addItemToBuyNow({
        id: mainProduct.id,
        name: mainProduct.name,
        imageURL: mainProduct.imageURL,
        price: mainProduct.price,
        quantity: 1,
        category: mainProduct.cateogory,
      })
    );
  };

  return (
    <Link href="/checkout" onClick={handleClick} shallow>
      <button
        className={styles}
        onClick={() => {
          console.log(mainProduct.cateogory);
        }}
      >
        Buy now
      </button>
    </Link>
  );
};

export default Button;
