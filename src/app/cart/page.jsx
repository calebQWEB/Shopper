"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { usePostHog } from "posthog-js/react";
import {
  removeItem,
  updateItemQuantity,
  userNotBuyingNow,
} from "../slices/productSlice";
import Button from "@/components/ui/Button";
import { formatPrice } from "@/libs/format";

const page = () => {
  const cart = useSelector((state) => state.product.cartItems);
  const posthog = usePostHog();
  const dispatch = useDispatch();
  const router = useRouter();

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleRemove = (product) => {
    dispatch(removeItem(product.id));
    posthog?.capture("remove_from_cart", {
      product_id: product.id,
      product_name: product.name,
      product_price: product.price,
    });
  };

  const handleCheckout = () => {
    dispatch(userNotBuyingNow());
    router.push("/checkout");
  };

  if (cart.length === 0) {
    return (
      <section className="container-page py-16">
        <div className="card mx-auto grid max-w-md place-items-center gap-3 px-6 py-14 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-secondary">
            <ShoppingBag size={26} />
          </span>
          <h1 className="text-lg font-bold">Your cart is empty</h1>
          <p className="text-sm text-slate-500">
            Browse our categories and add something you love.
          </p>
          <Link href="/#categories" className="btn btn-primary mt-2">
            Start shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container-page py-6 sm:py-8">
      <h1 className="text-2xl font-bold sm:text-3xl">Your cart</h1>
      <p className="mt-1 text-sm text-slate-500">
        {itemCount} {itemCount === 1 ? "item" : "items"}
      </p>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_340px]">
        <ul className="card divide-y divide-slate-200">
          {cart.map((product) => (
            <li key={product.id} className="flex gap-3 p-3 sm:gap-4 sm:p-4">
              <Link
                href={`/product/${product.id}`}
                className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-50 sm:h-24 sm:w-24"
              >
                <Image
                  src={product.imageURL}
                  alt={product.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/product/${product.id}`}
                      className="line-clamp-2 text-sm font-semibold hover:underline sm:text-base"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-slate-500">
                      {formatPrice(product.price)} each
                    </p>
                  </div>
                  <p className="shrink-0 font-bold">
                    {formatPrice(product.price * product.quantity)}
                  </p>
                </div>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
                  <div className="flex items-center rounded-lg border border-slate-300">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      disabled={product.quantity <= 1}
                      onClick={() =>
                        dispatch(
                          updateItemQuantity({
                            id: product.id,
                            quantity: product.quantity - 1,
                          })
                        )
                      }
                      className="grid h-8 w-8 place-items-center disabled:opacity-40"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">
                      {product.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() =>
                        dispatch(
                          updateItemQuantity({
                            id: product.id,
                            quantity: product.quantity + 1,
                          })
                        )
                      }
                      className="grid h-8 w-8 place-items-center"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      mainProduct={product}
                      quantity={product.quantity}
                      className="btn btn-ghost px-3 py-1.5 text-xs"
                    >
                      Buy only this
                    </Button>
                    <button
                      type="button"
                      onClick={() => handleRemove(product)}
                      aria-label={`Remove ${product.name}`}
                      className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="card p-5 lg:sticky lg:top-28">
          <h2 className="font-semibold">Order summary</h2>
          <dl className="mt-4 grid gap-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-600">Subtotal</dt>
              <dd className="font-semibold">{formatPrice(subtotal)}</dd>
            </div>
          </dl>
          <p className="mt-2 text-xs text-slate-500">
            You&apos;ll confirm your delivery address and pay in naira at
            checkout.
          </p>
          <div className="mt-4 flex justify-between border-t border-slate-200 pt-4">
            <span className="font-semibold">Total</span>
            <span className="text-lg font-bold">{formatPrice(subtotal)}</span>
          </div>
          <button
            type="button"
            onClick={handleCheckout}
            className="btn btn-primary mt-5 w-full py-3"
          >
            Checkout
          </button>
          <Link
            href="/#categories"
            className="mt-3 block text-center text-sm font-medium text-slate-600 hover:text-headline"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </section>
  );
};

export default page;
