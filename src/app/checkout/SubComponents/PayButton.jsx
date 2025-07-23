"use client";
import { useRouter } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const PayButton = ({ email, amount, userAddress }) => {
  const posthog = usePostHog();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const shipping = useSelector((state) => state.product.shippingDetails);
  const cartItems = useSelector((state) => state.product.cartItems);
  const buyNowCart = useSelector((state) => state.product.buyNow);
  const buyNowStatus = useSelector((state) => state.product.BuyNowStatus);
  // const bulkBuyCategory = useSelector((state) => state.product.bulkBuyCategory);

  useEffect(() => {
    if (
      !document.querySelector(
        'script[src="https://js.paystack.co/v1/inline.js"]'
      )
    ) {
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/user");
        const data = await res.json();

        if (!res.ok) {
          console.log(data);
        }

        setUser(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserSession();
  }, []);

  if (isLoading) {
    return <p className="text-center">Loading...</p>;
  }

  const handlePay = async () => {
    posthog.capture("pay_button_clicked", {
      amount,
      email,
      userId: user?.user?.id,
      items: buyNowStatus
        ? [
            {
              productName: buyNowCart[0]?.name,
              productQuantity: buyNowCart[0]?.quantity,
              category: buyNowCart[0]?.category,
            },
          ]
        : cartItems.map((item) => ({
            productName: item.name,
            productQuantity: item.quantity,
            category: item.category,
          })),
    });

    if (!user || !user.user?.id) {
      alert(
        "User information is not loaded yet. Please refresh and try again."
      );
      return;
    }

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLISHABLE_KEY,
      email,
      amount: amount * 100, // Paystack requires amount in kobo
      currency: "NGN",
      metadata: {
        userId: user?.user?.id,
        shippingAddress: userAddress,
        items: buyNowStatus
          ? [
              {
                productName: buyNowCart[0]?.name,
                productPrice: buyNowCart[0]?.price,
                productQuantity: buyNowCart[0]?.quantity,
                productPicture: buyNowCart[0]?.imageURL,
                category: buyNowCart[0]?.category,
              },
            ]
          : cartItems.map((item) => ({
              productName: item.name,
              productPrice: item.price,
              productQuantity: item.quantity,
              productPicture: item.imageURL,
              category: item.cateogory,
            })),
        totalPrice: amount,
      },
      callback: (response) => {
        console.log("✅ Payment successful:", response);
        alert("Payment successful! Transaction Ref: " + response.reference);
        router.push("/dashboard");
      },
      onClose: () => {
        console.log("❌ Payment window closed");
      },
    });

    handler.openIframe();
  };

  return (
    <button
      onClick={handlePay}
      className="bg-green-500 w-auto text-headline text-center self-start font-montserrat font-semibold p-3 rounded-lg hover:scale-105 active:scale-95"
    >
      Pay Now
    </button>
  );
};

export default PayButton;
