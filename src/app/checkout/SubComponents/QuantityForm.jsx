"use client";
import {
  updateItemQuantity,
  updateItemQuantityFromBuyNow,
} from "@/app/slices/productSlice";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

const QuantityForm = ({ productQuantity, productID, initialQuantity = 1 }) => {
  const userBuyNowStatus = useSelector((state) => state.product.BuyNowStatus);
  const [activeQuantity, setActiveQuantity] = useState(false);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      quantity: initialQuantity,
    },
  });
  const dispatch = useDispatch();

  const onSubmit = (data) => {
    setActiveQuantity(false);
    const payload = { id: productID, quantity: Number(data.quantity) };

    if (userBuyNowStatus) {
      dispatch(updateItemQuantityFromBuyNow(payload));
    } else {
      dispatch(updateItemQuantity(payload));
    }

    reset({ quantity: initialQuantity }); // Resets to initialQuantity
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-3">
      {/* Quantity Input Field */}
      <input
        type="number"
        {...register("quantity")}
        className={`border border-gray-300 rounded-lg p-2 text-center w-16 transition-all duration-300 
          ${activeQuantity ? "opacity-100 scale-100" : "opacity-0 scale-0"}
        `}
        placeholder={productQuantity}
        aria-label="Edit quantity"
      />

      {/* Edit Button */}
      {!activeQuantity && (
        <button
          type="button"
          onClick={() => setActiveQuantity(true)}
          className="bg-primary px-3 py-1 rounded-lg font-semibold hover:scale-105 transition-all"
        >
          Edit
        </button>
      )}

      {/* Save Button */}
      {activeQuantity && (
        <button
          type="submit"
          className="bg-green-500 text-white px-3 py-1 rounded-lg font-semibold hover:bg-green-600 transition-all"
        >
          Save
        </button>
      )}
    </form>
  );
};

export default QuantityForm;
