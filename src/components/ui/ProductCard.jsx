"use client";
import Image from "next/image";
import Link from "next/link";
import { usePostHog } from "posthog-js/react";
import Button from "./Button";
import AddToCartButton from "@/app/product/subComponents/AddToCartButton";
import { formatPrice, getDiscount } from "@/libs/format";

const ProductCard = ({ product }) => {
  const posthog = usePostHog();
  const discount = getDiscount(product);
  const outOfStock = product.status === "out_of_stock";
  const href = `/product/${product.id}`;

  const handleClick = () => {
    posthog?.capture("product_viewed", {
      product_id: product.id,
      product_name: product.name,
      product_price: product.price,
    });
  };

  return (
    <article className="card group flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg">
      <Link
        href={href}
        onClick={handleClick}
        className="relative block aspect-square overflow-hidden bg-slate-50"
      >
        <Image
          src={product.imageURL}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        {discount > 0 && (
          <span className="absolute left-2 top-2 rounded-md bg-accent px-2 py-0.5 text-xs font-bold text-headline">
            -{discount}%
          </span>
        )}
        {outOfStock && (
          <span className="absolute inset-x-0 bottom-0 bg-headline/85 py-1 text-center text-xs font-semibold text-white">
            Out of stock
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="text-xs capitalize text-slate-500">{product.cateogory}</p>
        <Link
          href={href}
          onClick={handleClick}
          className="mt-0.5 line-clamp-2 text-sm font-semibold text-headline hover:underline"
        >
          {product.name}
        </Link>
        <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
          <span className="font-bold text-headline">
            {formatPrice(product.price)}
          </span>
          {discount > 0 && (
            <span className="text-xs text-slate-400 line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>

        <div className="mt-auto flex gap-2 pt-3">
          <Button
            mainProduct={product}
            disabled={outOfStock}
            className="btn btn-primary flex-1 px-3 py-2"
          />
          <AddToCartButton
            mainProduct={product}
            disabled={outOfStock}
            className="py-2"
          />
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
