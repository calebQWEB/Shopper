"use client";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Button from "./Button";
import { useUtils } from "@/libs/utils";
import { useDispatch } from "react-redux";
import { itemIsAddedToCart, itemAddedReturn } from "@/app/slices/productSlice";
import { usePostHog } from "posthog-js/react";

const ProductCard = ({ product }) => {
  const { addItemsToCart } = useUtils();
  const posthog = usePostHog();
  const dispatch = useDispatch();

  const handleClick = () => {
    posthog.capture("product_viewed", {
      product_id: product.id,
      product_name: product.name,
      product_price: product.price,
    });
  };

  return (
    <div className="grid items-center justify-center lg:items-start lg:justify-start gap-3 w-[300px] relative">
      <Link href={`/product/${product.id}`} onClick={handleClick}>
        <Image
          src={product.imageURL}
          alt={product.name}
          width={300}
          height={300}
          className="rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
        />
      </Link>

      <span className="font-zen-dots font-bold text-xl text-center md:text-start">
        {product.name}
      </span>
      <div className="flex items-center justify-center lg:justify-start gap-2">
        <button
          className="bg-accent p-3 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
          onClick={() => {
            posthog.capture("add_to_cart", {
              product_id: product.id,
              product_name: product.name,
              product_price: product.price,
            });
            addItemsToCart(product);
            dispatch(itemIsAddedToCart());
            setTimeout(() => dispatch(itemAddedReturn()), 2000);
          }}
        >
          <ShoppingCart />
        </button>
        <Button
          mainProduct={product}
          styles="bg-blue-300 rounded-lg text-white font-bold text-lg px-6 py-3 shadow-md hover:bg-primary-dark transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
        />
      </div>
    </div>
  );
};

export default ProductCard;
