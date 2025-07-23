"use client";
import { styles } from "@/libs/styles";
import { Trash } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeItem, userNotBuyingNow } from "../slices/productSlice";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { usePostHog } from "posthog-js/react";

const page = () => {
  const cart = useSelector((state) => state.product.cartItems);
  const posthog = usePostHog();
  const dispatch = useDispatch();
  return (
    <section className={styles.padding}>
      {cart.length > 0 ? (
        <div className="grid gap-6 items-center justify-center md:items-start md:justify-start md:self-start">
          {cart.map((product) => (
            <div
              key={product.id}
              className="grid gap-2 items-center justify-center md:items-start md:justify-start"
            >
              <div className="grid md:flex items-center justify-center md:justify-start text-center gap-4 p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50 transition-shadow duration-300">
                {/* Product Image */}
                <div className="w-56 h-56 md:w-24 md:h-24 relative">
                  <Image
                    src={product.imageURL}
                    alt={product.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>

                {/* Product Details */}
                <div className="flex flex-col items-center justify-center md:justify-start">
                  <h3 className="font-semibold text-lg text-gray-800">
                    {product.name}
                  </h3>
                  <p className="text-gray-600">
                    Quantity:{" "}
                    <span className="font-medium">{product.quantity}</span>
                  </p>
                  <p className="text-green-600 font-semibold">
                    Total: ${product.price * product.quantity}
                  </p>
                </div>
                <div className="flex items-center justify-center md:justify-end gap-2">
                  <button
                    onClick={() => {
                      dispatch(removeItem(product.id));
                      posthog.capture("remove_from_cart", {
                        product_id: product.id,
                        product_name: product.name,
                        product_price: product.price,
                      });
                    }}
                  >
                    <Trash />
                  </button>
                  <Button
                    styles="bg-primary font-bold text-lg px-6 py-3 rounded-lg shadow-md hover:bg-primary-dark transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
                    mainProduct={product}
                  />
                </div>
              </div>
            </div>
          ))}

          <Link
            href="/checkout"
            onClick={() => dispatch(userNotBuyingNow())}
            shallow
          >
            <button className="bg-green-600 text-white font-bold text-lg px-6 py-3 rounded-lg shadow-md hover:bg-primary-dark transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95">
              Bulk Buy
            </button>
          </Link>
        </div>
      ) : (
        <p>Nothing in cart</p>
      )}
    </section>
  );
};

export default page;
