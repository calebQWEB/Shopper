"use client";
import { usePostHog } from "posthog-js/react";
import { useEffect, useState } from "react";

const PAYSTACK_SCRIPT = "https://js.paystack.co/v1/inline.js";

const PayButton = ({ userId, email, amount, shippingAddress, items, onSuccess }) => {
  const posthog = usePostHog();
  const [ready, setReady] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (window.PaystackPop) {
      setReady(true);
      return;
    }

    let script = document.querySelector(`script[src="${PAYSTACK_SCRIPT}"]`);
    if (!script) {
      script = document.createElement("script");
      script.src = PAYSTACK_SCRIPT;
      script.async = true;
      document.body.appendChild(script);
    }

    const onLoad = () => setReady(true);
    const onError = () =>
      setError("Couldn't load the payment window. Check your connection and refresh.");
    script.addEventListener("load", onLoad);
    script.addEventListener("error", onError);
    return () => {
      script.removeEventListener("load", onLoad);
      script.removeEventListener("error", onError);
    };
  }, []);

  const handlePay = () => {
    setError("");
    // Buy-now items store the category as "category", cart items as "cateogory"
    const orderItems = items.map((item) => ({
      productName: item.name,
      productPrice: item.price,
      productQuantity: item.quantity,
      productPicture: item.imageURL,
      category: item.category ?? item.cateogory,
    }));

    posthog?.capture("pay_button_clicked", {
      amount,
      email,
      userId,
      items: orderItems.map(({ productName, productQuantity, category }) => ({
        productName,
        productQuantity,
        category,
      })),
    });

    const key = process.env.NEXT_PUBLIC_PAYSTACK_PUBLISHABLE_KEY;
    if (!key) {
      setError("Payments aren't set up yet: the Paystack public key is missing.");
      return;
    }

    setPaying(true);
    const handler = window.PaystackPop.setup({
      key,
      email,
      amount: amount * 100, // Paystack requires amount in kobo
      currency: "NGN",
      metadata: {
        userId,
        shippingAddress,
        items: orderItems,
        totalPrice: amount,
      },
      callback: (response) => {
        setPaying(false);
        onSuccess(response.reference);
      },
      onClose: () => setPaying(false),
    });

    handler.openIframe();
  };

  return (
    <>
      <button
        type="button"
        onClick={handlePay}
        disabled={!ready || paying}
        className="btn btn-accent mt-4 w-full py-3 text-base"
      >
        {!ready ? "Loading payment…" : paying ? "Waiting for payment…" : "Pay now"}
      </button>
      {error && <p className="mt-2 text-center text-sm text-rose-600">{error}</p>}
    </>
  );
};

export default PayButton;
