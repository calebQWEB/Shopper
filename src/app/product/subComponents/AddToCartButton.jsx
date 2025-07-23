"use client";

import { itemAddedReturn, itemIsAddedToCart } from "@/app/slices/productSlice";
import { useUtils } from "@/libs/utils";
import { ShoppingCart } from "lucide-react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const AddToCartButton = ({ mainProduct }) => {
  const { addItemsToCart } = useUtils();
  const dispatch = useDispatch();

  return (
    <button
      className="bg-blue-500 p-3 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
      onClick={() => {
        addItemsToCart(mainProduct);
        dispatch(itemIsAddedToCart());
        setTimeout(() => dispatch(itemAddedReturn()), 2000);
      }}
    >
      <ShoppingCart color="#ffffff" />
    </button>
  );
};

export default AddToCartButton;
