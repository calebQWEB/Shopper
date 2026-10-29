"use client";
import { useState } from "react";
import Link from "next/link";
import { Check, CircleCheck, ShoppingBag } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeItemFromBuyNow,
  resetCheckout,
  userNotBuyingNow,
} from "@/app/slices/productSlice";
import ReviewItems from "@/app/checkout/components/ReviewItems";
import DeliveryStep from "@/app/checkout/components/DeliveryStep";
import PaymentStep from "@/app/checkout/components/PaymentStep";
import OrderSummary from "@/app/checkout/components/OrderSummary";

const steps = ["Review items", "Delivery", "Payment"];

const Stepper = ({ current, onSelect }) => (
  <ol className="flex items-center gap-2 text-sm sm:gap-3">
    {steps.map((label, index) => {
      const done = index < current;
      const active = index === current;
      return (
        <li key={label} className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            disabled={!done}
            onClick={() => onSelect(index)}
            aria-current={active ? "step" : undefined}
            className="flex items-center gap-2 disabled:cursor-default"
          >
            <span
              className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
                done
                  ? "bg-emerald-600 text-white"
                  : active
                    ? "bg-headline text-white"
                    : "bg-slate-200 text-slate-500"
              }`}
            >
              {done ? <Check size={14} /> : index + 1}
            </span>
            <span
              className={`${active ? "font-semibold text-headline" : "text-slate-500"} ${
                active ? "inline" : "hidden sm:inline"
              }`}
            >
              {label}
            </span>
          </button>
          {index < steps.length - 1 && (
            <span className="h-px w-6 bg-slate-300 sm:w-10" aria-hidden />
          )}
        </li>
      );
    })}
  </ol>
);

const CheckoutLayout = ({ user, savedAddresses }) => {
  const [step, setStep] = useState(0);
  const [paidReference, setPaidReference] = useState(null);
  const dispatch = useDispatch();
  const buyNowStatus = useSelector((state) => state.product.BuyNowStatus);
  const cart = useSelector((state) => state.product.cartItems);
  const buyNowCart = useSelector((state) => state.product.buyNow);
  const items = buyNowStatus ? buyNowCart : cart;

  const handlePaid = (reference) => {
    if (buyNowStatus) {
      items.forEach((item) => dispatch(removeItemFromBuyNow(item.id)));
      dispatch(userNotBuyingNow());
    } else {
      dispatch(resetCheckout());
    }
    setPaidReference(reference);
  };

  if (paidReference) {
    return (
      <section className="container-page py-16">
        <div className="card mx-auto grid max-w-md place-items-center gap-3 px-6 py-12 text-center">
          <CircleCheck size={48} className="text-emerald-600" />
          <h1 className="text-xl font-bold">Payment received</h1>
          <p className="text-sm text-slate-600">
            Thanks for your order! Your reference is{" "}
            <span className="font-semibold text-headline">{paidReference}</span>.
            It will appear in your account once the payment is confirmed.
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <Link href="/dashboard?tab=orders" className="btn btn-primary">
              View my orders
            </Link>
            <Link href="/" className="btn btn-outline">
              Continue shopping
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="container-page py-16">
        <div className="card mx-auto grid max-w-md place-items-center gap-3 px-6 py-14 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-secondary">
            <ShoppingBag size={26} />
          </span>
          <h1 className="text-lg font-bold">Nothing to check out</h1>
          <p className="text-sm text-slate-500">
            Add products to your cart, or use &ldquo;Buy now&rdquo; on any product.
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold sm:text-3xl">Checkout</h1>
        <Stepper current={step} onSelect={setStep} />
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_340px]">
        <div className="card p-4 sm:p-6">
          {step === 0 && (
            <ReviewItems
              items={items}
              buyNowStatus={buyNowStatus}
              onContinue={() => setStep(1)}
            />
          )}
          {step === 1 && (
            <DeliveryStep
              user={user}
              savedAddresses={savedAddresses}
              onBack={() => setStep(0)}
              onContinue={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <PaymentStep
              user={user}
              items={items}
              onEditDelivery={() => setStep(1)}
              onPaid={handlePaid}
            />
          )}
        </div>

        <OrderSummary items={items} />
      </div>
    </section>
  );
};

export default CheckoutLayout;
