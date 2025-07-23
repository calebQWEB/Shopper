"use client";
import { useState } from "react";
import { ArrowDown, ArrowUp, CreditCard, Edit, Eye, Ship } from "lucide-react";
import { styles } from "@/libs/styles";
import EditProduct from "@/app/checkout/components/EditProduct";
import ShipProduct from "@/app/checkout/components/ShipProduct";
import PreviewProduct from "@/app/checkout/components/PreviewProduct";
import { useSelector } from "react-redux";
import Payment from "@/app/checkout/components/Payment";

const CheckoutLayout = () => {
  const [step, setStep] = useState(1);
  const shipping = useSelector((state) => state.product.shippingDetails) || [];
  const cart = useSelector((state) => state.product.cartItems);
  const buyNowCart = useSelector((state) => state.product.buyNow);
  const [errorPrompt, setErrorPrompt] = useState("");

  const nextStep = () => {
    if (step === 4) return;
    if (step === 2 && Object.keys(shipping).length === 0) {
      setErrorPrompt(true);
      return;
    } else {
      setErrorPrompt(false);
    }
    setStep(step + 1);

    console.log(buyNowCart);
  };

  const prevStep = () => {
    if (step === 1) return;
    setStep(step - 1);
  };
  return (
    <section className={`${styles.paddingX} py-10`}>
      <div className="bg-white rounded-xl p-8 mx-auto shadow-lg grid lg:flex items-center justify-center lg:justify-between gap-10 max-w-4xl">
        {/* Step Indicators */}
        <div className="flex lg:flex-col items-center justify-center gap-4 md:gap-6">
          {[Edit, Ship, Eye, CreditCard].map((Icon, index) => (
            <div
              key={index}
              className={`${
                step === index + 1 ? "bg-primary w-16 h-16" : "md:bg-gray-300"
              } md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 md:shadow-md`}
            >
              <Icon size={24} color="#2d334a" />
            </div>
          ))}
        </div>

        {/* Content Section */}
        <div className="w-full lg:w-[70%] grid gap-2">
          {step === 1 && <EditProduct cart={cart} buyNowCart={buyNowCart} />}
          {step === 2 && <ShipProduct />}
          {step === 3 && <PreviewProduct />}
          {step === 4 && <Payment />}
        </div>

        {/* Navigation Buttons */}
        <div className="flex lg:grid items-center justify-center gap-6 mt-6">
          <button
            className="w-14 h-14 bg-gray-400 hover:bg-gray-500 rounded-full flex items-center justify-center transition-all duration-300 shadow-md"
            onClick={prevStep}
          >
            <ArrowUp size={24} color="white" />
          </button>
          <button
            className={`${
              errorPrompt ? "bg-red -600" : "hover:bg-gray-900"
            } w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center transition-all duration-300 shadow-md text-white`}
            onClick={nextStep}
          >
            <ArrowDown size={24} color="white" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CheckoutLayout;
